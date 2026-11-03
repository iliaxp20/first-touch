import { useEffect, useRef, useState, useCallback } from 'react';
import { ConnectedViewer, ChatMessage, TacticalPlayer, TacticalDrawing } from '../types/tactics.types';

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

interface UseTacticsSocketProps {
  boardId: string;
  currentUser: {
    id: string;
    name: string;
    phone?: string;
  };
  onRemotePlayerMove?: (playerId: string, x: number, y: number) => void;
  onRemotePlayerUpdated?: (playerId: string, name?: string, number?: number, position?: string) => void;
  onRemoteBallMoved?: (x: number, y: number) => void;
  onRemoteDrawingAdded?: (drawing: TacticalDrawing) => void;
  onDrawingsCleared?: () => void;
  onBoardReset?: (players: TacticalPlayer[]) => void;
  onInitialBoardLoaded?: (
    players: TacticalPlayer[],
    title: string,
    drawings?: TacticalDrawing[],
    ball?: { x: number; y: number },
  ) => void;
}

export const useTacticsSocket = ({
  boardId,
  currentUser,
  onRemotePlayerMove,
  onRemotePlayerUpdated,
  onRemoteBallMoved,
  onRemoteDrawingAdded,
  onDrawingsCleared,
  onBoardReset,
  onInitialBoardLoaded,
}: UseTacticsSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [viewers, setViewers] = useState<ConnectedViewer[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Safe send helper
  const send = useCallback((payload: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  }, []);

  // WebRTC: Create or get peer connection for remote viewer
  const getOrCreatePeerConnection = useCallback(
    (remoteViewerId: string) => {
      let pc = peerConnectionsRef.current.get(remoteViewerId);
      if (pc) return pc;

      pc = new RTCPeerConnection(RTC_CONFIG);
      peerConnectionsRef.current.set(remoteViewerId, pc);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc!.addTrack(track, localStreamRef.current!);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          send({
            type: 'WEBRTC_SIGNAL',
            boardId,
            targetId: remoteViewerId,
            signalType: 'candidate',
            payload: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        let audio = audioElementsRef.current.get(remoteViewerId);
        if (!audio) {
          audio = new Audio();
          audio.autoplay = true;
          audioElementsRef.current.set(remoteViewerId, audio);
        }
        audio.srcObject = event.streams[0];
        audio.play().catch((err) => {
          console.warn('Audio play autoplay policy warning:', err);
        });
      };

      return pc;
    },
    [boardId, send],
  );

  // Handle incoming WebRTC signaling
  const handleWebRtcSignal = useCallback(
    async (fromId: string, signalType: string, payload: any) => {
      try {
        const pc = getOrCreatePeerConnection(fromId);

        if (signalType === 'offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(payload));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          send({
            type: 'WEBRTC_SIGNAL',
            boardId,
            targetId: fromId,
            signalType: 'answer',
            payload: answer,
          });
        } else if (signalType === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(payload));
        } else if (signalType === 'candidate') {
          await pc.addIceCandidate(new RTCIceCandidate(payload));
        }
      } catch (err: any) {
        console.warn('WebRTC signal handling notice:', err.message);
      }
    },
    [boardId, getOrCreatePeerConnection, send],
  );

  // Toggle WebRTC Voice on/off
  const toggleVoice = useCallback(async () => {
    if (isVoiceActive) {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
      audioElementsRef.current.forEach((a) => {
        a.pause();
        a.srcObject = null;
      });
      audioElementsRef.current.clear();

      setIsVoiceActive(false);
      send({
        type: 'VOICE_STATUS',
        boardId,
        isMuted: true,
        isSpeaking: false,
      });
      return;
    }

    try {
      setAudioError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      localStreamRef.current = stream;
      setIsVoiceActive(true);
      setIsMuted(false);

      send({
        type: 'VOICE_STATUS',
        boardId,
        isMuted: false,
        isSpeaking: true,
      });

      viewers.forEach(async (viewer) => {
        if (viewer.id !== currentUser.id) {
          const pc = getOrCreatePeerConnection(viewer.id);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          send({
            type: 'WEBRTC_SIGNAL',
            boardId,
            targetId: viewer.id,
            signalType: 'offer',
            payload: offer,
          });
        }
      });
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setAudioError('دسترسی به میکروفون داده نشد یا میکروفون یافت نشد.');
    }
  }, [boardId, currentUser.id, getOrCreatePeerConnection, isVoiceActive, send, viewers]);

  // Toggle Mute / Unmute
  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) return;
    const newMuted = !isMuted;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !newMuted;
    });
    setIsMuted(newMuted);

    send({
      type: 'VOICE_STATUS',
      boardId,
      isMuted: newMuted,
      isSpeaking: !newMuted,
    });
  }, [boardId, isMuted, send]);

  // Realtime Player Move
  const sendPlayerMove = useCallback(
    (playerId: string, x: number, y: number) => {
      send({
        type: 'PLAYER_MOVE',
        boardId,
        playerId,
        x,
        y,
      });
    },
    [boardId, send],
  );

  // Realtime Player Edit (Name, Number, Position)
  const sendPlayerEdit = useCallback(
    (playerId: string, name: string, number: number, position: string) => {
      send({
        type: 'PLAYER_EDIT',
        boardId,
        playerId,
        name,
        number,
        position,
      });
    },
    [boardId, send],
  );

  // Realtime Ball Move
  const sendBallMove = useCallback(
    (x: number, y: number) => {
      send({
        type: 'BALL_MOVE',
        boardId,
        x,
        y,
      });
    },
    [boardId, send],
  );

  // Realtime Drawing Add (Pen, Arrow, Shape)
  const sendDrawingAdd = useCallback(
    (drawing: TacticalDrawing) => {
      send({
        type: 'DRAW_ADD',
        boardId,
        drawing,
      });
    },
    [boardId, send],
  );

  // Realtime Drawing Clear
  const sendDrawingClear = useCallback(() => {
    send({
      type: 'DRAW_CLEAR',
      boardId,
    });
  }, [boardId, send]);

  // Realtime Reset Board
  const sendResetBoard = useCallback(() => {
    send({
      type: 'RESET_BOARD',
      boardId,
    });
  }, [boardId, send]);

  // Realtime Chat Message
  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      send({
        type: 'CHAT_MESSAGE',
        boardId,
        text,
      });
    },
    [boardId, send],
  );

  // Initialize WebSocket connection
  useEffect(() => {
    if (!boardId) return;

    const hostname = window.location.hostname || 'localhost';
    const wsUrl = `ws://${hostname}:4001`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      send({
        type: 'JOIN',
        boardId,
        user: currentUser,
      });
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case 'ROOM_STATE':
            setViewers(msg.viewers || []);
            if (msg.board?.players && onInitialBoardLoaded) {
              onInitialBoardLoaded(
                msg.board.players,
                msg.board.title || 'تخته تاکتیک',
                msg.board.drawings || [],
                msg.board.ball,
              );
            }
            break;

          case 'VIEWER_JOINED':
            setViewers(msg.viewers || []);
            break;

          case 'VIEWER_LEFT':
            setViewers(msg.viewers || []);
            if (msg.userId && peerConnectionsRef.current.has(msg.userId)) {
              peerConnectionsRef.current.get(msg.userId)?.close();
              peerConnectionsRef.current.delete(msg.userId);
            }
            break;

          case 'PLAYER_MOVED':
            if (onRemotePlayerMove) {
              onRemotePlayerMove(msg.playerId, msg.x, msg.y);
            }
            break;

          case 'PLAYER_UPDATED':
            if (onRemotePlayerUpdated) {
              onRemotePlayerUpdated(msg.playerId, msg.name, msg.number, msg.position);
            }
            break;

          case 'BALL_MOVED':
            if (onRemoteBallMoved) {
              onRemoteBallMoved(msg.x, msg.y);
            }
            break;

          case 'DRAW_ADDED':
            if (onRemoteDrawingAdded && msg.drawing) {
              onRemoteDrawingAdded(msg.drawing);
            }
            break;

          case 'DRAW_CLEARED':
            if (onDrawingsCleared) {
              onDrawingsCleared();
            }
            break;

          case 'BOARD_RESET':
            if (onBoardReset && msg.players) {
              onBoardReset(msg.players);
            }
            break;

          case 'CHAT_NEW':
            if (msg.message) {
              setMessages((prev) => [...prev, msg.message]);
            }
            break;

          case 'VIEWER_VOICE_UPDATED':
            setViewers((prev) =>
              prev.map((v) =>
                v.id === msg.userId
                  ? { ...v, isMuted: msg.isMuted, isSpeaking: msg.isSpeaking }
                  : v,
              ),
            );
            break;

          case 'WEBRTC_SIGNAL':
            handleWebRtcSignal(msg.fromId, msg.signalType, msg.payload);
            break;

          default:
            break;
        }
      } catch (err: any) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.warn('Tactics WebSocket connection error:', err);
      setIsConnected(false);
    };

    return () => {
      ws.close();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
      audioElementsRef.current.forEach((a) => a.pause());
      audioElementsRef.current.clear();
    };
  }, [boardId, currentUser.id]);

  return {
    isConnected,
    viewers,
    messages,
    isVoiceActive,
    isMuted,
    audioError,
    toggleVoice,
    toggleMute,
    sendPlayerMove,
    sendPlayerEdit,
    sendBallMove,
    sendDrawingAdd,
    sendDrawingClear,
    sendResetBoard,
    sendMessage,
  };
};

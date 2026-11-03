import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { WebSocketServer, WebSocket } from 'ws';
import { TacticsService } from './tactics.service';

export interface ConnectedViewer {
  id: string;
  name: string;
  phone?: string;
  boardId: string;
  joinedAt: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
}

interface SocketClientData {
  viewer: ConnectedViewer;
  ws: WebSocket;
}

@Injectable()
export class TacticsWsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('TacticsWebSocket');
  private wss: WebSocketServer | null = null;

  // Map of boardId -> Set of sockets
  private rooms = new Map<string, Set<WebSocket>>();
  // Map of socket -> SocketClientData
  private socketToViewer = new Map<WebSocket, SocketClientData>();

  constructor(private readonly tacticsService: TacticsService) {}

  onModuleInit() {
    const WS_PORT = 4001;
    try {
      this.wss = new WebSocketServer({ port: WS_PORT }, () => {
        this.logger.log(`⚡ Real-Time Tactics WebSocket Server running on ws://localhost:${WS_PORT}`);
      });

      this.wss.on('connection', (ws: WebSocket) => {
        this.logger.log('Client connected to Tactics WebSocket');

        ws.on('message', (raw: string) => {
          try {
            const data = JSON.parse(raw.toString());
            this.handleMessage(ws, data);
          } catch (err: any) {
            this.logger.error(`Error parsing WS message: ${err.message}`);
          }
        });

        ws.on('close', () => {
          this.handleDisconnect(ws);
        });

        ws.on('error', (err) => {
          this.logger.warn(`WS client socket error: ${err.message}`);
          this.handleDisconnect(ws);
        });
      });

      this.wss.on('error', (err: any) => {
        this.logger.error(`WebSocket Server error: ${err.message}`);
      });
    } catch (err: any) {
      this.logger.error(`Failed to initialize WebSocket Server: ${err.message}`);
    }
  }

  onModuleDestroy() {
    if (this.wss) {
      this.wss.close();
      this.logger.log('Tactics WebSocket Server closed cleanly');
    }
  }

  private handleMessage(ws: WebSocket, data: any) {
    const { type, boardId } = data;
    if (!type || !boardId) return;

    switch (type) {
      case 'JOIN': {
        const user = data.user || {};
        const viewer: ConnectedViewer = {
          id: user.id || `usr-${Math.random().toString(36).substring(2, 8)}`,
          name: user.name?.trim() || 'کاربر میهمان',
          phone: user.phone || '',
          boardId,
          joinedAt: new Date().toISOString(),
          isMuted: true,
          isSpeaking: false,
        };

        // Register in room
        if (!this.rooms.has(boardId)) {
          this.rooms.set(boardId, new Set());
        }
        this.rooms.get(boardId)!.add(ws);
        this.socketToViewer.set(ws, { viewer, ws });

        const board = this.tacticsService.getBoard(boardId);
        const currentViewers = this.getViewersInRoom(boardId);

        // Send room state to the newly joined client
        this.send(ws, {
          type: 'ROOM_STATE',
          board,
          currentUserId: viewer.id,
          viewers: currentViewers,
        });

        // Broadcast to everyone else in room that a viewer joined
        this.broadcastToRoom(
          boardId,
          {
            type: 'VIEWER_JOINED',
            viewer,
            viewers: currentViewers,
          },
          ws, // exclude sender
        );
        break;
      }

      case 'PLAYER_MOVE': {
        const { playerId, x, y } = data;
        if (!playerId || x === undefined || y === undefined) return;

        // Persist update
        this.tacticsService.updatePlayerPosition(boardId, playerId, x, y);

        // Broadcast to others in room
        const clientData = this.socketToViewer.get(ws);
        this.broadcastToRoom(
          boardId,
          {
            type: 'PLAYER_MOVED',
            boardId,
            playerId,
            x,
            y,
            senderId: clientData?.viewer.id,
          },
          ws, // exclude sender
        );
        break;
      }

      case 'PLAYER_EDIT': {
        const { playerId, name, number, position } = data;
        if (!playerId) return;

        this.tacticsService.updatePlayerDetails(boardId, playerId, { name, number, position });
        this.broadcastToRoom(boardId, {
          type: 'PLAYER_UPDATED',
          boardId,
          playerId,
          name,
          number,
          position,
        });
        break;
      }

      case 'BALL_MOVE': {
        const { x, y } = data;
        if (x === undefined || y === undefined) return;

        this.tacticsService.updateBallPosition(boardId, x, y);
        const clientData = this.socketToViewer.get(ws);
        this.broadcastToRoom(
          boardId,
          {
            type: 'BALL_MOVED',
            boardId,
            x,
            y,
            senderId: clientData?.viewer.id,
          },
          ws, // exclude sender
        );
        break;
      }

      case 'DRAW_ADD': {
        const { drawing } = data;
        if (!drawing || !drawing.tool) return;

        this.tacticsService.addDrawing(boardId, drawing);
        const clientData = this.socketToViewer.get(ws);
        this.broadcastToRoom(
          boardId,
          {
            type: 'DRAW_ADDED',
            boardId,
            drawing,
            senderId: clientData?.viewer.id,
          },
          ws, // exclude sender
        );
        break;
      }

      case 'DRAW_CLEAR': {
        this.tacticsService.clearDrawings(boardId);
        this.broadcastToRoom(boardId, {
          type: 'DRAW_CLEARED',
          boardId,
        });
        break;
      }

      case 'RESET_BOARD': {
        const board = this.tacticsService.resetBoard(boardId);
        this.broadcastToRoom(boardId, {
          type: 'BOARD_RESET',
          players: board.players,
        });
        break;
      }

      case 'CHAT_MESSAGE': {
        const { text } = data;
        if (!text || typeof text !== 'string') return;

        const clientData = this.socketToViewer.get(ws);
        const chatItem = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          text: text.trim().slice(0, 500),
          senderName: clientData?.viewer.name || 'کاربر',
          senderId: clientData?.viewer.id || 'unknown',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        };

        this.broadcastToRoom(boardId, {
          type: 'CHAT_NEW',
          message: chatItem,
        });
        break;
      }

      case 'VOICE_STATUS': {
        const clientData = this.socketToViewer.get(ws);
        if (clientData) {
          if (data.isMuted !== undefined) clientData.viewer.isMuted = !!data.isMuted;
          if (data.isSpeaking !== undefined) clientData.viewer.isSpeaking = !!data.isSpeaking;

          this.broadcastToRoom(boardId, {
            type: 'VIEWER_VOICE_UPDATED',
            userId: clientData.viewer.id,
            isMuted: clientData.viewer.isMuted,
            isSpeaking: clientData.viewer.isSpeaking,
          });
        }
        break;
      }

      case 'WEBRTC_SIGNAL': {
        // Forward WebRTC signals (offer, answer, ice-candidate) to target client in room
        const { targetId, signalType, payload } = data;
        const clientData = this.socketToViewer.get(ws);
        if (!clientData || !targetId) return;

        // Find target socket
        for (const [targetWs, targetClient] of this.socketToViewer.entries()) {
          if (targetClient.viewer.id === targetId && targetClient.viewer.boardId === boardId) {
            this.send(targetWs, {
              type: 'WEBRTC_SIGNAL',
              fromId: clientData.viewer.id,
              fromName: clientData.viewer.name,
              signalType,
              payload,
            });
            break;
          }
        }
        break;
      }

      default:
        break;
    }
  }

  private handleDisconnect(ws: WebSocket) {
    const clientData = this.socketToViewer.get(ws);
    if (!clientData) return;

    const { viewer } = clientData;
    const { boardId } = viewer;

    this.socketToViewer.delete(ws);

    const roomSet = this.rooms.get(boardId);
    if (roomSet) {
      roomSet.delete(ws);
      if (roomSet.size === 0) {
        this.rooms.delete(boardId);
      } else {
        const remainingViewers = this.getViewersInRoom(boardId);
        this.broadcastToRoom(boardId, {
          type: 'VIEWER_LEFT',
          userId: viewer.id,
          userName: viewer.name,
          viewers: remainingViewers,
        });
      }
    }

    this.logger.log(`Viewer ${viewer.name} (${viewer.id}) left room ${boardId}`);
  }

  private getViewersInRoom(boardId: string): ConnectedViewer[] {
    const viewers: ConnectedViewer[] = [];
    const room = this.rooms.get(boardId);
    if (!room) return viewers;

    for (const ws of room) {
      const data = this.socketToViewer.get(ws);
      if (data) {
        viewers.push(data.viewer);
      }
    }
    return viewers;
  }

  private broadcastToRoom(boardId: string, payload: any, excludeWs?: WebSocket) {
    const room = this.rooms.get(boardId);
    if (!room) return;

    const message = JSON.stringify(payload);
    for (const client of room) {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  private send(ws: WebSocket, payload: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }
}

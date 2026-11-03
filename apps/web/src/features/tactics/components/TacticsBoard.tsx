import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Plus, Sparkles, ArrowRight } from 'lucide-react';
import { TacticalPlayer, TacticalDrawing, TacticalTool } from '../types/tactics.types';
import { useTacticsSocket } from '../hooks/useTacticsSocket';
import { TacticsPitch } from './TacticsPitch';
import { TacticsToolbar } from './TacticsToolbar';
import { TacticsChatDrawer } from './TacticsChatDrawer';
import { TacticsViewersModal } from './TacticsViewersModal';
import { CreateBoardModal } from './CreateBoardModal';
import { GuestPhoneModal } from './GuestPhoneModal';
import { EditPlayerModal } from './EditPlayerModal';

const DEFAULT_INITIAL_PLAYERS: TacticalPlayer[] = [
  { id: '1', number: 1, name: 'بیرانوند', team: 'HOME', x: 8, y: 50, position: 'GK' },
  { id: '2', number: 2, name: 'رضاییان', team: 'HOME', x: 25, y: 20, position: 'RB' },
  { id: '3', number: 4, name: 'خلیل‌زاده', team: 'HOME', x: 22, y: 40, position: 'CB' },
  { id: '4', number: 5, name: 'پورعلی‌گنجی', team: 'HOME', x: 22, y: 60, position: 'CB' },
  { id: '5', number: 3, name: 'محمدی', team: 'HOME', x: 25, y: 80, position: 'LB' },
  { id: '6', number: 6, name: 'عزت‌اللهی', team: 'HOME', x: 42, y: 50, position: 'DM' },
  { id: '7', number: 8, name: 'نوراللهی', team: 'HOME', x: 55, y: 32, position: 'CM' },
  { id: '8', number: 10, name: 'قدوس', team: 'HOME', x: 55, y: 68, position: 'AM' },
  { id: '9', number: 7, name: 'جهانبخش', team: 'HOME', x: 75, y: 20, position: 'RW' },
  { id: '10', number: 9, name: 'طارمی', team: 'HOME', x: 82, y: 50, position: 'ST' },
  { id: '11', number: 11, name: 'قایدی', team: 'HOME', x: 75, y: 80, position: 'LW' },
];

const GUEST_STORAGE_KEY = 'ft_tactics_guest_user';

export const TacticsBoard: React.FC = () => {
  const { boardId: paramBoardId } = useParams<{ boardId?: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const activeBoardId = paramBoardId || null;

  // Guest user state for unauthenticated viewers
  const [guestUser, setGuestUser] = useState<{ id: string; name: string; phone: string } | null>(() => {
    try {
      const saved = localStorage.getItem(GUEST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewersModalOpen, setIsViewersModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  // Tactical Drawing Tools & Player Editing State
  const [activeTool, setActiveTool] = useState<TacticalTool>('select');
  const [activeColor, setActiveColor] = useState('#facc15');
  const [drawings, setDrawings] = useState<TacticalDrawing[]>([]);
  const [ball, setBall] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [editingPlayer, setEditingPlayer] = useState<TacticalPlayer | null>(null);

  const [boardTitle, setBoardTitle] = useState('تخته تاکتیک اختصاصی');
  const [players, setPlayers] = useState<TacticalPlayer[]>(DEFAULT_INITIAL_PLAYERS);
  const [joinLinkInput, setJoinLinkInput] = useState('');

  const activeUser = currentUser
    ? {
        id: `usr-${currentUser.phoneNumber || 'auth'}`,
        name: currentUser.fullName || 'مربی / بازیکن',
        phone: currentUser.phoneNumber || '',
      }
    : guestUser
    ? guestUser
    : null;

  useEffect(() => {
    if (activeBoardId && !currentUser && !guestUser) {
      setIsGuestModalOpen(true);
    } else {
      setIsGuestModalOpen(false);
    }
  }, [activeBoardId, currentUser, guestUser]);

  const handleGuestSubmit = (name: string, phone: string) => {
    const newGuest = {
      id: `gst-${Date.now().toString(36)}`,
      name,
      phone,
    };
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newGuest));
    } catch {}
    setGuestUser(newGuest);
    setIsGuestModalOpen(false);
  };

  // Remote updates via WebSocket
  const handleRemotePlayerMove = useCallback((playerId: string, x: number, y: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, x, y } : p)),
    );
  }, []);

  const handleRemotePlayerUpdated = useCallback(
    (playerId: string, name?: string, number?: number, position?: string) => {
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === playerId) {
            return {
              ...p,
              ...(name !== undefined && { name }),
              ...(number !== undefined && { number }),
              ...(position !== undefined && { position }),
            };
          }
          return p;
        }),
      );
    },
    [],
  );

  const handleRemoteBallMoved = useCallback((x: number, y: number) => {
    setBall({ x, y });
  }, []);

  const handleRemoteDrawingAdded = useCallback((drawing: TacticalDrawing) => {
    setDrawings((prev) => [...prev, drawing]);
  }, []);

  const handleDrawingsCleared = useCallback(() => {
    setDrawings([]);
  }, []);

  const handleBoardReset = useCallback((newPlayers: TacticalPlayer[]) => {
    setPlayers(newPlayers);
    setDrawings([]);
    setBall({ x: 50, y: 50 });
  }, []);

  const handleInitialBoardLoaded = useCallback(
    (
      loadedPlayers: TacticalPlayer[],
      title: string,
      initialDrawings?: TacticalDrawing[],
      initialBall?: { x: number; y: number },
    ) => {
      setPlayers(loadedPlayers);
      if (title) setBoardTitle(title);
      if (initialDrawings) setDrawings(initialDrawings);
      if (initialBall) setBall(initialBall);
    },
    [],
  );

  // Connect Real-Time WebSocket Hook
  const {
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
  } = useTacticsSocket({
    boardId: activeBoardId || '',
    currentUser: activeUser || { id: 'temp', name: 'کاربر' },
    onRemotePlayerMove: handleRemotePlayerMove,
    onRemotePlayerUpdated: handleRemotePlayerUpdated,
    onRemoteBallMoved: handleRemoteBallMoved,
    onRemoteDrawingAdded: handleRemoteDrawingAdded,
    onDrawingsCleared: handleDrawingsCleared,
    onBoardReset: handleBoardReset,
    onInitialBoardLoaded: handleInitialBoardLoaded,
  });

  // Local actions
  const handleLocalPlayerMove = (playerId: string, x: number, y: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, x, y } : p)),
    );
    if (activeBoardId) {
      sendPlayerMove(playerId, x, y);
    }
  };

  const handleLocalPlayerEditSave = (
    playerId: string,
    name: string,
    number: number,
    position: string,
  ) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, name, number, position } : p)),
    );
    if (activeBoardId) {
      sendPlayerEdit(playerId, name, number, position);
    }
  };

  const handleLocalBallMove = (x: number, y: number) => {
    setBall({ x, y });
    if (activeBoardId) {
      sendBallMove(x, y);
    }
  };

  const handleLocalAddDrawing = (drawing: TacticalDrawing) => {
    setDrawings((prev) => [...prev, drawing]);
    if (activeBoardId) {
      sendDrawingAdd(drawing);
    }
  };

  const handleLocalClearDrawings = () => {
    setDrawings([]);
    if (activeBoardId) {
      sendDrawingClear();
    }
  };

  const handleLocalReset = () => {
    setPlayers(DEFAULT_INITIAL_PLAYERS);
    setDrawings([]);
    setBall({ x: 50, y: 50 });
    if (activeBoardId) {
      sendResetBoard();
    }
  };

  const handleJoinById = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinLinkInput.trim()) return;
    let id = joinLinkInput.trim();
    if (id.includes('/tactics/')) {
      id = id.split('/tactics/')[1].split('/')[0];
    }
    navigate(`/tactics/${id}`);
  };

  // View 1: Clean Minimalist Landing Page (when no boardId is in URL)
  if (!activeBoardId) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-8 animate-in fade-in">
        <div className="bg-card/70 backdrop-blur-xl border border-border/80 rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              تخته تاکتیک مربیگری زنده
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              طراحی سناریوهای تیمی با قلم، فلش و شیپ، چت و مکالمه صوتی زنده (WebRTC) و جابجایی هم‌زمان بازیکنان با ارسال لینک اشتراک.
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-primary/25 gap-2.5 hover:scale-[1.02] transition-transform"
            >
              <Plus className="h-5 w-5 stroke-[2.5]" />
              ایجاد تخته تاکتیک جدید
            </Button>
          </div>

          <div className="pt-6 border-t border-border/60">
            <form onSubmit={handleJoinById} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="text"
                value={joinLinkInput}
                onChange={(e) => setJoinLinkInput(e.target.value)}
                placeholder="لینک یا شناسه تخته تاکتیک..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
              />
              <Button type="submit" variant="outline" size="sm" className="gap-1 text-xs shrink-0">
                پیوستن
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>

        <CreateBoardModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          creatorName={currentUser?.fullName}
          creatorPhone={currentUser?.phoneNumber}
        />
      </div>
    );
  }

  // View 2: Active Tactics Room (with full WebSocket & WebRTC Pitch)
  return (
    <div
      className={
        isZenMode
          ? 'fixed inset-0 z-50 bg-background overflow-y-auto p-3 sm:p-6 flex flex-col justify-center animate-in fade-in'
          : 'space-y-4 max-w-6xl mx-auto'
      }
    >
      {/* Top Toolbar (Tools, Real-Time Stats, Voice, Chat, Fullscreen) */}
      <TacticsToolbar
        title={boardTitle}
        boardId={activeBoardId}
        viewersCount={viewers.length}
        activeTool={activeTool}
        onChangeTool={setActiveTool}
        activeColor={activeColor}
        onChangeColor={setActiveColor}
        onClearDrawings={handleLocalClearDrawings}
        onOpenViewers={() => setIsViewersModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        unreadCount={messages.length}
        isVoiceActive={isVoiceActive}
        isMuted={isMuted}
        onToggleVoice={toggleVoice}
        onToggleMute={toggleMute}
        onResetBoard={handleLocalReset}
        isZenMode={isZenMode}
        onToggleZenMode={() => setIsZenMode(!isZenMode)}
      />

      {audioError && (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center">
          {audioError}
        </div>
      )}

      {/* The Pure Football Pitch with Drawing Tools and Live Football */}
      <div className="relative">
        <TacticsPitch
          players={players}
          drawings={drawings}
          activeTool={activeTool}
          activeColor={activeColor}
          ball={ball}
          onPlayerMove={handleLocalPlayerMove}
          onBallMove={handleLocalBallMove}
          onAddDrawing={handleLocalAddDrawing}
          onEditPlayer={(p) => setEditingPlayer(p)}
        />
      </div>

      {/* Edit Player Modal (Syncs player name, jersey number and position via WebSocket) */}
      <EditPlayerModal
        isOpen={!!editingPlayer}
        onClose={() => setEditingPlayer(null)}
        player={editingPlayer}
        onSave={handleLocalPlayerEditSave}
      />

      {/* Real-time Viewers Modal */}
      <TacticsViewersModal
        isOpen={isViewersModalOpen}
        onClose={() => setIsViewersModalOpen(false)}
        viewers={viewers}
        currentUserId={activeUser?.id || ''}
      />

      {/* Real-time WebSocket Chat Drawer */}
      <TacticsChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        currentUserId={activeUser?.id || ''}
        onSendMessage={sendMessage}
      />

      {/* Guest Phone Onboarding Modal */}
      <GuestPhoneModal
        isOpen={isGuestModalOpen}
        onSubmit={handleGuestSubmit}
      />
    </div>
  );
};

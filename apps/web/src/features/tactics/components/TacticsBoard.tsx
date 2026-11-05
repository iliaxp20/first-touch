import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import {
  Plus,
  Presentation,
  ArrowRight,
  Trash2,
  Share2,
  Check,
  Calendar,
  Search,
  ExternalLink,
} from 'lucide-react';
import { TacticalPlayer, TacticalDrawing, TacticalTool } from '../types/tactics.types';
import { useTacticsSocket } from '../hooks/useTacticsSocket';
import { TacticsPitch } from './TacticsPitch';
import { TacticsToolbar } from './TacticsToolbar';
import { TacticsChatDrawer } from './TacticsChatDrawer';
import { TacticsViewersModal } from './TacticsViewersModal';
import { CreateBoardModal } from './CreateBoardModal';
import { GuestPhoneModal } from './GuestPhoneModal';
import { EditPlayerModal } from './EditPlayerModal';
import { MicPermissionModal } from './MicPermissionModal';

const DEFAULT_INITIAL_PLAYERS: TacticalPlayer[] = [
  { id: '1', number: 1, name: '', team: 'HOME', x: 8, y: 50, position: 'GK' },
  { id: '2', number: 2, name: '', team: 'HOME', x: 25, y: 20, position: 'RB' },
  { id: '3', number: 4, name: '', team: 'HOME', x: 22, y: 40, position: 'CB' },
  { id: '4', number: 5, name: '', team: 'HOME', x: 22, y: 60, position: 'CB' },
  { id: '5', number: 3, name: '', team: 'HOME', x: 25, y: 80, position: 'LB' },
  { id: '6', number: 6, name: '', team: 'HOME', x: 42, y: 50, position: 'DM' },
  { id: '7', number: 8, name: '', team: 'HOME', x: 55, y: 32, position: 'CM' },
  { id: '8', number: 10, name: '', team: 'HOME', x: 55, y: 68, position: 'AM' },
  { id: '9', number: 7, name: '', team: 'HOME', x: 75, y: 20, position: 'RW' },
  { id: '10', number: 9, name: '', team: 'HOME', x: 82, y: 50, position: 'ST' },
  { id: '11', number: 11, name: '', team: 'HOME', x: 75, y: 80, position: 'LW' },
];

const GUEST_STORAGE_KEY = 'ft_tactics_guest_user';
const SAVED_BOARDS_KEY = 'ft_saved_tactics_boards';

interface SavedBoardInfo {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  creatorName?: string;
}

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
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const [boardCreatorPhone, setBoardCreatorPhone] = useState('');
  const [boardCreatorName, setBoardCreatorName] = useState('');

  // Tactical Drawing Tools & Player Editing State
  const [activeTool, setActiveTool] = useState<TacticalTool>('select');
  const [activeColor, setActiveColor] = useState('#facc15');
  const [drawings, setDrawings] = useState<TacticalDrawing[]>([]);
  const [ball, setBall] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [editingPlayer, setEditingPlayer] = useState<TacticalPlayer | null>(null);

  const [boardTitle, setBoardTitle] = useState('تخته تاکتیک اختصاصی');
  const [players, setPlayers] = useState<TacticalPlayer[]>(DEFAULT_INITIAL_PLAYERS);
  const [joinLinkInput, setJoinLinkInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // List of created boards for the landing view
  const [savedBoards, setSavedBoards] = useState<SavedBoardInfo[]>([]);
  const [boardSearchQuery, setBoardSearchQuery] = useState('');
  const [isLoadingBoards, setIsLoadingBoards] = useState(false);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeUser = currentUser
    ? {
        id: `usr-${currentUser.phoneNumber || 'auth'}`,
        name: currentUser.fullName || 'مربی / بازیکن',
        phone: currentUser.phoneNumber || '',
      }
    : guestUser
    ? guestUser
    : null;

  // Load board list when on landing page
  const fetchBoardList = useCallback(async () => {
    setIsLoadingBoards(true);
    let localList: SavedBoardInfo[] = [];
    try {
      const stored = localStorage.getItem(SAVED_BOARDS_KEY);
      if (stored) {
        localList = JSON.parse(stored);
      }
    } catch {}

    try {
      const res = await fetch('http://localhost:4000/tactics/boards');
      if (res.ok) {
        const data = await res.json();
        if (data.boards && Array.isArray(data.boards)) {
          const remoteMap = new Map<string, SavedBoardInfo>(
            data.boards.map((b: any) => [
              b.id,
              {
                id: b.id,
                title: b.title,
                createdAt: b.createdAt,
                updatedAt: b.updatedAt,
                creatorName: b.creatorName,
              },
            ]),
          );

          localList.forEach((lb) => {
            if (!remoteMap.has(lb.id)) {
              remoteMap.set(lb.id, lb);
            }
          });

          const merged = Array.from(remoteMap.values()).sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt).getTime() -
              new Date(a.updatedAt || a.createdAt).getTime(),
          );
          setSavedBoards(merged);
          localStorage.setItem(SAVED_BOARDS_KEY, JSON.stringify(merged));
          setIsLoadingBoards(false);
          return;
        }
      }
    } catch (e) {
      console.warn('API board listing unavailable, using local cache', e);
    }

    setSavedBoards(localList);
    setIsLoadingBoards(false);
  }, []);

  useEffect(() => {
    if (!activeBoardId) {
      fetchBoardList();
    }
  }, [activeBoardId, fetchBoardList]);

  // Load initial board data when activeBoardId is present
  useEffect(() => {
    if (!activeBoardId) return;

    // 1. Try local storage first for instantaneous load
    try {
      const cached = localStorage.getItem(`ft_tactics_board_${activeBoardId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.title) setBoardTitle(parsed.title);
        if (parsed.players && Array.isArray(parsed.players)) setPlayers(parsed.players);
        if (parsed.drawings && Array.isArray(parsed.drawings)) setDrawings(parsed.drawings);
        if (parsed.ball) setBall(parsed.ball);
      }
    } catch {}

    // 2. Fetch from backend to ensure latest sync
    fetch(`http://localhost:4000/tactics/boards/${activeBoardId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.board) {
          if (data.board.title) setBoardTitle(data.board.title);
          if (data.board.players && data.board.players.length > 0) setPlayers(data.board.players);
          if (data.board.drawings) setDrawings(data.board.drawings);
          if (data.board.ball) setBall(data.board.ball);
          if (data.board.creatorPhone) setBoardCreatorPhone(data.board.creatorPhone);
          if (data.board.creatorName) setBoardCreatorName(data.board.creatorName);

          // Update local cache
          try {
            localStorage.setItem(
              `ft_tactics_board_${activeBoardId}`,
              JSON.stringify({
                title: data.board.title,
                players: data.board.players,
                drawings: data.board.drawings,
                ball: data.board.ball,
              }),
            );
          } catch {}
        }
      })
      .catch((e) => console.warn('Backend board fetch notice:', e));
  }, [activeBoardId]);

  // Persist board helper
  const saveCurrentBoard = useCallback(
    async (
      currentPlayers = players,
      currentDrawings = drawings,
      currentBall = ball,
      currentTitle = boardTitle,
    ) => {
      if (!activeBoardId) return;

      const payload = {
        title: currentTitle,
        players: currentPlayers,
        drawings: currentDrawings,
        ball: currentBall,
      };

      // 1. Cache immediately in localStorage
      try {
        localStorage.setItem(`ft_tactics_board_${activeBoardId}`, JSON.stringify(payload));
      } catch {}

      // 2. Persist to API
      try {
        await fetch(`http://localhost:4000/tactics/boards/${activeBoardId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch (err) {
        console.warn('API save notice:', err);
      }
    },
    [activeBoardId, players, drawings, ball, boardTitle],
  );

  // Trigger debounced auto-save on change
  const triggerAutoSave = useCallback(
    (
      newPlayers = players,
      newDrawings = drawings,
      newBall = ball,
      newTitle = boardTitle,
    ) => {
      if (!activeBoardId) return;
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      autoSaveTimerRef.current = setTimeout(() => {
        saveCurrentBoard(newPlayers, newDrawings, newBall, newTitle);
      }, 1000);
    },
    [activeBoardId, ball, boardTitle, drawings, players, saveCurrentBoard],
  );

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
    setPlayers((prev) => {
      const next = prev.map((p) => (p.id === playerId ? { ...p, x, y } : p));
      return next;
    });
  }, []);

  const handleRemotePlayerUpdated = useCallback(
    (playerId: string, name?: string, number?: number, position?: string) => {
      setPlayers((prev) => {
        const next = prev.map((p) => {
          if (p.id === playerId) {
            return {
              ...p,
              ...(name !== undefined && { name }),
              ...(number !== undefined && { number }),
              ...(position !== undefined && { position }),
            };
          }
          return p;
        });
        return next;
      });
    },
    [],
  );

  const handleRemoteBallMoved = useCallback((x: number, y: number) => {
    setBall({ x, y });
  }, []);

  const handleRemoteDrawingAdded = useCallback((drawing: TacticalDrawing) => {
    setDrawings((prev) => [...prev, drawing]);
  }, []);

  const handleRemoteDrawingRemoved = useCallback((drawingId: string) => {
    setDrawings((prev) => prev.filter((d) => d.id !== drawingId));
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
      if (loadedPlayers && loadedPlayers.length > 0) setPlayers(loadedPlayers);
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
    clearAudioError,
    toggleVoice,
    toggleMute,
    sendPlayerMove,
    sendPlayerEdit,
    sendBallMove,
    sendDrawingAdd,
    sendDrawingRemove,
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
    onRemoteDrawingRemoved: handleRemoteDrawingRemoved,
    onDrawingsCleared: handleDrawingsCleared,
    onBoardReset: handleBoardReset,
    onInitialBoardLoaded: handleInitialBoardLoaded,
  });

  // Local actions with auto-save
  const handleLocalPlayerMove = (playerId: string, x: number, y: number) => {
    setPlayers((prev) => {
      const next = prev.map((p) => (p.id === playerId ? { ...p, x, y } : p));
      triggerAutoSave(next, drawings, ball);
      return next;
    });
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
    setPlayers((prev) => {
      const next = prev.map((p) => (p.id === playerId ? { ...p, name, number, position } : p));
      triggerAutoSave(next, drawings, ball);
      return next;
    });
    if (activeBoardId) {
      sendPlayerEdit(playerId, name, number, position);
    }
  };

  const handleLocalBallMove = (x: number, y: number) => {
    const nextBall = { x, y };
    setBall(nextBall);
    triggerAutoSave(players, drawings, nextBall);
    if (activeBoardId) {
      sendBallMove(x, y);
    }
  };

  const handleLocalAddDrawing = (drawing: TacticalDrawing) => {
    setDrawings((prev) => {
      const next = [...prev, drawing];
      triggerAutoSave(players, next, ball);
      return next;
    });
    if (activeBoardId) {
      sendDrawingAdd(drawing);
    }
  };

  const handleLocalRemoveDrawing = (drawingId: string) => {
    setDrawings((prev) => {
      const next = prev.filter((d) => d.id !== drawingId);
      triggerAutoSave(players, next, ball);
      return next;
    });
    if (activeBoardId) {
      sendDrawingRemove(drawingId);
    }
  };

  const handleLocalClearDrawings = () => {
    setDrawings([]);
    triggerAutoSave(players, [], ball);
    if (activeBoardId) {
      sendDrawingClear();
    }
  };

  const handleLocalReset = () => {
    setPlayers(DEFAULT_INITIAL_PLAYERS);
    setDrawings([]);
    setBall({ x: 50, y: 50 });
    triggerAutoSave(DEFAULT_INITIAL_PLAYERS, [], { x: 50, y: 50 });
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

  const handleDeleteSavedBoard = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('آیا از حذف این تخته تاکتیک اطمینان دارید؟')) return;

    try {
      await fetch(`http://localhost:4000/tactics/boards/${id}`, { method: 'DELETE' });
    } catch {}

    const updated = savedBoards.filter((b) => b.id !== id);
    setSavedBoards(updated);
    try {
      localStorage.setItem(SAVED_BOARDS_KEY, JSON.stringify(updated));
      localStorage.removeItem(`ft_tactics_board_${id}`);
    } catch {}
  };

  const handleCopyBoardLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/tactics/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Check if current user is the coach/creator of this board
  const isCreatedLocally =
    typeof window !== 'undefined' &&
    !!activeBoardId &&
    localStorage.getItem(`ft_creator_${activeBoardId}`) === 'true';
  const isPhoneMatch = Boolean(
    boardCreatorPhone && activeUser?.phone && boardCreatorPhone === activeUser.phone,
  );
  const isNameMatch = Boolean(
    boardCreatorName && activeUser?.name && boardCreatorName === activeUser.name,
  );
  const isCreator = Boolean(
    isCreatedLocally || isPhoneMatch || isNameMatch || (!boardCreatorPhone && !boardCreatorName),
  );

  const handleToggleMobileLandscape = () => {
    const next = !isMobileLandscape;
    setIsMobileLandscape(next);
    if (typeof window !== 'undefined') {
      if (next) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
        if (screen.orientation && (screen.orientation as any).lock) {
          (screen.orientation as any).lock('landscape').catch(() => {});
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        if (screen.orientation && (screen.orientation as any).unlock) {
          (screen.orientation as any).unlock();
        }
      }
    }
  };

  const filteredBoards = savedBoards.filter(
    (b) =>
      b.title.toLowerCase().includes(boardSearchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(boardSearchQuery.toLowerCase()),
  );

  // View 1: Clean Minimalist Landing Page (when no boardId is in URL)
  if (!activeBoardId) {
    return (
      <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-10 animate-in fade-in">
        {/* Main Banner Card */}
        <div className="bg-card/75 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-10 shadow-xl text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Presentation className="h-8 w-8 stroke-[2.2]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              تخته تاکتیک مربیگری زنده
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              رسم استراتژی‌های مسابقه، چیدمان ترکیب و انتقال زنده تاکتیک به بازیکنان و کادر فنی
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-primary/25 gap-2.5 hover:scale-[1.02] transition-transform"
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

        {/* Section: List of Created Tactics Boards */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <Presentation className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-black text-foreground">لیست تخته‌های تاکتیک من</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold">
                {savedBoards.length} تخته
              </span>
            </div>

            {savedBoards.length > 3 && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={boardSearchQuery}
                  onChange={(e) => setBoardSearchQuery(e.target.value)}
                  placeholder="جستجو در تخته‌ها..."
                  className="w-full pr-8 pl-3 py-1.5 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {isLoadingBoards ? (
            <div className="text-center py-12 text-muted-foreground text-xs font-semibold">
              در حال بارگذاری تخته‌ها...
            </div>
          ) : filteredBoards.length === 0 ? (
            <div className="bg-card/40 border border-border/60 rounded-2xl p-8 text-center space-y-3">
              <Presentation className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-bold text-foreground">هنوز تخته تاکتیکی نساخته‌اید</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                با زدن دکمه «ایجاد تخته تاکتیک جدید» اولین تخته خود را طراحی کرده و لینک آن را برای اعضای تیم ارسال نمایید.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredBoards.map((board) => (
                <div
                  key={board.id}
                  onClick={() => navigate(`/tactics/${board.id}`)}
                  className="group relative bg-card border border-border/80 hover:border-emerald-500/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-black text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {board.title}
                      </h3>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSavedBoard(board.id, e)}
                        className="p-1 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                        title="حذف تخته"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(board.createdAt).toLocaleDateString('fa-IR')}</span>
                      {board.creatorName && (
                        <>
                          <span>•</span>
                          <span className="line-clamp-1">{board.creatorName}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleCopyBoardLink(board.id, e)}
                      className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg hover:bg-muted transition-colors"
                      title="کپی لینک اشتراک"
                    >
                      {copiedId === board.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3 w-3" />
                          <span>کپی لینک</span>
                        </>
                      )}
                    </button>

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/tactics/${board.id}`)}
                      className="h-7 px-3 text-xs gap-1 rounded-xl"
                    >
                      <span>ورود</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <CreateBoardModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          creatorName={currentUser?.fullName}
          creatorPhone={currentUser?.phoneNumber}
          onBoardCreated={() => fetchBoardList()}
        />
      </div>
    );
  }

  // View 2: Active Tactics Room (with full WebSocket & WebRTC Pitch)
  return (
    <div
      style={
        isMobileLandscape
          ? {
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '100vh',
              height: '100vw',
              transform: 'translate(-50%, -50%) rotate(90deg)',
              zIndex: 50,
            }
          : undefined
      }
      className={
        isMobileLandscape
          ? 'fixed bg-background p-2 flex flex-col justify-between overflow-hidden shadow-2xl'
          : 'w-full max-w-5xl mx-auto space-y-2.5 pb-20 sm:pb-8'
      }
    >
      {/* Top Toolbar (Tools, Real-Time Stats, Voice, Chat, Mobile Landscape) */}
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
        isMobileLandscape={isMobileLandscape}
        onToggleMobileLandscape={handleToggleMobileLandscape}
        isCreator={isCreator}
        onSaveBoard={() => saveCurrentBoard()}
        isSaved={isSaved}
        onBack={() => navigate('/tactics')}
      />

      {audioError && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center flex items-center justify-center gap-2">
          <span>{audioError}</span>
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
          onRemoveDrawing={handleLocalRemoveDrawing}
          onEditPlayer={(p) => setEditingPlayer(p)}
          isRotatedLandscape={isMobileLandscape}
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

      {/* Real-time Chat Drawer */}
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

      {/* Microphone Permission Guide & Retry Modal */}
      <MicPermissionModal
        isOpen={!!audioError}
        errorMessage={audioError}
        onClose={clearAudioError}
        onRetry={toggleVoice}
      />
    </div>
  );
};

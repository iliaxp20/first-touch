import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Gift,
  Zap,
  ChevronLeft,
  Coins,
  Volume2,
  VolumeX,
  Play,
  Clock,
  Music,
  Check,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { quizSound } from './quizAudio';
import {
  QuizQuestion,
  getQuizQuestions,
  syncQuizQuestionsWithServer,
} from './quizStore';

interface RewardItem {
  id: string;
  title: string;
  description: string;
  costCoins: number;
  unlocked: boolean;
  claimed: boolean;
  code?: string;
  type: 'discount' | 'badge' | 'content';
}

const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-1',
    title: 'کد تخفیف ۲۰٪ اشتراک ویژه فرست تاچ',
    description: 'قابل استفاده مستقیم در درگاه خرید برنامه‌های تخصصی',
    costCoins: 50,
    unlocked: false,
    claimed: false,
    code: 'FIRST20-GAME',
    type: 'discount',
  },
  {
    id: 'rew-2',
    title: 'نشان افتخار: بازیکن طلایی (MVP)',
    description: 'بج اختصاصی طلایی قابل نمایش روی عکس پروفایل و داشبورد',
    costCoins: 80,
    unlocked: false,
    claimed: false,
    type: 'badge',
  },
  {
    id: 'rew-3',
    title: 'مسترکلاس اختصاصی: لمس اول پیشرفته بلینگهام',
    description: 'آنالیز حرفه‌ای فضاها و جهت‌گیری لمس اول در مسابقات لیگ قهرمانان',
    costCoins: 120,
    unlocked: false,
    claimed: false,
    type: 'content',
  },
];

const TIMER_SECONDS = 15;

export const QuizRewardsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'rewards'>('quiz');

  // Audio State
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(false);

  // Questions Bank (from quizStore)
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => getQuizQuestions());

  useEffect(() => {
    syncQuizQuestionsWithServer().then((data) => {
      if (data && data.length > 0) setQuestions(data);
    });

    const handleUpdate = () => {
      setQuestions(getQuizQuestions());
    };
    window.addEventListener('ft_quiz_updated', handleUpdate);
    return () => window.removeEventListener('ft_quiz_updated', handleUpdate);
  }, []);

  // Gamification State
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('first_touch_quiz_xp');
      return saved ? Number(saved) : 120;
    } catch {
      return 120;
    }
  });

  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('first_touch_quiz_coins');
      return saved ? Number(saved) : 45;
    } catch {
      return 45;
    }
  });

  const [streak, setStreak] = useState<number>(0);
  const [rewardsList, setRewardsList] = useState<RewardItem[]>(() => {
    try {
      const saved = localStorage.getItem('first_touch_quiz_rewards');
      return saved ? JSON.parse(saved) : INITIAL_REWARDS;
    } catch {
      return INITIAL_REWARDS;
    }
  });

  // Quiz Game Run State
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [justEarned, setJustEarned] = useState<{ xp: number; coins: number } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 15-Second Timer
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_SECONDS);
  const timerRef = useRef<any>(null);

  // Persist State
  useEffect(() => {
    try {
      localStorage.setItem('first_touch_quiz_xp', String(xp));
      localStorage.setItem('first_touch_quiz_coins', String(coins));
      localStorage.setItem('first_touch_quiz_rewards', JSON.stringify(rewardsList));
    } catch {}
  }, [xp, coins, rewardsList]);

  // Current Question
  const currentQ = questions[currentQIndex] || questions[0];

  // Timer Countdown Logic
  const handleTimeout = useCallback(() => {
    if (isAnswerRevealed) return;
    setIsAnswerRevealed(true);
    setSelectedOption(-1); // timed out
    setStreak(0);
    setJustEarned(null);
    quizSound.playWrong();
  }, [isAnswerRevealed]);

  useEffect(() => {
    if (!isGameStarted || isAnswerRevealed) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(TIMER_SECONDS);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        if (prev <= 5) {
          quizSound.playTick(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameStarted, currentQIndex, isAnswerRevealed, handleTimeout]);

  // Sound handlers
  const handleToggleMute = () => {
    const unmuted = quizSound.toggleMute();
    setIsMuted(!unmuted);
  };

  const handleToggleBgm = () => {
    const playing = quizSound.toggleBgm();
    setIsBgmActive(playing);
  };

  // Start the Quiz Challenge
  const handleStartGame = () => {
    setIsGameStarted(true);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setJustEarned(null);
    setTimeLeft(TIMER_SECONDS);
    quizSound.playStart();
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerRevealed || !isGameStarted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(idx);
    setIsAnswerRevealed(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      const gainedXp = currentQ.xpReward;
      const gainedCoins = currentQ.coinReward;
      setXp((prev) => prev + gainedXp);
      setCoins((prev) => prev + gainedCoins);
      setStreak((prev) => prev + 1);
      setJustEarned({ xp: gainedXp, coins: gainedCoins });
      quizSound.playCorrect();
    } else {
      setStreak(0);
      setJustEarned(null);
      quizSound.playWrong();
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setJustEarned(null);
    setCurrentQIndex((prev) => (prev + 1) % questions.length);
  };

  const handleClaimReward = (rewardId: string) => {
    const reward = rewardsList.find((r) => r.id === rewardId);
    if (!reward || reward.claimed || coins < reward.costCoins) return;

    setCoins((prev) => prev - reward.costCoins);
    setRewardsList((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, claimed: true, unlocked: true } : r))
    );

    // Apply real benefit
    if (reward.type === 'discount' && reward.code) {
      localStorage.setItem('first_touch_active_discount', JSON.stringify({
        code: reward.code,
        percent: 20,
        amountTomans: 40000,
      }));
    } else if (reward.type === 'badge') {
      localStorage.setItem('first_touch_user_badge', 'MVP');
      window.dispatchEvent(new Event('ft_badge_updated'));
    }

    quizSound.playFanfare();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto pb-32 select-none animate-in fade-in duration-300">
      {/* 1. Header with Gamification Hub & Sound Controls */}
      <div className="rounded-[28px] bg-white/70 dark:bg-[#07160e]/80 backdrop-blur-2xl border border-emerald-500/20 dark:border-white/10 p-4 sm:p-5 shadow-xl shadow-emerald-950/20 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h1 className="text-base sm:text-lg font-black text-foreground">
                باشگاه هوش و جوایز
              </h1>
            </div>
            <p className="text-xs text-muted-foreground font-semibold">
              مسابقه تخصصی فوتبال • جوایز واقعی
            </p>
          </div>

          {/* Sound & Music Controls */}
          <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-2xl border border-border/60">
            <button
              type="button"
              onClick={handleToggleBgm}
              title={isBgmActive ? 'قطع موزیک پس‌زمینه' : 'پخش ریتم بازی'}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isBgmActive
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Music className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleToggleMute}
              title={isMuted ? 'فعال‌سازی صدا' : 'قطع افکت‌های صوتی'}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/10 text-rose-500'
                  : 'bg-card text-foreground shadow-xs'
              }`}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Real Metrics Badges (Coins, XP, Streak) */}
        <div className="grid grid-cols-3 gap-2.5 pt-4 text-xs font-bold">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <Coins className="h-4 w-4" />
              <span>سکه‌ها:</span>
            </span>
            <span className="font-black text-amber-600 dark:text-amber-300 text-sm">
              {coins.toLocaleString('fa-IR')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Zap className="h-4 w-4" />
              <span>امتیاز XP:</span>
            </span>
            <span className="font-black text-emerald-600 dark:text-emerald-300 text-sm">
              {xp.toLocaleString('fa-IR')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400">
              <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
              <span>زنجیره:</span>
            </span>
            <span className="font-black text-orange-600 dark:text-orange-300 text-sm">
              {streak} روز
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sleek Sliding Pill Tab Switcher */}
      <div className="flex items-center p-1 rounded-2xl bg-white/60 dark:bg-[#07160e]/80 backdrop-blur-xl border border-emerald-500/15 dark:border-white/10 text-xs font-bold shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-xs font-black'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <HelpCircle className="h-4 w-4 text-emerald-500" />
          <span>چالش مسابقه</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'rewards'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 shadow-xs font-black'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Gift className="h-4 w-4 text-amber-500" />
          <span>جوایز و افتخارات</span>
          {rewardsList.some((r) => !r.claimed && coins >= r.costCoins) && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>
      </div>

      {/* 3. Quiz Tab: Game Lobby or Active Question with Timer */}
      {activeTab === 'quiz' && (
        <div className="space-y-3.5">
          {!isGameStarted ? (
            /* Game Start Screen */
            <div className="rounded-[28px] bg-white/75 dark:bg-[#07160e]/85 backdrop-blur-2xl border border-emerald-500/20 dark:border-white/10 p-6 sm:p-8 text-center space-y-5 shadow-xl shadow-emerald-950/20">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-lime-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <Play className="h-8 w-8 fill-slate-950 ml-0.5" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h2 className="text-base sm:text-lg font-black text-foreground">
                  شروع مسابقه هوش فوتبالی
                </h2>
                <p className="text-xs text-muted-foreground font-semibold">
                  برای هر سوال ۱۵ ثانیه فرصت دارید. با پاسخ صحیح سکه و امتیاز ببرید و در خرید برنامه‌ها تخفیف بگیرید.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <Button
                  variant="primary"
                  onClick={handleStartGame}
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-400 text-slate-950 hover:opacity-95 font-black text-sm px-8 h-11 rounded-2xl shadow-md cursor-pointer gap-2"
                >
                  <Play className="h-4 w-4 fill-slate-950" />
                  <span>شروع چالش مسابقه</span>
                </Button>
              </div>
            </div>
          ) : (
            /* Active Question Card */
            <div className="rounded-[28px] bg-white/75 dark:bg-[#07160e]/85 backdrop-blur-2xl border border-emerald-500/20 dark:border-white/10 p-4 sm:p-6 shadow-xl shadow-emerald-950/20 space-y-4">
              {/* Question Header & 15-Second Timer Bar */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-muted-foreground">
                    سوال {currentQIndex + 1} از {questions.length}
                  </span>

                  {/* 15s Countdown Badge */}
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-black text-xs border ${
                    timeLeft <= 5
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 animate-pulse'
                      : 'bg-muted text-foreground border-border/60'
                  }`}>
                    <Clock className="h-3.5 w-3.5" />
                    <span>{timeLeft} ثانیه</span>
                  </div>
                </div>

                {/* Progress bar of timer */}
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
                    className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                      timeLeft <= 5 ? 'bg-rose-500' : 'bg-primary'
                    }`}
                  />
                </div>
              </div>

              {/* Question Category & Text */}
              <div className="space-y-2">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl border ${currentQ.categoryColor}`}>
                  {currentQ.category}
                </span>
                <h3 className="text-sm sm:text-base font-black text-foreground leading-relaxed pt-1">
                  {currentQ.question}
                </h3>
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let btnStyle = 'bg-muted/40 hover:bg-muted border-border/60 text-foreground';
                  if (isAnswerRevealed) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300 font-black';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-300 line-through';
                    } else {
                      btnStyle = 'opacity-40 border-border/40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswerRevealed}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-3 sm:p-3.5 rounded-2xl border text-right text-xs font-bold transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswerRevealed && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                      {isAnswerRevealed && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Result & Explanation Callout */}
              {isAnswerRevealed && (
                <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/70 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={selectedOption === currentQ.correctIndex ? 'text-emerald-500 font-black' : 'text-rose-500 font-black'}>
                      {selectedOption === currentQ.correctIndex
                        ? 'آفرین! پاسخ صحیح است'
                        : selectedOption === -1
                        ? 'زمان تمام شد!'
                        : 'پاسخ نادرست بود'}
                    </span>
                    {justEarned && (
                      <span className="text-amber-500 font-black">
                        +{justEarned.coins} سکه • +{justEarned.xp} XP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                    {currentQ.explanation}
                  </p>
                  <div className="pt-1 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={handleNextQuestion}
                      className="bg-primary text-primary-foreground font-black text-xs px-5 h-8.5 rounded-xl cursor-pointer gap-1.5"
                    >
                      <span>سوال بعدی</span>
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Rewards Tab: Real Redeemable Codes & Badges */}
      {activeTab === 'rewards' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rewardsList.map((reward) => {
              const canAfford = coins >= reward.costCoins;
              return (
                <div
                  key={reward.id}
                  className={`p-4 rounded-[26px] backdrop-blur-2xl border transition-all flex flex-col justify-between space-y-3 shadow-lg shadow-emerald-950/15 ${
                    reward.claimed
                      ? 'border-emerald-500/40 bg-emerald-500/[0.08]'
                      : 'border-emerald-500/15 dark:border-white/10 bg-white/70 dark:bg-[#07160e]/80'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {reward.costCoins} سکه
                      </span>
                      {reward.claimed && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          فعال شد
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-black text-foreground">
                      {reward.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {reward.description}
                    </p>
                  </div>

                  {reward.code && reward.claimed && (
                    <div className="p-2.5 rounded-2xl bg-muted/60 border border-border/80 flex items-center justify-between text-xs font-mono">
                      <span className="font-black text-foreground">{reward.code}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(reward.code!)}
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCode === reward.code ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            <span>کپی شد</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>کپی کد</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div>
                    {!reward.claimed ? (
                      <Button
                        variant="primary"
                        disabled={!canAfford}
                        onClick={() => handleClaimReward(reward.id)}
                        className="w-full text-xs font-black h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 disabled:opacity-40 cursor-pointer"
                      >
                        {canAfford ? 'دریافت جایزه' : `نیاز به ${reward.costCoins - coins} سکه دیگر`}
                      </Button>
                    ) : (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block text-center py-1">
                        جایزه شما در سامانه فعال گردید
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

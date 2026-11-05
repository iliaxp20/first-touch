import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Gift,
  Zap,
  ChevronLeft,
  Coins,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Question {
  id: number;
  category: string;
  categoryColor: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
  coinReward: number;
}

const QUESTIONS_BANK: Question[] = [
  {
    id: 1,
    category: 'تکنیک و لمس اول',
    categoryColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    question: 'هنگام دریافت پاس زمینی پرسرعت تحت پرس مستقیم مدافع حریف، مهم‌ترین اصل در اجرای لمس اول جهت‌دار چیست؟',
    options: [
      'استپ کردن کامل توپ زیر پا و متوقف کردن سرعت بازی',
      'باز کردن جهت بدن و لمس اول به سمت فضای خالی دور از زاویه تکل حریف',
      'پاس بدون نگاه با پشت پا به عقب',
      'شوت کردن مستقیم توپ به سمت زمین حریف',
    ],
    correctIndex: 1,
    explanation: 'لمس اول جهت‌دار (Directional First Touch) باید توپ را در یک حرکت وارد زاویه ایمن و فضای خالی کند تا از تکل مدافع در امان بماند و گام بعدی بلافاصله شوت یا پاس باشد.',
    xpReward: 35,
    coinReward: 15,
  },
  {
    id: 2,
    category: 'قوانین داوری فیفا',
    categoryColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    question: 'بر اساس آخرین قوانین برد بین‌المللی فوتبال (IFAB)، کدام عضو بدن بازیکن در محاسبه آفساید لحاظ نمی‌شود؟',
    options: [
      'دست‌ها و بازوها (از پایین زیربغل)',
      'شانه و ترقوه',
      'نوک انگشتان پا',
      'سر و چانه',
    ],
    correctIndex: 0,
    explanation: 'دست‌ها و بازوهای تمام بازیکنان (از جمله دروازه‌بان در شرایط خاص حمله) به دلیل اینکه مجاز به بازی با دست نیستند، در سنجش خط آفساید لحاظ نمی‌شوند.',
    xpReward: 30,
    coinReward: 10,
  },
  {
    id: 3,
    category: 'تاکتیک و جایگیری',
    categoryColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    question: 'اصطلاح Half-Space (نیم‌فضا) در تحلیل تاکتیکی نوین فوتبال به کدام ناحیه زمین اطلاق می‌شود؟',
    options: [
      'محوطه شش قدم جلوی دروازه‌بان',
      'فضای کانال عمودی میان مرکز زمین (Center) و کناره‌های زمین (Flank)',
      'دایره وسط نیمه حریف',
      'پشت مدافعان آخر در عمق دفاع',
    ],
    correctIndex: 1,
    explanation: 'نیم‌فضاها موثرترین فضاهای هجومی هستند زیرا زوایای پاس و شوت مورب بسیار بهتری نسبت به کناره‌ها و مرکز شلوغ ایجاد می‌کنند.',
    xpReward: 40,
    coinReward: 20,
  },
  {
    id: 4,
    category: 'تغذیه و ریکاوری',
    categoryColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    question: 'پنجره طلایی بازسازی ذخایر گلیکوژن عضلات پس از ۹۰ دقیقه مسابقه سنگین چه زمانی است؟',
    options: [
      '۳۰ الی ۴۵ دقیقه ابتدایی بلافاصله پس از اتمام مسابقه',
      '۴ ساعت پس از حمام و استراحت کامل',
      'صبح روز بعد در وعده صبحانه',
      'هیچ نیازی به مصرف فوری مواد قندی نیست',
    ],
    correctIndex: 0,
    explanation: 'در بازه ۳۰ تا ۴۵ دقیقه پس از بازی، آنزیم گلیکوژن سنتتاز در اوج فعالیت است و مصرف کربوهیدرات ساده همراه پروتئین جذب را چند برابر می‌کند.',
    xpReward: 30,
    coinReward: 15,
  },
  {
    id: 5,
    category: 'قوانین ضربات پنالتی',
    categoryColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    question: 'در جریان مسابقه، اگر ضربه پنالتی به تیر عمودی برخورد کند و بدون برخورد با دروازه‌بان یا بازیکن دیگر به زننده پنالتی بازگردد، آیا او می‌تواند گل بزند؟',
    options: [
      'بله، بازی در جریان است و مجاز است',
      'خیر، خطای لمس متوالی است و ضربه آزاد غیرمستقیم به نفع حریف اعلام می‌شود',
      'ضربه پنالتی باید دوباره تکرار شود',
      'به تشخیص داور کرنر اعلام می‌شود',
    ],
    correctIndex: 1,
    explanation: 'زننده پنالتی نمی‌تواند توپ را دوبار پشت سر هم لمس کند؛ مگر اینکه شخص دیگری (دروازه‌بان یا مدافع) توپ را لمس کرده باشد.',
    xpReward: 45,
    coinReward: 25,
  },
  {
    id: 6,
    category: 'تاکتیک دفاعی',
    categoryColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    question: 'در دفاع تک به تک (1v1 Defending)، موقعیت صحیح جهت بدن (Body Shape) نسبت به مهاجم صاحب توپ چیست؟',
    options: [
      'ایستادن با سینه صاف و پاهای کاملاً موازی روبه‌روی مهاجم',
      'موقعیت نیم‌رخ (Side-on) روی پنجه پاها جهت بستن مسیر پا موافق و هدایت مهاجم به سمت ضعیف',
      'تکل کشویی فوری با اولین استپ حریف',
      'چرخیدن پشت به مهاجم جهت سد کردن دید او',
    ],
    correctIndex: 1,
    explanation: 'فرم بدن نیم‌رخ (Jockey / Side-on) به مدافع اجازه می‌دهد تعادل خود را حفظ کرده و شتاب معکوس در واکنش به حرکات انفجاری مهاجم داشته باشد.',
    xpReward: 35,
    coinReward: 15,
  },
];

interface RewardItem {
  id: string;
  title: string;
  description: string;
  costCoins: number;
  unlocked: boolean;
  claimed: boolean;
  code?: string;
}

const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-1',
    title: 'کد تخفیف ۲۰٪ اشتراک ویژه فرست تاچ',
    description: 'قابل استفاده در درگاه پرداخت جهت تمدید یا ارتقای پلن‌های تمرینی مربیان حرفه‌ای',
    costCoins: 50,
    unlocked: false,
    claimed: false,
    code: 'FIRST20-GAME',
  },
  {
    id: 'rew-2',
    title: 'نشان افتخار: متخصص لمس اول و شوت',
    description: 'بج اختصاصی طلایی قابل نمایش در پروفایل عمومی و پنل مربی',
    costCoins: 80,
    unlocked: false,
    claimed: false,
  },
  {
    id: 'rew-3',
    title: 'ویدیو آموزشی اختصاصی: ۷ الگوی طلایی لمس اول بلینگهام',
    description: 'دسترسی نامحدود به ویدیو آنالیز حرکات بدون توپ و جهت‌گیری لمس اول',
    costCoins: 120,
    unlocked: false,
    claimed: false,
  },
];

export const QuizRewardsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'rewards'>('quiz');

  // Gamification State (Persisted in localStorage)
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

  // Current Quiz Question State
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [justEarned, setJustEarned] = useState<{ xp: number; coins: number } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('first_touch_quiz_xp', String(xp));
      localStorage.setItem('first_touch_quiz_coins', String(coins));
      localStorage.setItem('first_touch_quiz_rewards', JSON.stringify(rewardsList));
    } catch {}
  }, [xp, coins, rewardsList]);

  const currentQ = QUESTIONS_BANK[currentQIndex] || QUESTIONS_BANK[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerRevealed) return;
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
    } else {
      setStreak(0);
      setJustEarned(null);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setJustEarned(null);
    setCurrentQIndex((prev) => (prev + 1) % QUESTIONS_BANK.length);
  };

  const handleClaimReward = (rewardId: string) => {
    const reward = rewardsList.find((r) => r.id === rewardId);
    if (!reward || reward.claimed || coins < reward.costCoins) return;

    setCoins((prev) => prev - reward.costCoins);
    setRewardsList((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, claimed: true, unlocked: true } : r)),
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-40 select-none animate-in fade-in duration-300">
      {/* 1. Header with Gamification Hub */}
      <div className="rounded-3xl bg-card border border-border/80 p-5 sm:p-6 shadow-sm relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-amber-500/10 dark:bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                <Trophy className="h-5 w-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                بازی و جوایز فرست تاچ
              </h1>
            </div>
            <p className="text-xs text-muted-foreground font-semibold">
              چالش سوال و جواب تخصصی فوتبال • کسب امتیاز، سکه و دریافت جوایز ارزشمند
            </p>
          </div>

          {/* Player Balance Pills */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-black">
              <Flame className="h-4 w-4 fill-orange-500" />
              <span>{streak} زنجیره برد</span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 text-xs font-black shadow-sm">
              <Coins className="h-4 w-4" />
              <span>{coins} سکه</span>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25 text-xs font-black shadow-sm">
              <Zap className="h-4 w-4" />
              <span>{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'quiz'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>چالش سوال و جواب</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {currentQIndex + 1}/{QUESTIONS_BANK.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === 'rewards'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Gift className="h-4 w-4" />
            <span>صندوق جوایز</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
              {rewardsList.filter((r) => r.claimed).length}/{rewardsList.length} بازشده
            </span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Football Quiz Game */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-card border border-border/80 p-5 sm:p-7 shadow-sm space-y-5">
            {/* Question Header & Category Badge */}
            <div className="flex items-center justify-between gap-3">
              <span
                className={`text-[11px] font-black px-3 py-1 rounded-full border ${currentQ.categoryColor}`}
              >
                {currentQ.category}
              </span>

              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <span>سوال {currentQIndex + 1} از {QUESTIONS_BANK.length}</span>
                <span>•</span>
                <span className="text-amber-500 font-black flex items-center gap-1">
                  +{currentQ.coinReward} سکه
                </span>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-black text-foreground leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Reward Notification Banner */}
            <AnimatePresence>
              {justEarned && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-black text-emerald-600 dark:text-emerald-400"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    پاسخ کاملاً صحیح! آفرین به هوش فوتبالی شما
                  </span>
                  <span>+{justEarned.xp} XP • +{justEarned.coins} سکه</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = optIdx === currentQ.correctIndex;

                let stateClass =
                  'bg-muted/40 hover:bg-muted/70 border-border/70 text-foreground cursor-pointer';

                if (isAnswerRevealed) {
                  if (isCorrect) {
                    stateClass =
                      'bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-black';
                  } else if (isSelected && !isCorrect) {
                    stateClass =
                      'bg-rose-500/15 border-rose-500/50 text-rose-700 dark:text-rose-300 font-black';
                  } else {
                    stateClass = 'bg-muted/20 border-border/40 text-muted-foreground opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={isAnswerRevealed}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold select-none ${stateClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-xl bg-card border border-border/80 flex items-center justify-center text-xs font-black text-muted-foreground shrink-0">
                        {optIdx + 1}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerRevealed && (
                      <div className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : isSelected ? (
                          <XCircle className="h-5 w-5 text-rose-500" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Note after answer */}
            <AnimatePresence>
              {isAnswerRevealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-1.5 text-xs"
                >
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>تحلیل علمی و تاکتیکی پاسخ:</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            {isAnswerRevealed && (
              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={handleNextQuestion}
                  className="text-xs font-black gap-2 rounded-2xl h-10 px-5 shadow-sm"
                >
                  <span>سوال بعدی</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Rewards & Trophy Vault */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewardsList.map((reward) => {
              const canAfford = coins >= reward.costCoins;

              return (
                <div
                  key={reward.id}
                  className={`rounded-3xl border p-5 shadow-sm space-y-3 relative overflow-hidden transition-all ${
                    reward.claimed
                      ? 'bg-emerald-500/[0.04] border-emerald-500/30'
                      : 'bg-card border-border/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shrink-0">
                      <Award className="h-5 w-5" />
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black">
                      <Coins className="h-3.5 w-3.5" />
                      <span>{reward.costCoins} سکه</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-foreground">{reward.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  {reward.claimed && reward.code && (
                    <div className="p-2.5 rounded-xl bg-background border border-border text-center font-mono font-black text-primary text-xs select-all">
                      کد هدیه شما: {reward.code}
                    </div>
                  )}

                  <div className="pt-2">
                    {reward.claimed ? (
                      <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 py-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>دریافت شد</span>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => handleClaimReward(reward.id)}
                        className={`w-full rounded-2xl text-xs font-black h-9 ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-sm'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {canAfford ? 'دریافت جایزه با سکه' : `سکه ناکافی (نیاز به ${reward.costCoins} سکه)`}
                      </Button>
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

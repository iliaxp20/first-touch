import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  X,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Dumbbell,
  Play,
  UserCheck,
  Star,
  Users,
  Apple,
} from 'lucide-react';
import {
  TRAINING_CATEGORIES_10,
  FREE_TRAINING_DRILLS,
  FreeDrill,
} from '../data/freeTrainingCategories';
import {
  NUTRITION_CATEGORIES_FREE,
  FREE_NUTRITION_ITEMS,
} from '../data/freeNutritionCategories';
import {
  getReadyTrainingPlans,
  getReadyNutritionPlans,
  ReadyTrainingPlan,
  ReadyNutritionPlan,
} from '../data/readyProgramsStore';
import { DrillDetailModal } from './DrillDetailModal';

type AcquisitionTab = 'free' | 'ready' | 'custom-coach';

interface PlanAcquisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'training' | 'nutrition';
  onPlanActivated: (planDetails: any) => void;
}

export const PlanAcquisitionModal: React.FC<PlanAcquisitionModalProps> = ({
  isOpen,
  onClose,
  mode,
  onPlanActivated,
}) => {
  const [activeTab, setActiveTab] = useState<AcquisitionTab>('free');

  // --- FREE TAB STATE ---
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>(
    mode === 'training' ? 'agility' : 'hydration'
  );
  const [freeDrillDetail, setFreeDrillDetail] = useState<FreeDrill | null>(null);
  const [selectedFreeItems, setSelectedFreeItems] = useState<string[]>([]);

  // --- READY TAB STATE ---
  const [readyAgeFilter, setReadyAgeFilter] = useState<string>('همه');
  const [readyTrainingPlans, setReadyTrainingPlans] = useState<ReadyTrainingPlan[]>([]);
  const [readyNutritionPlans, setReadyNutritionPlans] = useState<ReadyNutritionPlan[]>([]);

  // --- CUSTOM COACH TAB STATE ---
  const [coachSearch, setCoachSearch] = useState('');
  const [coaches, setCoaches] = useState<any[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<any | null>(null);
  const [coachForm, setCoachForm] = useState({
    playerName: '',
    playerAge: '۱۶ سال',
    playerPosition: 'هافبک میانی / بازیساز',
    goals: 'بهبود دید محیطی، لمس اول جهت‌دار و آمادگی بدنی ۹۰ دقیقه‌ای',
  });

  // --- PROFILE-COMPLETION-STYLE ANIMATION STATE ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMsg, setTransitionMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [completedPlanResult, setCompletedPlanResult] = useState<any | null>(null);

  // Load Ready Plans from Store (Synchronized with Secret Admin)
  useEffect(() => {
    if (!isOpen) return;
    setReadyTrainingPlans(getReadyTrainingPlans());
    setReadyNutritionPlans(getReadyNutritionPlans());

    // Fetch Coaches
    const fetchCoaches = async () => {
      try {
        const res = await fetch('http://localhost:4000/coaches');
        if (res.ok) {
          const data = await res.json();
          setCoaches(data);
          return;
        }
      } catch {
        // Fallback
      }
      setCoaches([
        {
          id: 'c-1',
          fullName: 'استاد علیرضا رضایی',
          title: 'سرمربی ارشد آکادمی فرست تاچ',
          license: 'UEFA A License & AFC Pro',
          specialty: ['تکنیک لمس اول', 'چابکی تخصصی', 'هوش محیطی هافبک‌ها'],
          experienceYears: 14,
          rating: 4.9,
          studentsCount: 340,
          bio: 'مدرس رسمی دوره‌های بدنسازی پایه فوتبال و مربی پیشین رده‌های ملی جوانان.',
        },
        {
          id: 'c-2',
          fullName: 'دکتر مریم شمس',
          title: 'متخصص فیزیولوژی و تغذیه فوتبال حرفه‌ای',
          license: 'Ph.D Sports Nutrition & UEFA Fitness',
          specialty: ['رژیم مسابقاتی', 'ریکاوری گلیکوژن', 'عضله‌سازی بدون چربی'],
          experienceYears: 11,
          rating: 5.0,
          studentsCount: 420,
          bio: 'مشاور تغذیه چندین باشگاه لیگ برتری و طراح برنامه‌های غذایی رده‌های سنی.',
        },
        {
          id: 'c-3',
          fullName: 'کاپیتان بهروز رستمی',
          title: 'مربی تخصصی شتاب و توان انفجاری',
          license: 'UEFA B & فیفا فیتنس پرو',
          specialty: ['سرعت انفجاری', 'شاتل‌های RSA', 'پیشگیری از آسیب همسترینگ'],
          experienceYears: 9,
          rating: 4.8,
          studentsCount: 215,
          bio: 'سرمربی اسبق بدنسازی تیم‌های پایه و طراح متدهای پلیومتریک فوتبال.',
        },
      ]);
    };

    fetchCoaches();
  }, [isOpen, mode]);

  // Handle Profile-Completion Style Progress Animation
  useEffect(() => {
    if (!isProcessing) return;

    setProgress(0);
    setIsFinished(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFinished(true);
          return 100;
        }

        const next = prev + 1;

        if (next < 25) {
          setProgressStatus(
            mode === 'training'
              ? 'بررسی شاخص‌های فیزیکی، رده سنی و پست بازی...'
              : 'محاسبه نیاز کالری پایه (BMR) و ماکروهای روزانه...'
          );
        } else if (next < 60) {
          setProgressStatus(
            mode === 'training'
              ? 'تنظیم بار تمرینی، جلسات هفته‌به‌هفته و متدولوژی لمس اول...'
              : 'طراحی جدول غذایی ۵ وعده‌ای منطبق بر روزهای تمرین و مسابقه...'
          );
        } else if (next < 88) {
          setProgressStatus(
            'ثبت رسمی در پایگاه داده آکادمی و اتصال به کارتابل شاگرد...'
          );
        } else {
          setProgressStatus('آماده‌سازی نهایی و صدور تقویم اجرایی برنامه...');
        }

        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isProcessing, mode]);

  // Body scroll lock and navbar/footer isolation when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('has-modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('has-modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('has-modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Trigger Plan Activation Animation Flow
  const triggerActivationFlow = (planData: any) => {
    setCompletedPlanResult(planData);
    setIsTransitioning(true);
    setTransitionMsg('در حال بارگذاری موتور هوشمند صدور برنامه...');

    setTimeout(() => {
      setIsTransitioning(false);
      setIsProcessing(true);
    }, 600);
  };

  const handleFinishAndApply = () => {
    if (completedPlanResult) {
      onPlanActivated(completedPlanResult);
    }
    // Reset state
    setIsProcessing(false);
    setIsFinished(false);
    setProgress(0);
    setCompletedPlanResult(null);
    onClose();
  };

  // Filtered Drills for Category
  const activeCategoryDrills = FREE_TRAINING_DRILLS.filter(
    (d) => d.categoryKey === selectedCategoryKey
  );

  // Filtered Nutrition Items
  const activeNutritionItems = FREE_NUTRITION_ITEMS.filter(
    (n) => n.categoryKey === selectedCategoryKey
  );

  // Filtered Coaches
  const filteredCoaches = coaches.filter(
    (c) =>
      !coachSearch.trim() ||
      c.fullName.includes(coachSearch.trim()) ||
      c.title.includes(coachSearch.trim()) ||
      c.specialty.some((s: string) => s.includes(coachSearch.trim()))
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5 bg-slate-950/95 sm:bg-slate-950/98 backdrop-blur-xl overflow-y-auto select-none">
      <Card className="w-full max-w-4xl border border-purple-200/90 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl shadow-purple-950/30 relative overflow-hidden rounded-3xl my-2 sm:my-6 flex flex-col max-h-[96vh] sm:max-h-[90vh]">
        {/* Top Header - Streamlined & Compact */}
        <div className="p-3.5 sm:p-5 border-b border-border/80 flex items-center justify-between bg-gradient-to-r from-purple-50/70 via-white to-purple-50/40 dark:from-slate-950/80 dark:via-purple-950/20 dark:to-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 shrink-0">
              {mode === 'training' ? (
                <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Apple className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>
                  {mode === 'training'
                    ? 'دریافت برنامه تمرینی'
                    : 'دریافت برنامه غذایی'}
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                انتخاب از میان برنامه‌های ساده رایگان، آماده رده سنی و اختصاصی با مربی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 3 OPTIONS TABS SWITCHER WITH SLIDING PILL */}
        {!isProcessing && !isTransitioning && (
          <div className="px-3.5 sm:px-6 pt-3 sm:pt-4 shrink-0">
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200/80 dark:border-white/5 relative">
              {/* Option 1: Simple (Free) */}
              <button
                type="button"
                onClick={() => setActiveTab('free')}
                className={`relative py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs font-black transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'free'
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'free' && (
                  <motion.div
                    layoutId="modalAcquisitionTabPill"
                    className="absolute inset-0 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-emerald-500/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Sparkles className="h-3.5 w-3.5 text-emerald-500 relative z-10 shrink-0" />
                <span className="relative z-10 hidden sm:inline">برنامه ساده (رایگان)</span>
                <span className="relative z-10 sm:hidden">رایگان</span>
              </button>

              {/* Option 2: Ready Plan (199,000 Tomans) */}
              <button
                type="button"
                onClick={() => setActiveTab('ready')}
                className={`relative py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs font-black transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ready'
                    ? 'text-purple-800 dark:text-purple-200'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'ready' && (
                  <motion.div
                    layoutId="modalAcquisitionTabPill"
                    className="absolute inset-0 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-purple-500/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Calendar className="h-3.5 w-3.5 text-purple-600 relative z-10 shrink-0" />
                <span className="relative z-10 hidden sm:inline">برنامه آماده (۱۹۹ ت)</span>
                <span className="relative z-10 sm:hidden">آماده (۱۹۹ ت)</span>
              </button>

              {/* Option 3: Custom with Coach (399,000 Tomans) */}
              <button
                type="button"
                onClick={() => setActiveTab('custom-coach')}
                className={`relative py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs font-black transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'custom-coach'
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'custom-coach' && (
                  <motion.div
                    layoutId="modalAcquisitionTabPill"
                    className="absolute inset-0 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-amber-500/30"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <UserCheck className="h-3.5 w-3.5 text-amber-500 relative z-10 shrink-0" />
                <span className="relative z-10 hidden sm:inline">اختصاصی مربی (۳۹۹ ت)</span>
                <span className="relative z-10 sm:hidden">مربی (۳۹۹ ت)</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PROFILE COMPLETION STYLE ANIMATION WIZARD (WHEN PROCESSING OR FINISHED)
            ========================================================================= */}
        {isTransitioning && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 animate-spin" />
              <Sparkles className="h-6 w-6 text-purple-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-slate-200 animate-pulse">
              {transitionMsg}
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center space-y-6">
            <div className="relative flex items-center justify-center">
              {/* Circular SVG Progress */}
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="60"
                  className="stroke-purple-600 transition-all duration-300"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - progress / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-purple-700 dark:text-purple-300">
                  {progress}٪
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {isFinished ? 'تکمیل شد' : 'شخصی‌سازی'}
                </span>
              </div>
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isFinished
                  ? 'برنامه شما با موفقیت آماده و فعال گردید!'
                  : 'در حال اعمال تنظیمات برنامه در سامانه فرست تاچ'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[36px]">
                {progressStatus}
              </p>
            </div>

            {isFinished && completedPlanResult && (
              <div className="w-full max-w-md p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-right space-y-3 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                    عنوان برنامه فعال شده:
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    {completedPlanResult.title}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>هزینه پرداخت / وضعیت:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {completedPlanResult.price || 'رایگان برای شاگرد'}
                  </span>
                </div>
                <Button
                  variant="primary"
                  onClick={handleFinishAndApply}
                  className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs h-11 shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  ورود به کارتابل و مشاهده تقویم جلسات
                </Button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            SLIDING CONTENT FOR THE 3 TABS (SPRING SLIDE WITHOUT BLUR)
            ========================================================================= */}
        {!isProcessing && !isTransitioning && (
          <div className="overflow-hidden relative flex-1 flex flex-col min-h-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ x: activeTab === 'free' ? -50 : activeTab === 'custom-coach' ? 50 : 0, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: activeTab === 'free' ? 50 : activeTab === 'custom-coach' ? -50 : 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.8 }}
                className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5"
              >
                {/* =========================================================================
                    TAB 1: FREE SIMPLE DRILLS & NUTRITION (DECLUTTERED)
                    ========================================================================= */}
                {activeTab === 'free' && (
                  <div className="space-y-3.5">
                    {mode === 'training' ? (
                      <>
                        {/* Selected items quick-activation bar (only shown when selected) */}
                        {selectedFreeItems.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                              {selectedFreeItems.length} تمرین انتخاب شده
                            </span>
                            <Button
                              variant="primary"
                              onClick={() =>
                                triggerActivationFlow({
                                  id: `free-plan-${Date.now()}`,
                                  title: `برنامه تمرینی برگزیده (${selectedFreeItems.length} تمرین)`,
                                  price: 'رایگان',
                                  difficulty: 'متوسط',
                                  durationWeeks: 4,
                                  sessionsPerWeek: 3,
                                  totalSessions: 12,
                                  goal: 'ارتقای توان بدنی با تمرینات برگزیده رایگان',
                                })
                              }
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3 h-8 shadow-sm cursor-pointer"
                            >
                              فعال‌سازی ({selectedFreeItems.length} تمرین)
                            </Button>
                          </div>
                        )}

                        {/* 10 Category Horizontal Pills (Clean & Compact) */}
                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {TRAINING_CATEGORIES_10.map((cat, idx) => {
                            const isSel = selectedCategoryKey === cat.key;
                            return (
                              <button
                                key={cat.key}
                                type="button"
                                onClick={() => setSelectedCategoryKey(cat.key)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all border flex items-center gap-1 cursor-pointer ${
                                  isSel
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700 hover:border-purple-300'
                                }`}
                              >
                                <span className="text-[10px] opacity-70">{idx + 1}.</span>
                                <span>{cat.title}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Drills Grid (Clean, Responsive, Mobile-friendly) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {activeCategoryDrills.map((drill) => {
                            const isPicked = selectedFreeItems.includes(drill.id);
                            return (
                      <div
                        key={drill.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between bg-white dark:bg-slate-800/60 ${
                          isPicked
                            ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md'
                            : 'border-slate-200 dark:border-slate-700/80 hover:border-purple-300'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Image & Video Tag */}
                          <div
                            onClick={() => setFreeDrillDetail(drill)}
                            className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 cursor-pointer group"
                          >
                            <img
                              src={drill.thumbnailUrl}
                              alt={drill.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <div className="h-10 w-10 rounded-full bg-white/90 text-purple-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="h-5 w-5 fill-purple-700 ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-xs">
                              {drill.subCategory}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                                سطح: {drill.difficulty}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {drill.duration}
                              </span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">
                              {drill.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                              {drill.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => setFreeDrillDetail(drill)}
                            className="flex-1 py-1.5 px-2.5 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors cursor-pointer"
                          >
                            مشاهده ویدیو و جزئیات
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFreeItems((prev) =>
                                prev.includes(drill.id)
                                  ? prev.filter((id) => id !== drill.id)
                                  : [...prev, drill.id]
                              );
                            }}
                            className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                              isPicked
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                            }`}
                          >
                            {isPicked ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                انتخاب شد
                              </>
                            ) : (
                              'افزودن به برنامه'
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* TAB 1 - NUTRITION CATEGORIES (DECLUTTERED) */
              <div className="space-y-3.5">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {NUTRITION_CATEGORIES_FREE.map((n) => (
                    <button
                      key={n.key}
                      type="button"
                      onClick={() => setSelectedCategoryKey(n.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all border cursor-pointer ${
                        selectedCategoryKey === n.key
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:border-purple-300'
                      }`}
                    >
                      {n.title}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {activeNutritionItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-purple-100 dark:border-slate-700 bg-white dark:bg-slate-800/60 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                            {item.categoryTitle}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                            {item.title}
                          </h4>
                        </div>
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                          کالری تقریبی: {item.approxCalories}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-white/5">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            مواد لازم و فرمول:
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
                            {item.keyIngredients.map((ing, i) => (
                              <li key={i}>{ing}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-white/5">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            زمان مصرف ایده‌آل:
                          </span>
                          <p className="text-slate-600 dark:text-slate-400">{item.idealTiming}</p>
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mt-2 mb-1">
                            نکته مربی تغذیه:
                          </span>
                          <p className="text-emerald-700 dark:text-emerald-400">{item.coachingNotes}</p>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        onClick={() =>
                          triggerActivationFlow({
                            id: `nut-free-${Date.now()}`,
                            title: `برنامه غذایی پایه: ${item.title}`,
                            price: 'رایگان',
                            dailyCalories: 2400,
                            goal: item.summary,
                          })
                        }
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-black cursor-pointer"
                      >
                        فعال‌سازی این راهنمای غذایی در پنل من
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: READY PLANS (199K) - STREAMLINED & DECLUTTERED
            ========================================================================= */}
        {activeTab === 'ready' && (
          <div className="space-y-3.5">
            {/* Clean Age Group Filter & Subtle Price Indicator */}
            <div className="flex items-center justify-between pb-1 gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  'همه',
                  'نونهالان (زیر ۱۲ سال)',
                  'نوجوانان (۱۲ تا ۱۵ سال)',
                  'جوانان (۱۶ تا ۱۹ سال)',
                  'بزرگسالان (+۱۹ سال)',
                ].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setReadyAgeFilter(age)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors border cursor-pointer ${
                      readyAgeFilter === age
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:border-purple-300'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
              <span className="hidden sm:inline-block text-xs font-black text-purple-700 dark:text-purple-300 shrink-0 mr-2">
                تعرفه: ۱۹۹ هزار تومان
              </span>
            </div>

            {/* Ready Programs List */}
            {mode === 'training' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readyTrainingPlans
                  .filter(
                    (p) =>
                      readyAgeFilter === 'همه' ||
                      p.ageGroup.includes(readyAgeFilter) ||
                      p.ageGroup === 'تمامی رده‌ها'
                  )
                  .map((plan) => (
                    <div
                      key={plan.id}
                      className="p-5 rounded-2xl border border-purple-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                            {plan.ageGroup}
                          </span>
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                            {plan.price}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white line-clamp-1">
                          {plan.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {plan.description}
                        </p>

                        <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">مدت دوره</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {plan.durationWeeks} هفته
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">جلسات</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {plan.sessionsPerWeek} جلسه/هفته
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">سطح</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {plan.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Drills Summary Pills */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            محور تمرینات:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {plan.drillsSummary.map((d, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        onClick={() => triggerActivationFlow(plan)}
                        className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs h-10 shadow-md shadow-purple-500/20 cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        دریافت و فعال‌سازی برنامه (۱۹۹ هزار تومان)
                      </Button>
                    </div>
                  ))}
              </div>
            ) : (
              /* Ready Nutrition Plans */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readyNutritionPlans
                  .filter(
                    (p) =>
                      readyAgeFilter === 'همه' ||
                      p.ageGroup.includes(readyAgeFilter) ||
                      p.ageGroup === 'تمامی رده‌ها'
                  )
                  .map((nutPlan) => (
                    <div
                      key={nutPlan.id}
                      className="p-5 rounded-2xl border border-purple-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                            {nutPlan.ageGroup}
                          </span>
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                            {nutPlan.price}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white line-clamp-1">
                          {nutPlan.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {nutPlan.goal}
                        </p>

                        <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-white/5 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">کالری روزانه هدف:</span>
                            <span className="font-black text-purple-700 dark:text-purple-300">
                              {nutPlan.dailyCalories} کیلوکالری
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">تمرکز تغذیه:</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {nutPlan.focus}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            وعده‌های شاخص:
                          </span>
                          <div className="space-y-1 text-xs">
                            {nutPlan.mealsSummary.slice(0, 3).map((m, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-[11px]"
                              >
                                <span className="font-bold text-purple-700 dark:text-purple-300">
                                  {m.name}:
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
                                  {m.food}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        onClick={() => triggerActivationFlow(nutPlan)}
                        className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs h-10 shadow-md shadow-purple-500/20 cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        دریافت و فعال‌سازی رژیم غذایی (۱۹۹ هزار تومان)
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB CONTENT: TAB 3 - PERSONAL COACH CUSTOM PLAN (399,000 TOMANS)
            ========================================================================= */}
        {activeTab === 'custom-coach' && (
          <div className="space-y-3.5">
            {/* Search Input with subtle price tag */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجوی مربی بر اساس نام، مدرک (UEFA)، تخصص (چابکی، سرعت، تکنیک)..."
                  value={coachSearch}
                  onChange={(e) => setCoachSearch(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-600"
                />
              </div>
              <span className="hidden sm:inline-block text-xs font-black text-amber-600 dark:text-amber-400 shrink-0 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                تعرفه: ۳۹۹ هزار تومان
              </span>
            </div>

            {/* Coaches List & Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCoaches.map((coach) => {
                const isSelected = selectedCoach?.id === coach.id;
                return (
                  <div
                    key={coach.id}
                    onClick={() => setSelectedCoach(coach)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-black flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                            {coach.fullName}
                          </h4>
                          <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            {coach.rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-purple-700 dark:text-purple-300 font-bold mt-0.5">
                          {coach.title}
                        </p>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                          مدرک: {coach.license} ({coach.experienceYears} سال سابقه)
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {coach.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {coach.specialty.map((s: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {coach.studentsCount} شاگرد فعال
                      </span>
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                          isSelected
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isSelected ? 'مربی انتخاب شد' : 'انتخاب این مربی'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Request Form if Coach Selected */}
            {selectedCoach && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-4 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-amber-600" />
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    ثبت درخواست برنامه اختصاصی با {selectedCoach.fullName} (۳۹۹,۰۰۰ تومان)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      نام شاگرد:
                    </label>
                    <input
                      type="text"
                      placeholder="نام و نام خانوادگی..."
                      value={coachForm.playerName}
                      onChange={(e) =>
                        setCoachForm({ ...coachForm, playerName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      رده سنی:
                    </label>
                    <input
                      type="text"
                      value={coachForm.playerAge}
                      onChange={(e) =>
                        setCoachForm({ ...coachForm, playerAge: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      پست تخصصی در زمین:
                    </label>
                    <input
                      type="text"
                      value={coachForm.playerPosition}
                      onChange={(e) =>
                        setCoachForm({ ...coachForm, playerPosition: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block text-xs mb-1">
                    اهداف و اولویت‌های تمرینی شما برای مربی:
                  </label>
                  <textarea
                    rows={2}
                    value={coachForm.goals}
                    onChange={(e) =>
                      setCoachForm({ ...coachForm, goals: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={() =>
                    triggerActivationFlow({
                      id: `coach-custom-${Date.now()}`,
                      title: `برنامه اختصاصی با ${selectedCoach.fullName}`,
                      coachName: selectedCoach.fullName,
                      price: '۳۹۹,۰۰۰ تومان',
                      priceNumber: 399000,
                      durationWeeks: 6,
                      sessionsPerWeek: 4,
                      totalSessions: 24,
                      difficulty: 'پیشرفته',
                      goal: coachForm.goals,
                    })
                  }
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-black text-xs h-11 shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  تایید نهایی و دریافت برنامه اختصاصی (۳۹۹ هزار تومان)
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  </div>
)}

        {/* DRILL DETAIL MODAL FOR FREE DRILLS */}
        {freeDrillDetail && (
          <DrillDetailModal
            isOpen={!!freeDrillDetail}
            onClose={() => setFreeDrillDetail(null)}
            drill={
              {
                id: freeDrillDetail.id,
                categoryIndex: 1,
                categoryTitle: freeDrillDetail.categoryTitle,
                englishName: freeDrillDetail.englishTitle,
                persianName: freeDrillDetail.title,
                equipment: freeDrillDetail.equipment,
                targetSkill: freeDrillDetail.targetSkill,
                difficulty:
                  freeDrillDetail.difficulty === 'مبتدی'
                    ? 'BEGINNER'
                    : freeDrillDetail.difficulty === 'متوسط'
                    ? 'INTERMEDIATE'
                    : freeDrillDetail.difficulty === 'پیشرفته'
                    ? 'ADVANCED'
                    : 'PRO',
                description: freeDrillDetail.description,
                videoUrl: freeDrillDetail.videoUrl,
                imageUrl: freeDrillDetail.thumbnailUrl,
                setsAndReps: freeDrillDetail.setsReps,
                durationMinutes: parseInt(freeDrillDetail.duration) || 12,
                coachingTips: freeDrillDetail.coachingTips,
                commonMistakes: freeDrillDetail.commonMistakes,
              } as any
            }
          />
        )}
      </Card>
    </div>
  );
};

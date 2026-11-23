import { API_BASE_URL, resolveMediaUrl } from '@/lib/api';
import React, { useState, useEffect, useMemo } from 'react';
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
  Plus,
} from 'lucide-react';
import {
  FreeDrill,
  getTrainingDrills,
  syncDrillsWithServer,
} from '../data/freeTrainingCategories';
import {
  NUTRITION_CATEGORIES_FREE,
  FREE_NUTRITION_ITEMS,
} from '../data/freeNutritionCategories';
import {
  getReadyTrainingPlans,
  getReadyNutritionPlans,
  syncProgramsWithServer,
  ReadyTrainingPlan,
  ReadyNutritionPlan,
  saveUnlockedPlan,
  isPlanUnlocked,
  getAgeGroupFromAge,
} from '../data/readyProgramsStore';
import { useAuth } from '@/context/AuthContext';
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
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<AcquisitionTab>('free');

  // Personalization based on user profile age
  const userAgeGroup = useMemo(() => {
    return currentUser?.age ? getAgeGroupFromAge(currentUser.age) : null;
  }, [currentUser?.age]);

  // --- FREE TAB STATE ---
  const [drillSearchText, setDrillSearchText] = useState('');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [trainingDrills, setTrainingDrills] = useState<FreeDrill[]>(() => getTrainingDrills());
  const [freeDrillDetail, setFreeDrillDetail] = useState<FreeDrill | null>(null);
  const [selectedFreeItems, setSelectedFreeItems] = useState<string[]>([]);

  // --- FREE CALENDAR SCHEDULE CONFIGURATION (4 WEEKS / 3 SESSIONS PER WEEK / 12 TOTAL) ---
  const [calendarDays, setCalendarDays] = useState<string[]>(['شنبه', 'دوشنبه', 'چهارشنبه']);

  // --- READY TAB STATE ---
  const [readyTrainingPlans, setReadyTrainingPlans] = useState<ReadyTrainingPlan[]>([]);
  const [readyNutritionPlans, setReadyNutritionPlans] = useState<ReadyNutritionPlan[]>([]);

  // --- CUSTOM COACH TAB STATE ---
  const [coachSearch, setCoachSearch] = useState('');
  const [coaches, setCoaches] = useState<any[]>([]);


  // --- PROFILE-COMPLETION-STYLE ANIMATION STATE ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMsg, setTransitionMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [completedPlanResult, setCompletedPlanResult] = useState<any | null>(null);

  // Load Ready Plans & Drills from Store (Synchronized with Secret Admin & Backend)
  useEffect(() => {
    if (!isOpen) return;
    setReadyTrainingPlans(getReadyTrainingPlans());
    setReadyNutritionPlans(getReadyNutritionPlans());
    setTrainingDrills(getTrainingDrills());

    syncProgramsWithServer().then((plans) => {
      if (plans && plans.length > 0) setReadyTrainingPlans(plans);
    });

    syncDrillsWithServer().then((drills) => {
      if (drills && drills.length > 0) setTrainingDrills(drills);
    });

    const handleDrillsUpdate = () => {
      setTrainingDrills(getTrainingDrills());
    };
    window.addEventListener('ft_drills_updated', handleDrillsUpdate);

    // Fetch Coaches
    const fetchCoaches = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/coaches`);
        if (res.ok) {
          const data = await res.json();
          setCoaches(Array.isArray(data) ? data : []);
          return;
        }
      } catch {
        setCoaches([]);
      }
      setCoaches([]);
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
            'ثبت رسمی در پایگاه داده فرست تاچ و اتصال به کارتابل شاگرد...'
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
    // Save to unlocked store so user has permanent lifetime ownership (never pay again)
    saveUnlockedPlan(planData.id, planData.title);
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

  const handleToggleCalendarDay = (day: string) => {
    setCalendarDays((prev) => {
      if (prev.includes(day)) {
        if (prev.length <= 1) return prev;
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleConfirmFreeCalendarPlan = () => {
    const days = calendarDays.length > 0 ? calendarDays : ['شنبه', 'دوشنبه', 'چهارشنبه'];
    const totalSessions = days.length * 4;

    const pickedDrills = trainingDrills.filter((d) => selectedFreeItems.includes(d.id));
    const drillTitles = pickedDrills.map((d) => d.title);

    const sessionTemplates = [
      { title: 'تمرین لمس اول و شتاب اولیه', focus: 'شتاب اولیه و کنترل جهت‌دار' },
      { title: 'تمرین چابکی و انتقال توپ', focus: 'چابکی و انتقال پرسرعت' },
      { title: 'تمرین تاکتیک و شوت‌زنی', focus: 'دقت ضربه و موقعیت‌سنجی' },
      { title: 'تمرین سرعت واکنش و استارت کوتاه', focus: 'شروع انفجاری و زمان واکنش' },
      { title: 'تمرین پلیومتریک و پرش‌های کنترلی', focus: 'قدرت انفجاری پرش و فرود' },
      { title: 'تمرین دقت پاس و چرخش', focus: 'پاس تک‌ضرب تحت فشار' },
      { title: 'تمرین شاتل و استقامت سرعت', focus: 'استقامت در شتاب و ریکاوری' },
    ];

    const schedule = [1, 2, 3, 4].map((weekNum) => ({
      weekNumber: weekNum,
      sessions: days.map((dayName, idx) => {
        const tmpl = sessionTemplates[(idx + weekNum - 1) % sessionTemplates.length];
        const sTitle = drillTitles.length > 0
          ? drillTitles[(idx + weekNum - 1) % drillTitles.length]
          : tmpl.title;
        return {
          dayName,
          title: sTitle,
          focus: tmpl.focus,
          durationMinutes: 50,
          completed: false,
          drillsCount: drillTitles.length > 0 ? drillTitles.length : 3,
        };
      }),
    }));

    const titleSuffix = selectedFreeItems.length > 0 ? ` (${selectedFreeItems.length} تمرین انتخابی)` : '';
    const newPlan = {
      id: `free-plan-${Date.now()}`,
      title: `برنامه تمرینی ${days.length} روز در هفته${titleSuffix}`,
      coachName: 'کادر فنی فرست تاچ',
      coachTitle: 'مجموعه تخصصی فرست تاچ',
      price: 'رایگان',
      isFree: true,
      difficulty: 'متوسط',
      durationWeeks: 4,
      sessionsPerWeek: days.length,
      totalSessions: totalSessions,
      completedSessions: 0,
      goal: 'ارتقای شتاب اولیه، لمس اول و آمادگی بدنی پایه فوتبال',
      description: `برنامه تقویمی ۴ هفته‌ای (${totalSessions} جلسه) بر اساس روزهای ${days.join('، ')}. تمام جلسات دارای چک‌لیست تقویمی و امکان تیک زدن با ماندگاری کامل هستند.`,
      drillsSummary: drillTitles.length > 0 ? drillTitles : undefined,
      schedule,
    };

    saveUnlockedPlan(newPlan.id, newPlan.title);
    onPlanActivated(newPlan);
    onClose();
  };

  const handleAddSingleDrillToActivePlan = (drill: FreeDrill) => {
    const days = ['شنبه', 'دوشنبه', 'چهارشنبه'];
    const activePlansRaw = localStorage.getItem('first_touch_student_active_plans');
    let currentPrograms: any[] = [];
    try {
      if (activePlansRaw) {
        currentPrograms = JSON.parse(activePlansRaw);
      }
    } catch {}

    if (Array.isArray(currentPrograms) && currentPrograms.length > 0) {
      const prog = currentPrograms[0];
      const updatedSchedule = (prog.schedule || []).map((week: any) => ({
        ...week,
        sessions: (week.sessions || []).map((s: any) => ({
          ...s,
          title: s.title ? `${s.title} + ${drill.title}` : drill.title,
          drillsCount: (s.drillsCount || 3) + 1,
        })),
      }));
      const updatedProg = {
        ...prog,
        schedule: updatedSchedule,
        drillsSummary: Array.from(new Set([...(prog.drillsSummary || []), drill.title])),
      };
      const updatedList = [updatedProg, ...currentPrograms.slice(1)];
      localStorage.setItem('first_touch_student_active_plans', JSON.stringify(updatedList));
      onPlanActivated(updatedProg);
    } else {
      const newPlan = {
        id: `free-plan-${Date.now()}`,
        title: `برنامه تمرینی ${drill.title}`,
        coachName: 'کادر فنی فرست تاچ',
        coachTitle: 'مجموعه تخصصی فرست تاچ',
        price: 'رایگان',
        isFree: true,
        difficulty: drill.difficulty || 'متوسط',
        durationWeeks: 4,
        sessionsPerWeek: 3,
        totalSessions: 12,
        completedSessions: 0,
        goal: drill.targetSkill || 'ارتقای مهارت و چابکی فوتبال',
        description: drill.description || `برنامه تمرینی متمرکز بر ${drill.title}`,
        drillsSummary: [drill.title],
        schedule: [1, 2, 3, 4].map((w) => ({
          weekNumber: w,
          sessions: days.map((dayName) => ({
            dayName,
            title: drill.title,
            focus: drill.targetSkill || 'چابکی و مهارت',
            durationMinutes: 50,
            completed: false,
            drillsCount: 3,
          })),
        })),
      };
      saveUnlockedPlan(newPlan.id, newPlan.title);
      localStorage.setItem('first_touch_student_active_plans', JSON.stringify([newPlan]));
      onPlanActivated(newPlan);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('ft_student_plan_updated'));
    }
    onClose();
  };

  // Filtered Drills for Search & Category (Reactive with Admin additions)
  const activeCategoryDrills = useMemo(() => {
    let list = trainingDrills;
    if (selectedCategoryKey && selectedCategoryKey !== 'all') {
      list = list.filter((d) => d.categoryKey === selectedCategoryKey);
    }
    if (drillSearchText.trim()) {
      const q = drillSearchText.trim().toLowerCase();
      list = list.filter(
        (d) =>
          (d.title && d.title.toLowerCase().includes(q)) ||
          (d.subCategory && d.subCategory.toLowerCase().includes(q)) ||
          (d.categoryTitle && d.categoryTitle.toLowerCase().includes(q)) ||
          (d.description && d.description.toLowerCase().includes(q)) ||
          (d.targetSkill && d.targetSkill.toLowerCase().includes(q)) ||
          (d.difficulty && d.difficulty.toLowerCase().includes(q))
      );
    }
    return list;
  }, [trainingDrills, selectedCategoryKey, drillSearchText]);

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto select-none">
      <Card className="w-full max-w-4xl border border-emerald-500/30 dark:border-emerald-500/20 bg-slate-900/90 dark:bg-[#07160e]/92 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] relative overflow-hidden rounded-3xl my-2 sm:my-6 flex flex-col max-h-[96vh] sm:max-h-[90vh] text-white">
        {/* Top Header - Liquid Glass & Compact */}
        <div className="p-3.5 sm:p-5 border-b border-white/10 dark:border-emerald-500/20 flex items-center justify-between bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent dark:from-[#091b12] dark:via-[#07160e] dark:to-[#040e08] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
              {mode === 'training' ? (
                <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Apple className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>
                  {mode === 'training'
                    ? 'دریافت برنامه تمرینی'
                    : 'دریافت برنامه غذایی'}
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-200/70 mt-0.5 hidden sm:block">
                انتخاب از میان برنامه‌های ساده رایگان، آماده رده سنی و اختصاصی با مربی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 3 LIQUID GLASS TABS SWITCHER WITH SLIDING PILL */}
        {!isProcessing && !isTransitioning && (
          <div className="px-3.5 sm:px-6 pt-3 sm:pt-4 shrink-0">
            <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-white/5 dark:bg-black/50 border border-white/10 dark:border-emerald-500/20 backdrop-blur-xl relative shadow-inner">
              {/* Option 1: Simple (Free) */}
              <button
                type="button"
                onClick={() => setActiveTab('free')}
                className={`relative py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'free'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {activeTab === 'free' && (
                  <motion.div
                    layoutId="modalAcquisitionTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/30 via-emerald-500/20 to-teal-500/20 border border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.35)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 relative z-10 shrink-0" />
                <span className="relative z-10 hidden sm:inline">رایگان (تخصصی)</span>
                <span className="relative z-10 sm:hidden">رایگان</span>
              </button>

              {/* Option 2: Ready Plan (199,000 Tomans) */}
              <button
                type="button"
                onClick={() => setActiveTab('ready')}
                className={`relative py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ready'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {activeTab === 'ready' && (
                  <motion.div
                    layoutId="modalAcquisitionTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/30 via-emerald-500/20 to-teal-500/20 border border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.35)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Calendar className="h-3.5 w-3.5 text-emerald-400 relative z-10 shrink-0" />
                <span className="relative z-10 hidden sm:inline">برنامه آماده (۱۹۹ ت)</span>
                <span className="relative z-10 sm:hidden">آماده (۱۹۹ ت)</span>
              </button>

              {/* Option 3: Custom with Coach (399,000 Tomans) */}
              <button
                type="button"
                onClick={() => setActiveTab('custom-coach')}
                className={`relative py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'custom-coach'
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {activeTab === 'custom-coach' && (
                  <motion.div
                    layoutId="modalAcquisitionTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/30 via-amber-500/20 to-orange-500/20 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.35)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <UserCheck className="h-3.5 w-3.5 text-amber-400 relative z-10 shrink-0" />
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
              <div className="h-16 w-16 rounded-full border-4 border-emerald-200 dark:border-emerald-900 border-t-emerald-600 animate-spin" />
              <Sparkles className="h-6 w-6 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
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
                  className="stroke-emerald-500 transition-all duration-300"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 60}
                  strokeDashoffset={2 * Math.PI * 60 * (1 - progress / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-emerald-700 dark:text-emerald-300">
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
              <div className="w-full max-w-md p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-right space-y-3 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
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
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs h-11 shadow-lg shadow-emerald-500/25 cursor-pointer"
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
                        {/* 1. Schedule Selection: Choose training days */}
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/80 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3 shadow-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 dark:border-white/5 pb-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <div>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                                  در هفته چقدر می‌خوای تمرین کنی؟
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                  روزهای تمرین را انتخاب کنید ({calendarDays.length} روز • {calendarDays.length * 4} جلسه در ماه)
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="primary"
                              disabled={calendarDays.length === 0}
                              onClick={handleConfirmFreeCalendarPlan}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 h-9 rounded-xl shadow-md cursor-pointer self-stretch sm:self-auto justify-center gap-1.5"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              فعال‌سازی ({calendarDays.length * 4} جلسه)
                            </Button>
                          </div>

                          {/* Days Selection - Responsive: 4 cols on mobile, 7 cols on desktop */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                                روزهای جلسات تمرین در طول هفته:
                              </span>
                              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                                {calendarDays.length} روز در هفته
                              </span>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                              {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'].map((day) => {
                                const isPicked = calendarDays.includes(day);
                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleToggleCalendarDay(day)}
                                    className={`py-2.5 sm:py-2 px-1 text-center rounded-xl text-xs font-black transition-all border cursor-pointer min-h-[44px] flex items-center justify-center ${
                                      isPicked
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-1 ring-emerald-500'
                                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-emerald-400'
                                    }`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Selected items indicator if drills were picked */}
                        {selectedFreeItems.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                              {selectedFreeItems.length} تمرین تخصصی برگزیده شد
                            </span>
                            <Button
                              variant="primary"
                              onClick={handleConfirmFreeCalendarPlan}
                              disabled={calendarDays.length === 0}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 h-8 shadow-sm cursor-pointer gap-1.5"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              تأیید و صدور با {selectedFreeItems.length} تمرین
                            </Button>
                          </div>
                        )}

                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            value={drillSearchText}
                            onChange={(e) => setDrillSearchText(e.target.value)}
                            placeholder="جستجوی تمرین (چابکی، سرعت، شوت، پرس...)"
                            className="w-full pr-10 pl-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Category Filter Pills (چابکی، قدرتی، سرعتی، تکنیکی، استقامت...) */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none">
                          {[
                            { key: 'all', title: 'همه تمرینات' },
                            { key: 'agility', title: 'چابکی' },
                            { key: 'strength', title: 'قدرتی' },
                            { key: 'speed', title: 'سرعت' },
                            { key: 'endurance', title: 'استقامت' },
                            { key: 'technique', title: 'تکنیکی' },
                            { key: 'tactics', title: 'تاکتیکی' },
                            { key: 'balance', title: 'تعادل و هماهنگی' },
                            { key: 'flexibility', title: 'انعطاف‌پذیری' },
                            { key: 'goalkeeping', title: 'دروازه‌بانی' },
                            { key: 'warmup', title: 'گرم‌کردن و سردکردن' },
                          ].map((cat) => {
                            const isSelected = selectedCategoryKey === cat.key;
                            return (
                              <button
                                key={cat.key}
                                type="button"
                                onClick={() => setSelectedCategoryKey(cat.key)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                                    : 'bg-white/10 dark:bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/15 border border-white/10'
                                }`}
                              >
                                {cat.title}
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
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between bg-white/10 dark:bg-white/[0.04] backdrop-blur-xl ${
                          isPicked
                            ? 'border-emerald-400 bg-emerald-500/15 dark:bg-emerald-950/30 shadow-[0_0_20px_rgba(52,211,153,0.25)]'
                            : 'border-white/15 dark:border-white/10 hover:border-emerald-500/40 hover:bg-white/15'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Image & Video Tag (Never black - always vivid with glowing play button) */}
                          {(() => {
                            const posterSrc =
                              drill.thumbnailUrl && drill.thumbnailUrl.startsWith('http') && !drill.thumbnailUrl.includes('unsplash')
                                ? drill.thumbnailUrl
                                : drill.categoryKey === 'speed' || drill.title.includes('پاس')
                                ? '/drill-thumb-passing.png'
                                : drill.title.includes('مخروط') || drill.title.includes('دریبل')
                                ? '/drill-thumb-cones.png'
                                : '/drill-thumb-agility.png';

                            return (
                              <div
                                onClick={() => setFreeDrillDetail(drill)}
                                className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 cursor-pointer group shadow-lg border border-white/10"
                              >
                                {drill.videoUrl ? (
                                  <video
                                    src={`${resolveMediaUrl(drill.videoUrl)}#t=0.5`}
                                    preload="metadata"
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                                  />
                                ) : (
                                  <img
                                    src={posterSrc}
                                    alt={drill.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                )}

                                {/* Ambient Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:via-black/15 transition-colors flex items-center justify-center">
                                  {/* Glossy Emerald Play Button */}
                                  <div className="h-12 w-12 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.7)] group-hover:scale-110 transition-transform border border-white/30 backdrop-blur-sm">
                                    <Play className="h-6 w-6 fill-white text-white ml-0.5" />
                                  </div>
                                </div>

                                {/* Category Tag */}
                                <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/75 text-white backdrop-blur-md border border-white/10">
                                  {drill.subCategory}
                                </span>

                                {/* Video Tag */}
                                {drill.videoUrl && (
                                  <span className="absolute top-2.5 left-2.5 text-[10px] font-black px-2.5 py-0.5 rounded-md bg-emerald-500/95 text-slate-950 shadow-md flex items-center gap-1 backdrop-blur-xs">
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-950 animate-pulse" />
                                    <span>ویدیو</span>
                                  </span>
                                )}
                              </div>
                            );
                          })()}

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
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
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {drill.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => setFreeDrillDetail(drill)}
                            className="py-1.5 px-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                          >
                            ویدیو
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFreeItems((prev) =>
                                prev.includes(drill.id) ? prev.filter((id) => id !== drill.id) : [...prev, drill.id]
                              );
                            }}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              isPicked
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-emerald-400'
                            }`}
                            title={isPicked ? 'انتخاب شده برای صدور چندتایی' : 'انتخاب'}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddSingleDrillToActivePlan(drill)}
                            className="flex-1 py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                            title="افزودن این تمرین مستقیم به بخش تمرینات من"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>افزودن تمرین</span>
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
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:border-emerald-300'
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
                      className="p-4 rounded-2xl border border-emerald-100 dark:border-slate-700 bg-white dark:bg-slate-800/60 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            {item.categoryTitle}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                            {item.title}
                          </h4>
                        </div>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                          کالری تقریبی: {item.approxCalories}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.summary}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-white/5">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            مواد لازم و فرمول:
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
                            {item.keyIngredients.map((ing, i) => (
                              <li key={i}>{ing}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-white/5">
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
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer"
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
            TAB 2: READY PLANS (199K) - FILTERED BY USER PROFILE AGE AUTOMATICALLY
            ========================================================================= */}
        {activeTab === 'ready' && (
          <div className="space-y-3.5">
            {/* Automatic Age Match Indicator without Any Manual Selectors */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  {userAgeGroup
                    ? `برنامه‌های متناسب با سن شما در پروفایل (${currentUser?.age} سال • ${userAgeGroup})`
                    : 'برنامه‌های تمرینی تخصصی فرست تاچ'}
                </span>
              </div>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 shrink-0 mr-2">
                تعرفه: ۱۹۹ هزار تومان
              </span>
            </div>

            {/* Ready Programs List */}
            {mode === 'training' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  readyTrainingPlans.filter(
                    (p) =>
                      !userAgeGroup ||
                      p.ageGroup.includes(userAgeGroup) ||
                      p.ageGroup === 'تمامی رده‌ها'
                  ).length > 0
                    ? readyTrainingPlans.filter(
                        (p) =>
                          !userAgeGroup ||
                          p.ageGroup.includes(userAgeGroup) ||
                          p.ageGroup === 'تمامی رده‌ها'
                      )
                    : readyTrainingPlans
                ).map((plan) => {
                    const isUnlocked = isPlanUnlocked(plan.id, plan.title);
                    return (
                      <div
                        key={plan.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 backdrop-blur-xl ${
                          isUnlocked
                            ? 'border-emerald-400 bg-emerald-500/15 dark:bg-emerald-950/30 shadow-[0_0_20px_rgba(52,211,153,0.25)]'
                            : 'border-white/15 dark:border-white/10 bg-white/10 dark:bg-white/[0.04] hover:border-emerald-500/40 hover:bg-white/15 hover:shadow-lg'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                              {plan.ageGroup}
                            </span>
                            {isUnlocked ? (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                قبلاً خریداری شده (رایگان)
                              </span>
                            ) : (
                              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                                {plan.price}
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-black text-slate-900 dark:text-white line-clamp-1">
                            {plan.title}
                          </h4>

                          {/* Video Indicator if video attached */}
                          {plan.videoUrl && (
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <Play className="h-3 w-3 fill-current" />
                              <span>دارای ویدیوی اختصاصی آموزش تمرین</span>
                            </div>
                          )}

                          {/* Description - only rendered if not empty */}
                          {Boolean(plan.description && plan.description.trim()) && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                              {plan.description}
                            </p>
                          )}

                          {/* Goal - only rendered if not empty */}
                          {Boolean(plan.goal && plan.goal.trim()) && (
                            <p className="text-[11px] text-muted-foreground font-semibold">
                              هدف: <span className="text-foreground">{plan.goal}</span>
                            </p>
                          )}

                          {/* Equipment - only rendered if not empty */}
                          {Boolean(plan.equipment && plan.equipment.length > 0) && (
                            <div className="text-[11px] text-muted-foreground">
                              <span>تجهیزات: </span>
                              <span className="font-semibold text-foreground">
                                {Array.isArray(plan.equipment) ? plan.equipment.join('، ') : plan.equipment}
                              </span>
                            </div>
                          )}

                          <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 text-center text-xs">
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

                          {/* Drills Summary Pills - only rendered if not empty */}
                          {Boolean(plan.drillsSummary && plan.drillsSummary.length > 0) && (
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
                          )}
                        </div>

                        <Button
                          variant={isUnlocked ? 'outline' : 'primary'}
                          onClick={() => triggerActivationFlow(plan)}
                          className={`w-full gap-2 text-xs font-black h-10 cursor-pointer ${
                            isUnlocked
                              ? 'border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 shadow-sm'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
                          }`}
                        >
                          <Sparkles className="h-4 w-4" />
                          {isUnlocked
                            ? 'فعال‌سازی مجدد (بدون نیاز به پرداخت)'
                            : 'دریافت و فعال‌سازی برنامه (۱۹۹ هزار تومان)'}
                        </Button>
                      </div>
                    );
                  })}
              </div>
            ) : (
              /* Ready Nutrition Plans */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  readyNutritionPlans.filter(
                    (p) =>
                      !userAgeGroup ||
                      p.ageGroup.includes(userAgeGroup) ||
                      p.ageGroup === 'تمامی رده‌ها'
                  ).length > 0
                    ? readyNutritionPlans.filter(
                        (p) =>
                          !userAgeGroup ||
                          p.ageGroup.includes(userAgeGroup) ||
                          p.ageGroup === 'تمامی رده‌ها'
                      )
                    : readyNutritionPlans
                ).map((nutPlan) => {
                    const isNutUnlocked = isPlanUnlocked(nutPlan.id, nutPlan.title);
                    return (
                      <div
                        key={nutPlan.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                          isNutUnlocked
                            ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/15 dark:bg-emerald-950/15 shadow-sm'
                            : 'border-emerald-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:shadow-lg'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                              {nutPlan.ageGroup}
                            </span>
                            {isNutUnlocked ? (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                قبلاً خریداری شده (رایگان)
                              </span>
                            ) : (
                              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                                {nutPlan.price}
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-black text-slate-900 dark:text-white line-clamp-1">
                            {nutPlan.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {nutPlan.goal}
                          </p>

                          <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-white/5 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500">کالری روزانه هدف:</span>
                              <span className="font-black text-emerald-700 dark:text-emerald-300">
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
                                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
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
                          variant={isNutUnlocked ? 'outline' : 'primary'}
                          onClick={() => triggerActivationFlow(nutPlan)}
                          className={`w-full gap-2 text-xs font-black h-10 cursor-pointer ${
                            isNutUnlocked
                              ? 'border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 shadow-sm'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
                          }`}
                        >
                          <Sparkles className="h-4 w-4" />
                          {isNutUnlocked
                            ? 'فعال‌سازی مجدد (بدون نیاز به پرداخت)'
                            : 'دریافت و فعال‌سازی رژیم غذایی (۱۹۹ هزار تومان)'}
                        </Button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB CONTENT: TAB 3 - PERSONAL COACH CUSTOM PLAN (399,000 TOMANS)
            ========================================================================= */}
        {activeTab === 'custom-coach' && (
          <div className="space-y-3">
            {/* Search Input with subtle price tag */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="جستجوی مربی..."
                  value={coachSearch}
                  onChange={(e) => setCoachSearch(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 shrink-0 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                ۳۹۹ هزار تومان
              </span>
            </div>

            {/* Coaches List - Just Rating, Name, and Buy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCoaches.map((coach) => (
                <div
                  key={coach.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:border-amber-400 transition-all flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-black flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {coach.fullName}
                      </h4>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{coach.rating}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const tName = currentUser?.fullName || 'شاگرد';
                      const tPhone = currentUser?.phoneNumber || '';
                      const tId = (currentUser as any)?.id || currentUser?.phoneNumber || `tr-${Date.now()}`;
                      fetch(`${API_BASE_URL}/coaches/request`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          coachId: coach.id,
                          coachName: coach.fullName,
                          traineeId: tId,
                          playerName: tName,
                          playerPhone: tPhone,
                          goals: `تمرینات اختصاصی تحت نظارت ${coach.fullName}`,
                          planTitle: `برنامه اختصاصی با ${coach.fullName}`,
                        }),
                      }).catch(() => {});

                      triggerActivationFlow({
                        id: `coach-custom-${coach.id}-${Date.now()}`,
                        coachId: coach.id,
                        title: `برنامه اختصاصی با ${coach.fullName}`,
                        coachName: coach.fullName,
                        price: '۳۹۹,۰۰۰ تومان',
                        priceNumber: 399000,
                        durationWeeks: 6,
                        sessionsPerWeek: 4,
                        totalSessions: 24,
                        difficulty: 'پیشرفته',
                        goal: `تمرینات اختصاصی تحت نظارت ${coach.fullName}`,
                      });
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer shrink-0 active:scale-95"
                  >
                    خرید
                  </button>
                </div>
              ))}
            </div>
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

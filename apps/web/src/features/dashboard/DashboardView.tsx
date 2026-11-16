import { API_BASE_URL } from '@/lib/api';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  CheckCircle2,
  Circle,
  Dumbbell,
  Apple,
  Droplets,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { LinearPerformanceChart, DayPoint } from './components/LinearPerformanceChart';
import { AiCoachModal } from './components/AiCoachModal';

interface SessionItem {
  id: string;
  dayName: string;
  title: string;
  focus: string;
  durationMinutes: number;
  completed: boolean;
  drillsCount: number;
}

interface MealItem {
  id: string;
  mealType: string;
  name: string;
  portion?: string;
  count: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isCompleted?: boolean;
}

const WATER_STORAGE_KEY = 'ft_player_water_glasses';
const TARGET_WATER_GLASSES = 8;

export const DashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [, setIsLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [dailyTab, setDailyTab] = useState<'training' | 'nutrition'>('training');

  // Real Training Program State from API
  const [activeProgram, setActiveProgram] = useState<any>(null);
  const [trainingSessions, setTrainingSessions] = useState<SessionItem[]>([]);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);
  const [totalSessionsCount, setTotalSessionsCount] = useState<number>(1);
  const [weeklyPerformanceData, setWeeklyPerformanceData] = useState<DayPoint[]>([]);
  const [selectedTrainingDate, setSelectedTrainingDate] = useState<Date>(new Date());

  // Real Nutrition State from API
  const [nutritionTarget, setNutritionTarget] = useState({
    calories: 2400,
    protein: 140,
    carbs: 280,
    fat: 65,
  });
  const [consumedNutrition, setConsumedNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [loggedMeals, setLoggedMeals] = useState<MealItem[]>([]);

  // Local Water Tracker (Calculated in glasses: حداقل ۸ لیوان آب)
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(WATER_STORAGE_KEY);
      if (saved !== null && !isNaN(Number(saved))) return Number(saved);
      const oldMl = localStorage.getItem('ft_player_water_ml');
      if (oldMl !== null && !isNaN(Number(oldMl))) return Math.min(16, Math.round(Number(oldMl) / 250));
      return 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WATER_STORAGE_KEY, String(waterGlasses));
      localStorage.setItem('ft_player_water_ml', String(waterGlasses * 250));
    } catch {}
  }, [waterGlasses]);

  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([12]);
      } catch {}
    }
  }, []);

  // Training Calendar Date Formatter & Navigation
  const formattedTrainingPersianDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(selectedTrainingDate);
    } catch {
      return 'امروز';
    }
  }, [selectedTrainingDate]);

  const isTrainingToday = useMemo(() => {
    const today = new Date();
    return (
      selectedTrainingDate.getDate() === today.getDate() &&
      selectedTrainingDate.getMonth() === today.getMonth() &&
      selectedTrainingDate.getFullYear() === today.getFullYear()
    );
  }, [selectedTrainingDate]);

  const handleTrainingPrevDay = () => {
    const d = new Date(selectedTrainingDate);
    d.setDate(d.getDate() - 1);
    setSelectedTrainingDate(d);
  };

  const handleTrainingNextDay = () => {
    const d = new Date(selectedTrainingDate);
    d.setDate(d.getDate() + 1);
    setSelectedTrainingDate(d);
  };

  const handleTrainingGoToday = () => {
    setSelectedTrainingDate(new Date());
  };

  // Nutrition Calendar Date Formatter & Navigation (REAL NUTRITION CALENDAR)
  const [selectedNutritionDate, setSelectedNutritionDate] = useState<Date>(new Date());

  const nutritionDateKey = useMemo(() => {
    return selectedNutritionDate.toISOString().split('T')[0];
  }, [selectedNutritionDate]);

  const formattedNutritionPersianDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(selectedNutritionDate);
    } catch {
      return 'امروز';
    }
  }, [selectedNutritionDate]);

  const isNutritionToday = useMemo(() => {
    const today = new Date();
    return (
      selectedNutritionDate.getDate() === today.getDate() &&
      selectedNutritionDate.getMonth() === today.getMonth() &&
      selectedNutritionDate.getFullYear() === today.getFullYear()
    );
  }, [selectedNutritionDate]);

  const handleNutritionPrevDay = () => {
    const d = new Date(selectedNutritionDate);
    d.setDate(d.getDate() - 1);
    setSelectedNutritionDate(d);
  };

  const handleNutritionNextDay = () => {
    const d = new Date(selectedNutritionDate);
    d.setDate(d.getDate() + 1);
    setSelectedNutritionDate(d);
  };

  const handleNutritionGoToday = () => {
    setSelectedNutritionDate(new Date());
  };

  // Fetch real nutrition logs for selected date (CALENDAR SUPPORT)
  const fetchNutritionForDate = useCallback(async (dateKeyStr: string) => {
    try {
      const nutRes = await fetch(`${API_BASE_URL}/nutrition/daily-log?date=${dateKeyStr}`);
      if (nutRes.ok) {
        const nutData = await nutRes.json();

        if (nutData.target && nutData.target.calories > 0) {
          setNutritionTarget({
            calories: nutData.target.calories || 2400,
            protein: nutData.target.protein || 140,
            carbs: nutData.target.carbs || 280,
            fat: nutData.target.fat || 65,
          });
        }

        setConsumedNutrition({
          calories: nutData.totalCalories || 0,
          protein: nutData.totalProtein || 0,
          carbs: nutData.totalCarbs || 0,
          fat: nutData.totalFat || 0,
        });

        // Flatten all meals
        const mealsObj = nutData.meals || {};
        const allItems: MealItem[] = [];

        ['breakfast', 'lunch', 'dinner', 'snack'].forEach((type) => {
          if (Array.isArray(mealsObj[type])) {
            mealsObj[type].forEach((item: any) => {
              allItems.push({
                id: item.id || `m-${Math.random().toString(36).substring(2, 6)}`,
                mealType: type,
                name: item.name || 'آیتم غذایی',
                portion: item.portion,
                count: item.count || 1,
                calories: Math.round(item.calories || 0),
                protein: Math.round(item.protein || 0),
                carbs: Math.round(item.carbs || 0),
                fat: Math.round(item.fat || 0),
                isCompleted: !!item.isCompleted,
              });
            });
          }
        });

        if (allItems.length === 0) {
          try {
            const presetsRes = await fetch(`${API_BASE_URL}/nutrition/preset-plans`);
            if (presetsRes.ok) {
              const presets = await presetsRes.json();
              if (presets && presets.length > 0) {
                const plan = presets[0];
                setNutritionTarget({
                  calories: plan.dailyCalories || 2400,
                  protein: plan.protein || 140,
                  carbs: plan.carbs || 280,
                  fat: plan.fat || 65,
                });

                if (Array.isArray(plan.plannedItems)) {
                  const mappedItems: MealItem[] = plan.plannedItems.map((p: any, i: number) => ({
                    id: `preset-${i}`,
                    mealType: p.mealType || 'snack',
                    name: p.name,
                    portion: p.portion,
                    count: p.count || 1,
                    calories: Math.round(p.calories || 0),
                    protein: Math.round(p.protein || 0),
                    carbs: Math.round(p.carbs || 0),
                    fat: Math.round(p.fat || 0),
                    isCompleted: false, // ZERO MOCK: Real state
                  }));
                  setLoggedMeals(mappedItems);
                  setConsumedNutrition({ calories: 0, protein: 0, carbs: 0, fat: 0 });
                }
              }
            }
          } catch {}
        } else {
          setLoggedMeals(allItems);
        }
      }
    } catch (e) {
      console.warn('Nutrition fetch notice:', e);
    }
  }, []);

  // Fetch real data from API & Student Local Storage (ZERO MOCK DATA)
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);

    // 1. Fetch Real Training Programs (Prioritize User Enrolled Plans)
    try {
      let prog: any = null;
      const savedPlans = localStorage.getItem('first_touch_student_active_plans');
      if (savedPlans) {
        const parsed = JSON.parse(savedPlans);
        if (Array.isArray(parsed) && parsed.length > 0) {
          prog = parsed[0];
        }
      }

      if (!prog) {
        const progRes = await fetch(`${API_BASE_URL}/programs`);
        if (progRes.ok) {
          const progs = await progRes.json();
          if (Array.isArray(progs) && progs.length > 0) {
            prog = progs[0];
          }
        }
      }

      if (prog) {
        setActiveProgram(prog);
        setCompletedSessionsCount(prog.completedSessions || 0);
        setTotalSessionsCount(prog.totalSessions || 12);

        const week1 = prog.schedule?.[0];
        if (week1 && Array.isArray(week1.sessions)) {
          const mappedSessions: SessionItem[] = week1.sessions.map((s: any, idx: number) => ({
            id: `sess-${idx}`,
            dayName: s.dayName || 'جلسه',
            title: s.title || 'تمرین تخصصی فوتبال',
            focus: s.focus || 'تکنیک و آمادگی بدنی',
            durationMinutes: s.durationMinutes || 45,
            completed: !!s.completed,
            drillsCount: s.drillsCount || 4,
          }));
          setTrainingSessions(mappedSessions);
        }
      }
    } catch (e) {
      console.warn('Programs fetch notice:', e);
    }

    // 2. Fetch Real Nutrition Daily Log for selected date
    await fetchNutritionForDate(nutritionDateKey);

    // 3. Fetch Real Weekly Performance from API
    try {
      const perfRes = await fetch(`${API_BASE_URL}/programs/weekly-performance`);
      if (perfRes.ok) {
        const perfData = await perfRes.json();
        if (perfData.points && Array.isArray(perfData.points)) {
          setWeeklyPerformanceData(perfData.points);
        }
      }
    } catch (e) {
      console.warn('Weekly performance fetch notice:', e);
    } finally {
      setIsLoading(false);
    }
  }, [fetchNutritionForDate, nutritionDateKey]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Re-fetch nutrition whenever nutrition date navigation occurs
  useEffect(() => {
    fetchNutritionForDate(nutritionDateKey);
  }, [fetchNutritionForDate, nutritionDateKey]);

  // Toggle workout session with REAL PERSISTENCE across storage and server
  const handleToggleSession = async (dayName: string) => {
    // 1. Optimistic UI update for sessions list
    setTrainingSessions((prev) =>
      prev.map((s) => (s.dayName === dayName ? { ...s, completed: !s.completed } : s)),
    );

    if (activeProgram?.id) {
      const nextSchedule = (activeProgram.schedule || []).map((w: any, wIdx: number) => {
        if (wIdx !== 0) return w;
        return {
          ...w,
          sessions: (w.sessions || []).map((s: any) =>
            s.dayName === dayName ? { ...s, completed: !s.completed } : s,
          ),
        };
      });

      let completedCount = 0;
      for (const w of nextSchedule) {
        for (const s of w.sessions || []) {
          if (s.completed) completedCount++;
        }
      }

      const updatedProgram = {
        ...activeProgram,
        schedule: nextSchedule,
        completedSessions: completedCount,
      };

      setActiveProgram(updatedProgram);
      setCompletedSessionsCount(completedCount);

      // Persist to localStorage so tick is NEVER lost
      try {
        const savedPlans = localStorage.getItem('first_touch_student_active_plans');
        if (savedPlans) {
          const parsed = JSON.parse(savedPlans);
          if (Array.isArray(parsed)) {
            const nextPlans = parsed.map((p: any) =>
              p.id === updatedProgram.id ? updatedProgram : p,
            );
            localStorage.setItem('first_touch_student_active_plans', JSON.stringify(nextPlans));
          }
        }
      } catch {}

      // Server Sync
      try {
        const res = await fetch(`${API_BASE_URL}/programs/${activeProgram.id}/session-toggle`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weekNumber: 1, dayName }),
        });
        await fetch(`${API_BASE_URL}/programs/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProgram),
        }).catch(() => {});

        if (res.ok) {
          fetch(`${API_BASE_URL}/programs/weekly-performance`)
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => d?.points && setWeeklyPerformanceData(d.points))
            .catch(() => {});
        }
      } catch (e) {
        console.warn('Session toggle notice:', e);
      }
    }
  };

  // Toggle meal item with REAL API date parameter and persistence
  const handleToggleMeal = async (mealId: string) => {
    setLoggedMeals((prev) => {
      const next = prev.map((m) =>
        m.id === mealId ? { ...m, isCompleted: !m.isCompleted } : m,
      );

      const newTotals = next
        .filter((m) => m.isCompleted)
        .reduce(
          (acc, m) => ({
            calories: acc.calories + m.calories,
            protein: acc.protein + m.protein,
            carbs: acc.carbs + m.carbs,
            fat: acc.fat + m.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 },
        );
      setConsumedNutrition(newTotals);

      return next;
    });

    try {
      await fetch(`${API_BASE_URL}/nutrition/toggle-item/${mealId}?date=${nutritionDateKey}`, {
        method: 'PATCH',
      });
    } catch {}
  };

  // Real Progress Percentages
  const calPercent = Math.min(
    100,
    Math.round((consumedNutrition.calories / (nutritionTarget.calories || 2400)) * 100),
  );
  const proteinPercent = Math.min(
    100,
    Math.round((consumedNutrition.protein / (nutritionTarget.protein || 140)) * 100),
  );
  const workoutPercent = Math.min(
    100,
    Math.round((completedSessionsCount / (totalSessionsCount || 12)) * 100),
  );

  const waterPercent = Math.min(100, Math.round((waterGlasses / TARGET_WATER_GLASSES) * 100));

  // Determine current day Persian day name (e.g. شنبه، یکشنبه، دوشنبه، ...)
  const currentPersianDayName = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(new Date());
    } catch {
      return '';
    }
  }, []);

  // Today's scheduled training session from active program
  const todaySession = useMemo(() => {
    if (!currentPersianDayName || trainingSessions.length === 0) return null;
    return (
      trainingSessions.find(
        (s) =>
          s.dayName.includes(currentPersianDayName) ||
          currentPersianDayName.includes(s.dayName),
      ) || null
    );
  }, [currentPersianDayName, trainingSessions]);

  const weekCompletedSessionsCount = useMemo(() => {
    return trainingSessions.filter((s) => s.completed).length;
  }, [trainingSessions]);

  // 1. Training Readiness (Weight: 40%)
  const trainingReadinessScore = useMemo(() => {
    if (trainingSessions.length === 0) return 0;

    if (todaySession) {
      // If today is a training day: 100% when today's session is completed
      if (todaySession.completed) return 100;
      // If not yet completed today, grant partial credit if other week sessions are done
      return weekCompletedSessionsCount > 0
        ? Math.round((weekCompletedSessionsCount / trainingSessions.length) * 50)
        : 0;
    }

    // Today is a scheduled Rest & Recovery day:
    // If the athlete has completed at least 1 session this week, resting correctly is 100% adherence to recovery!
    return weekCompletedSessionsCount > 0 ? 100 : 0;
  }, [trainingSessions, todaySession, weekCompletedSessionsCount]);

  // 2. Nutrition Readiness (Weight: 35%)
  const nutritionReadinessScore = useMemo(() => {
    if (consumedNutrition.calories === 0 && consumedNutrition.protein === 0) {
      return 0;
    }
    const calScore = Math.min(
      100,
      Math.round((consumedNutrition.calories / (nutritionTarget.calories || 2400)) * 100),
    );
    const proteinScore = Math.min(
      100,
      Math.round((consumedNutrition.protein / (nutritionTarget.protein || 140)) * 100),
    );
    return Math.round(calScore * 0.6 + proteinScore * 0.4);
  }, [consumedNutrition, nutritionTarget]);

  // 3. Hydration Readiness (Weight: 25%)
  const waterReadinessScore = useMemo(() => {
    if (waterGlasses === 0) return 0;
    return Math.min(100, Math.round((waterGlasses / TARGET_WATER_GLASSES) * 100));
  }, [waterGlasses]);

  // Dynamic Real Readiness Score (Calculated from Genuine Activity: 0 to 100)
  const readinessScore = useMemo(() => {
    // If absolutely no activity has been logged: 0%
    if (
      trainingReadinessScore === 0 &&
      nutritionReadinessScore === 0 &&
      waterReadinessScore === 0
    ) {
      return 0;
    }

    const raw = Math.round(
      trainingReadinessScore * 0.4 +
        nutritionReadinessScore * 0.35 +
        waterReadinessScore * 0.25,
    );
    return Math.min(100, Math.max(0, raw));
  }, [trainingReadinessScore, nutritionReadinessScore, waterReadinessScore]);

  // Dynamic visual styling & label based on genuine readiness score
  const readinessMeta = useMemo(() => {
    if (readinessScore >= 80) {
      return {
        label: 'عالی',
        colorClass: 'text-emerald-500',
        dotClass: 'bg-emerald-500 animate-pulse',
        bgClass: 'bg-emerald-500/10 border-emerald-500/25',
      };
    }
    if (readinessScore >= 50) {
      return {
        label: 'آماده مسابقه',
        colorClass: 'text-sky-500',
        dotClass: 'bg-sky-500',
        bgClass: 'bg-sky-500/10 border-sky-500/25',
      };
    }
    if (readinessScore >= 25) {
      return {
        label: 'در حال آمادگی',
        colorClass: 'text-amber-500',
        dotClass: 'bg-amber-500',
        bgClass: 'bg-amber-500/10 border-amber-500/25',
      };
    }
    return {
      label: readinessScore === 0 ? 'ثبت نشده' : 'نیازمند تمرین و ریکاوری',
      colorClass: 'text-muted-foreground',
      dotClass: 'bg-muted-foreground/50',
      bgClass: 'bg-muted/40 border-border/70',
    };
  }, [readinessScore]);

  const playerName = currentUser?.fullName || 'مهدی طارمی';

  const getMealTypeLabel = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'صبحانه';
      case 'lunch':
        return 'ناهار';
      case 'dinner':
        return 'شام';
      case 'snack':
      default:
        return 'میان‌وعده';
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-32 sm:pb-36 select-none animate-in fade-in duration-300">
      {/* 1. Real Metrics Cards (شیشه‌ای و جمع‌وجور) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Metric 1: Workout Progress */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="rounded-2xl bg-white/70 dark:bg-[#07160e]/75 backdrop-blur-xl border border-emerald-500/15 dark:border-white/10 hover:border-emerald-500/40 p-4 shadow-lg shadow-emerald-950/15 flex flex-col justify-between space-y-3 h-full transition-all"
        >
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <Dumbbell className="h-4 w-4 text-emerald-500" />
              <span>پیشرفت تمرینات</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">{workoutPercent}٪</span>
          </div>

          {!activeProgram ? (
            <div className="py-2 text-center space-y-2">
              <p className="text-[11px] text-muted-foreground font-semibold">هنوز برنامه‌ای فعال نشده</p>
              <Button
                type="button"
                variant="primary"
                onClick={() => navigate('/practice')}
                className="w-full h-8 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
              >
                دریافت برنامه
              </Button>
            </div>
          ) : (
            <>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  style={{ width: `${workoutPercent}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-lime-300 transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                />
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground flex justify-between">
                <span>{completedSessionsCount} از {totalSessionsCount} جلسه</span>
                <span className="text-emerald-500 font-bold">کامل شد</span>
              </div>
            </>
          )}
        </motion.div>

        {/* Metric 2: Calorie Intake */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="rounded-2xl bg-white/70 dark:bg-[#07160e]/75 backdrop-blur-xl border border-emerald-500/15 dark:border-white/10 hover:border-amber-500/40 p-4 shadow-lg shadow-emerald-950/15 flex flex-col justify-between space-y-3 h-full transition-all"
        >
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <Apple className="h-4 w-4 text-amber-500" />
              <span>کالری سوخت</span>
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-black">{calPercent}٪</span>
          </div>

          {!activeProgram && consumedNutrition.calories === 0 ? (
            <div className="py-2 text-center space-y-2">
              <p className="text-[11px] text-muted-foreground font-semibold">برنامه غذایی ثبت نشده</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/practice')}
                className="w-full h-8 text-xs font-black border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-xl cursor-pointer"
              >
                دریافت برنامه
              </Button>
            </div>
          ) : (
            <>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  style={{ width: `${calPercent}%` }}
                  className="h-full rounded-full bg-amber-500 transition-all duration-300"
                />
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground flex justify-between">
                <span>{consumedNutrition.calories} kcal</span>
                <span>از {nutritionTarget.calories}</span>
              </div>
            </>
          )}
        </motion.div>

        {/* Metric 3: Protein Intake */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="rounded-2xl bg-white/70 dark:bg-[#07160e]/75 backdrop-blur-xl border border-emerald-500/15 dark:border-white/10 hover:border-emerald-500/40 p-4 shadow-lg shadow-emerald-950/15 flex flex-col justify-between space-y-3 h-full transition-all"
        >
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <Apple className="h-4 w-4 text-emerald-500" />
              <span>پروتئین عضلانی</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">{proteinPercent}٪</span>
          </div>

          {!activeProgram && consumedNutrition.protein === 0 ? (
            <div className="py-2 text-center space-y-2">
              <p className="text-[11px] text-muted-foreground font-semibold">محاسبه بر اساس برنامه</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/practice')}
                className="w-full h-8 text-xs font-black border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 rounded-xl cursor-pointer"
              >
                دریافت برنامه
              </Button>
            </div>
          ) : (
            <>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  style={{ width: `${proteinPercent}%` }}
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                />
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground flex justify-between">
                <span>{consumedNutrition.protein}g</span>
                <span>از {nutritionTarget.protein}g</span>
              </div>
            </>
          )}
        </motion.div>

        {/* Metric 4: Water Hydration */}
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
          className="rounded-2xl bg-white/70 dark:bg-[#07160e]/75 backdrop-blur-xl border border-emerald-500/15 dark:border-white/10 hover:border-sky-500/40 p-4 shadow-lg shadow-emerald-950/15 flex flex-col justify-between space-y-3 h-full transition-all"
        >
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <Droplets className="h-4 w-4 text-sky-500" />
              <span>مصرف آب روزانه</span>
            </span>
            <div className="flex items-center gap-1">
              {waterGlasses > 0 && (
                <button
                  type="button"
                  onClick={() => setWaterGlasses(0)}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground hover:text-foreground font-bold transition-colors cursor-pointer"
                  title="ریست مصرف آب"
                >
                  صفر
                </button>
              )}
              <button
                type="button"
                onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-black hover:bg-sky-500/20 cursor-pointer"
              >
                -۱
              </button>
              <button
                type="button"
                onClick={() => setWaterGlasses((prev) => Math.min(20, prev + 1))}
                className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-black hover:bg-sky-500/20 cursor-pointer"
              >
                +۱
              </button>
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              style={{ width: `${waterPercent}%` }}
              className="h-full rounded-full bg-sky-500 transition-all duration-300"
            />
          </div>
          <div className="text-[11px] font-semibold text-muted-foreground flex justify-between items-center">
            <span className="font-bold text-foreground">{waterGlasses} لیوان</span>
            <span className="text-muted-foreground">از ۸ لیوان ({waterPercent}٪)</span>
          </div>

          <div className="flex items-center gap-1 pt-0.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < waterGlasses ? 'bg-sky-500 shadow-xs' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* 3. Smooth Attractive Linear Curve Performance Chart (Real API Data) */}
      <LinearPerformanceChart
        data={weeklyPerformanceData}
        hasActiveProgram={Boolean(activeProgram)}
        onGetProgram={() => navigate('/practice')}
      />

      {/* 4. Unified Daily Action Card (تمرین و تغذیه در یک کارت جمع‌وجور بدون اسکرول) */}
      <div className="w-full rounded-3xl bg-white/70 dark:bg-[#07160e]/80 backdrop-blur-2xl border border-emerald-500/20 dark:border-white/10 p-4 sm:p-5 shadow-2xl shadow-emerald-950/20 space-y-3">
        {/* Top Header with Tab Switcher */}
        <div className="flex items-center justify-between pb-2 border-b border-border/50 gap-2">
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100/80 dark:bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                setDailyTab('training');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                dailyTab === 'training'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Dumbbell className="h-3.5 w-3.5" />
              <span>تمرینات امروز</span>
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                setDailyTab('nutrition');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                dailyTab === 'nutrition'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Apple className="h-3.5 w-3.5" />
              <span>وعده‌های غذایی</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/practice')}
            className="text-xs text-primary font-bold hover:underline flex items-center shrink-0 cursor-pointer"
          >
            <span>برنامه کامل</span>
            <ChevronLeft className="h-3 w-3" />
          </button>
        </div>

        {/* Tab 1: Training Content */}
        {dailyTab === 'training' && (
          <div className="space-y-2.5">
            {!activeProgram ? (
              <div className="py-5 text-center space-y-2 bg-muted/20 rounded-2xl border border-dashed border-border/70 p-3">
                <Dumbbell className="h-6 w-6 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-muted-foreground">
                  هنوز برنامه تمرینی فعال نکرده‌اید
                </p>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => navigate('/practice')}
                  className="bg-primary text-primary-foreground font-black text-xs px-4 h-8 rounded-xl shadow-xs cursor-pointer"
                >
                  دریافت برنامه
                </Button>
              </div>
            ) : (
              <>
                {/* Date Navigation Bar */}
                <div className="flex items-center justify-between p-1.5 rounded-xl bg-muted/30 border border-border/50 text-xs select-none">
                  <button
                    type="button"
                    onClick={handleTrainingPrevDay}
                    className="p-1 rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{formattedTrainingPersianDate}</span>
                    {isTrainingToday ? (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                        امروز
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleTrainingGoToday}
                        className="text-[10px] text-primary hover:underline font-black cursor-pointer"
                      >
                        امروز
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleTrainingNextDay}
                    className="p-1 rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {trainingSessions.length === 0 ? (
                    <div className="text-center py-3 text-xs text-muted-foreground">جلسه تمرینی برای این تاریخ ثبت نشده است.</div>
                  ) : (
                    <AnimatePresence>
                      {trainingSessions.slice(0, 3).map((s) => (
                        <motion.div
                          key={s.id}
                          whileHover={{ scale: 1.01, x: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleToggleSession(s.dayName)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                            s.completed
                              ? 'bg-emerald-500/[0.05] border-emerald-500/30'
                              : 'bg-muted/40 hover:bg-muted/80 border-border/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {s.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className={`text-xs font-bold line-clamp-1 ${s.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {s.title}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <span className="font-bold text-primary">{s.dayName}</span>
                                <span>•</span>
                                <span>{s.durationMinutes} دقیقه</span>
                                <span>•</span>
                                <span className="line-clamp-1">{s.focus}</span>
                              </div>
                            </div>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${s.completed ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                            {s.completed ? 'انجام شد' : `${s.drillsCount} حرکت`}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Nutrition Content */}
        {dailyTab === 'nutrition' && (
          <div className="space-y-2.5">
            {loggedMeals.length === 0 ? (
              <div className="py-5 text-center space-y-2 bg-muted/20 rounded-2xl border border-dashed border-border/70 p-3">
                <Apple className="h-6 w-6 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-muted-foreground">
                  برنامه غذایی امروز ثبت نشده است
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/practice')}
                  className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-black text-xs px-4 h-8 rounded-xl shadow-xs cursor-pointer"
                >
                  دریافت برنامه غذایی
                </Button>
              </div>
            ) : (
              <>
                {/* Date Navigation Bar */}
                <div className="flex items-center justify-between p-1.5 rounded-xl bg-muted/30 border border-border/50 text-xs select-none">
                  <button
                    type="button"
                    onClick={handleNutritionPrevDay}
                    className="p-1 rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{formattedNutritionPersianDate}</span>
                    {isNutritionToday ? (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                        امروز
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNutritionGoToday}
                        className="text-[10px] text-emerald-500 hover:underline font-black cursor-pointer"
                      >
                        امروز
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNutritionNextDay}
                    className="p-1 rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <AnimatePresence>
                    {loggedMeals.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleToggleMeal(m.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          m.isCompleted
                            ? 'bg-emerald-500/[0.04] border-emerald-500/25'
                            : 'bg-muted/40 hover:bg-muted/80 border-border/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {m.isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className={`text-xs font-bold line-clamp-1 ${m.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {m.name}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {getMealTypeLabel(m.mealType)}
                              </span>
                              <span>•</span>
                              <span>{m.calories} kcal</span>
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${m.isCompleted ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                          {m.isCompleted ? 'مصرف شد' : m.portion || 'یک وعده'}
                        </span>
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 5. Minimal Coach Tactial Note Pill */}
      <div className="px-4 py-2.5 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground line-clamp-1">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>
            <strong className="text-foreground">نکته تاکتیکی مربی:</strong> در زمان بازپس‌گیری توپ، سریعاً خطوط پاس روبه‌جلو را شناسایی و باز کنید.
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/tactics')}
          className="text-primary font-bold hover:underline shrink-0 text-[11px]"
        >
          آنالیز تخته
        </button>
      </div>

      {/* Dedicated Safe Empty Spacer so bottom floating LiquidGlassNav never overlaps */}
      <div className="h-28 sm:h-36 w-full pointer-events-none" aria-hidden="true" />

      {/* AI Assistant Modal */}
      <AiCoachModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        readinessScore={readinessScore}
        readinessLabel={readinessMeta.label}
        workoutPercent={workoutPercent}
        waterGlasses={waterGlasses}
        caloriesConsumed={consumedNutrition.calories}
        playerName={playerName}
      />
    </div>
  );
};

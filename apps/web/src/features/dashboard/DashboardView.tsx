import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  CheckCircle2,
  Circle,
  Dumbbell,
  Apple,
  Droplets,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Bot,
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

  const [isLoading, setIsLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

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

  // Persian date format
  const todayPersianFormatted = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(new Date());
    } catch {
      return 'امروز';
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
      const nutRes = await fetch(`http://localhost:4000/nutrition/daily-log?date=${dateKeyStr}`);
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
            const presetsRes = await fetch('http://localhost:4000/nutrition/preset-plans');
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
        const progRes = await fetch('http://localhost:4000/programs');
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
      const perfRes = await fetch('http://localhost:4000/programs/weekly-performance');
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
        const res = await fetch(`http://localhost:4000/programs/${activeProgram.id}/session-toggle`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weekNumber: 1, dayName }),
        });
        await fetch('http://localhost:4000/programs/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProgram),
        }).catch(() => {});

        if (res.ok) {
          fetch('http://localhost:4000/programs/weekly-performance')
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
      await fetch(`http://localhost:4000/nutrition/toggle-item/${mealId}?date=${nutritionDateKey}`, {
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
    <div className="space-y-6 max-w-5xl mx-auto pb-40 sm:pb-48 select-none animate-in fade-in duration-300">
      {/* 1. Ultra Clean Header (No streak badge, no winger/number, no duplicate tactics button) */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <span>پنل اختصاصی عملکرد بازیکن</span>
            <span>•</span>
            <span className="text-foreground font-semibold flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{todayPersianFormatted}</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {playerName}
          </h1>
        </div>

        {/* Real Readiness Score Indicator & AI Coach Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-violet-500/10 hover:from-purple-500/20 hover:to-violet-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 shadow-xs text-xs font-black transition-all group cursor-pointer"
            title="گفتگو با دستیار هوش مصنوعی فرست تاچ"
          >
            <div className="w-5 h-5 rounded-lg bg-purple-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <span>دستیار هوش مصنوعی</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border shadow-sm text-xs font-bold transition-all ${readinessMeta.bgClass}`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${readinessMeta.dotClass}`} />
            <span className="text-muted-foreground">شاخص آمادگی:</span>
            <span className={`font-black text-sm ${readinessMeta.colorClass}`}>
              {readinessScore}٪ ({readinessMeta.label})
            </span>
          </div>
        </div>
      </div>

      {/* 2. Real Metrics Linear Progress Bars (Computed from API) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: Workout Progress */}
        <div className="rounded-2xl bg-card border border-border/80 p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <Dumbbell className="h-3.5 w-3.5 text-purple-500" />
              <span>پیشرفت تمرینات</span>
            </span>
            <span>{workoutPercent}٪</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              style={{ width: `${workoutPercent}%` }}
              className="h-full rounded-full bg-purple-500 transition-all duration-300"
            />
          </div>
          <div className="text-[11px] font-semibold text-muted-foreground flex justify-between">
            <span>
              {completedSessionsCount} از {totalSessionsCount} جلسه
            </span>
            <span className="text-purple-500 font-bold">کامل شد</span>
          </div>
        </div>

        {/* Metric 2: Calorie Intake */}
        <div className="rounded-2xl bg-card border border-border/80 p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <Apple className="h-3.5 w-3.5 text-amber-500" />
              <span>کالری سوخت</span>
            </span>
            <span>{calPercent}٪</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              style={{ width: `${calPercent}%` }}
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
            />
          </div>
          <div className="text-[11px] font-semibold text-muted-foreground flex justify-between">
            <span>{consumedNutrition.calories} kcal</span>
            <span className="text-muted-foreground">از {nutritionTarget.calories}</span>
          </div>
        </div>

        {/* Metric 3: Protein Intake */}
        <div className="rounded-2xl bg-card border border-border/80 p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <Apple className="h-3.5 w-3.5 text-emerald-500" />
              <span>پروتئین عضلانی</span>
            </span>
            <span>{proteinPercent}٪</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              style={{ width: `${proteinPercent}%` }}
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            />
          </div>
          <div className="text-[11px] font-semibold text-muted-foreground flex justify-between">
            <span>{consumedNutrition.protein}g</span>
            <span className="text-muted-foreground">از {nutritionTarget.protein}g</span>
          </div>
        </div>

        {/* Metric 4: Water Hydration (Calculated in glasses - NO English letters) */}
        <div className="rounded-2xl bg-card border border-border/80 p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground">
              <Droplets className="h-3.5 w-3.5 text-sky-500" />
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
                title="کاهش یک لیوان آب"
              >
                -۱ لیوان
              </button>
              <button
                type="button"
                onClick={() => setWaterGlasses((prev) => Math.min(20, prev + 1))}
                className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-black hover:bg-sky-500/20 cursor-pointer"
                title="ثبت یک لیوان آب"
              >
                +۱ لیوان
              </button>
              <button
                type="button"
                onClick={() => setWaterGlasses((prev) => Math.min(20, prev + 2))}
                className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-700 dark:text-sky-300 font-black hover:bg-sky-500/30 cursor-pointer"
                title="ثبت دو لیوان آب"
              >
                +۲ لیوان
              </button>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              style={{ width: `${waterPercent}%` }}
              className="h-full rounded-full bg-sky-500 transition-all duration-300"
            />
          </div>
          <div className="text-[11px] font-semibold text-muted-foreground flex justify-between items-center">
            <span className="font-bold text-foreground">{waterGlasses} لیوان</span>
            <span className="text-muted-foreground">از حداقل ۸ لیوان ({waterPercent}٪)</span>
          </div>

          {/* 8 mini glass indicators */}
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
        </div>
      </div>

      {/* 2.5. AI Assistant Interactive Showcase Card */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-500/[0.08] via-indigo-500/[0.08] to-violet-500/[0.08] dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-violet-950/30 border border-purple-500/25 p-4 sm:p-5 shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25 shrink-0">
              <Bot className="h-6 w-6" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-foreground">
                  دستیار مربی هوش مصنوعی (FirstTouch AI)
                </h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  آنلاین
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-semibold leading-relaxed line-clamp-1 sm:line-clamp-none">
                تحلیل وضعیت بدنی، راهکارهای افزایش لمس اول و تغذیه مسابقاتی با هوش مصنوعی
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="rounded-2xl text-xs font-black gap-2 h-9 sm:h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>شروع گفتگو با دستیار</span>
          </Button>
        </div>
      </div>

      {/* 3. Smooth Attractive Linear Curve Performance Chart (Real API Data) */}
      <LinearPerformanceChart data={weeklyPerformanceData} />

      {/* 4. Dual Action Plan: Real Training Programs & Real Registered Meals (Max 3 Items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Right Column: Training Program with Live Persian Calendar & Max 3 Sessions */}
        <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-purple-500" />
                <h3 className="text-sm font-black text-foreground">برنامه تمرینات تخصصی</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                  {trainingSessions.filter((s) => s.completed).length}/{trainingSessions.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3 text-purple-500" />
                <span>{formattedTrainingPersianDate}</span>
                {activeProgram?.title && (
                  <>
                    <span>•</span>
                    <span className="line-clamp-1">{activeProgram.title}</span>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/practice')}
              className="text-xs text-primary font-bold hover:underline flex items-center shrink-0"
            >
              <span>تقویم تمرین</span>
              <ChevronLeft className="h-3 w-3" />
            </button>
          </div>

          {/* Training Calendar Date Navigation Bar */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-muted/30 border border-border/60 text-xs select-none">
            <button
              type="button"
              onClick={handleTrainingPrevDay}
              className="p-1.5 rounded-xl bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-colors"
              title="روز قبل"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-1.5 font-bold">
              <Calendar className="h-3.5 w-3.5 text-purple-500" />
              <span className="text-foreground">{formattedTrainingPersianDate}</span>
              {isTrainingToday ? (
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                  امروز
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleTrainingGoToday}
                  className="px-1.5 py-0.2 rounded-md bg-primary/10 text-primary text-[10px] font-black hover:bg-primary/20"
                >
                  برو به امروز
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleTrainingNextDay}
              className="p-1.5 rounded-xl bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-colors"
              title="روز بعد"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-6 text-xs text-muted-foreground">در حال بارگذاری تمرینات...</div>
            ) : trainingSessions.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">جلسه تمرینی ثبت نشده است.</div>
            ) : (
              <AnimatePresence>
                {trainingSessions.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleToggleSession(s.dayName)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      s.completed
                        ? 'bg-purple-500/[0.04] border-purple-500/25'
                        : 'bg-muted/40 hover:bg-muted/80 border-border/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                      >
                        {s.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-purple-500 stroke-[2.5]" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/60 stroke-[1.8]" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold line-clamp-1 transition-colors ${
                            s.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {s.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          <span className="font-bold text-primary">{s.dayName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            <span>{s.durationMinutes} دقیقه</span>
                          </span>
                          <span>•</span>
                          <span className="line-clamp-1">{s.focus}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        s.completed
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {s.completed ? 'انجام شد' : `${s.drillsCount} حرکت`}
                    </span>
                  </div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Button to view full workouts list */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/practice')}
            className="w-full text-xs font-bold gap-1.5 h-9 rounded-2xl bg-muted/40 hover:bg-muted text-foreground border-border/70"
          >
            <span>مشاهده کامل در بخش تمرینات</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Left Column: Registered Nutrition Meals with Live Persian Calendar Bar (Max 3 Items) */}
        <div className="rounded-3xl bg-card border border-border/80 p-5 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Apple className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-black text-foreground">وعده‌های ثبتی تغذیه</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  {loggedMeals.filter((m) => m.isCompleted).length}/{loggedMeals.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3 text-emerald-500" />
                <span>{formattedNutritionPersianDate}</span>
                <span>•</span>
                <span>{consumedNutrition.calories} کالری مصرفی</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/practice')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center shrink-0"
            >
              <span>کالری‌شمار</span>
              <ChevronLeft className="h-3 w-3" />
            </button>
          </div>

          {/* Nutrition Calendar Date Navigation Bar (CALENDAR FOR MEALS!) */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-muted/30 border border-border/60 text-xs select-none">
            <button
              type="button"
              onClick={handleNutritionPrevDay}
              className="p-1.5 rounded-xl bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-colors cursor-pointer"
              title="روز قبل"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-1.5 font-bold">
              <Calendar className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-foreground">{formattedNutritionPersianDate}</span>
              {isNutritionToday ? (
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                  امروز
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleNutritionGoToday}
                  className="px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black hover:bg-emerald-500/20 cursor-pointer"
                >
                  برو به امروز
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleNutritionNextDay}
              className="p-1.5 rounded-xl bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50 transition-colors cursor-pointer"
              title="روز بعد"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <div className="text-center py-6 text-xs text-muted-foreground">در حال بارگذاری وعده‌ها...</div>
            ) : loggedMeals.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">وعده غذایی برای امروز ثبت نشده است.</div>
            ) : (
              <AnimatePresence>
                {loggedMeals.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMeal(m.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      m.isCompleted
                        ? 'bg-emerald-500/[0.04] border-emerald-500/25'
                        : 'bg-muted/40 hover:bg-muted/80 border-border/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                      >
                        {m.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 stroke-[2.5]" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/60 stroke-[1.8]" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold line-clamp-1 transition-colors ${
                            m.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {m.name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {getMealTypeLabel(m.mealType)}
                          </span>
                          <span>•</span>
                          <span>{m.calories} kcal</span>
                          <span>•</span>
                          <span>{m.protein}g پروتئین</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        m.isCompleted
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {m.isCompleted ? 'مصرف شد' : 'تیک مصرف'}
                    </span>
                  </div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Button to view full nutrition list */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/practice')}
            className="w-full text-xs font-bold gap-1.5 h-9 rounded-2xl bg-muted/40 hover:bg-muted text-foreground border-border/70"
          >
            <span>مشاهده کامل در بخش تمرینات</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
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

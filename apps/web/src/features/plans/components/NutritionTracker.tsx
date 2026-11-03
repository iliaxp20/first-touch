import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Apple,
  Plus,
  Minus,
  Search,
  Trash2,
  X,
  Edit2,
  Check,
  CheckCircle2,
  Circle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Scale,
  Target,
  Sparkles,
} from 'lucide-react';

export interface FoodCalorieItem {
  id: string;
  name: string;
  category: string;
  portion: string;
  unitName?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  searchTerms?: string[];
  isCustom?: boolean;
}

export interface LoggedFoodItem {
  id: string;
  foodId?: string;
  name: string;
  portion: string;
  count: number;
  unitName?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  loggedAt: string;
  isPlannedItem?: boolean;
  isCompleted?: boolean;
  isCustom?: boolean;
}

export interface DailyNutritionTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  planTitle?: string;
  planType?: 'none' | 'free' | 'ready' | 'coach';
  currentWeight?: number;
  targetWeight?: number;
  weightGoal?: 'lose' | 'maintain' | 'gain';
}

export interface PresetNutritionPlan {
  id: string;
  title: string;
  type: 'free' | 'ready' | 'coach';
  typeLabel: string;
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
}

export interface DailyLogSummary {
  date: string;
  target: DailyNutritionTarget;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  remainingCalories: number;
  caloriesProgressPct: number;
  proteinProgressPct: number;
  meals: {
    breakfast: LoggedFoodItem[];
    lunch: LoggedFoodItem[];
    dinner: LoggedFoodItem[];
    snack: LoggedFoodItem[];
  };
}

const MEALS: {
  key: keyof DailyLogSummary['meals'];
  title: string;
  icon: string;
}[] = [
  { key: 'breakfast', title: 'صبحانه', icon: '🥐' },
  { key: 'lunch', title: 'ناهار', icon: '🍲' },
  { key: 'dinner', title: 'شام', icon: '🥩' },
  { key: 'snack', title: 'میان‌وعده', icon: '🍏' },
];

export const NutritionTracker: React.FC = () => {
  const [dailyLog, setDailyLog] = useState<DailyLogSummary | null>(null);
  const [foods, setFoods] = useState<FoodCalorieItem[]>([]);
  const [presetPlans, setPresetPlans] = useState<PresetNutritionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Persian Calendar State (تقویم شمسی با ریست روزانه)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateKey = useMemo(() => selectedDate.toISOString().split('T')[0], [selectedDate]);
  const isToday = useMemo(() => new Date().toDateString() === selectedDate.toDateString(), [selectedDate]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<keyof DailyLogSummary['meals']>('breakfast');
  const [modalTab, setModalTab] = useState<'picker' | 'manual'>('picker');

  // Search & Picker State (Count-based: تعدادی)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [selectedFood, setSelectedFood] = useState<FoodCalorieItem | null>(null);
  const [itemCount, setItemCount] = useState<number>(1);

  // Manual Entry Form
  const [manualForm, setManualForm] = useState({
    name: '',
    calories: '',
    protein: '',
    count: 1,
    unitName: 'عدد',
  });

  // Target & Custom Plan Form State
  const [targetForm, setTargetForm] = useState<DailyNutritionTarget>({
    calories: 2200,
    protein: 130,
    carbs: 260,
    fat: 60,
    currentWeight: 72,
    targetWeight: 75,
    weightGoal: 'maintain',
  });

  // Smart Protein State (محاسبه پروتئین هوشمند بر اساس وزن بدن)
  const [isSmartProtein, setIsSmartProtein] = useState<boolean>(true);
  const [proteinMultiplier, setProteinMultiplier] = useState<number>(1.8);

  // Floating notification toast
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const calculateSmartProtein = (weight: number, multiplier: number) => {
    return Math.round((weight || 70) * multiplier);
  };

  // Native Persian Date Formatter
  const formattedPersianDate = useMemo(() => {
    try {
      const dayName = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long' }).format(selectedDate);
      const dayNum = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric' }).format(selectedDate);
      const monthName = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'long' }).format(selectedDate);
      const yearNum = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(selectedDate);
      return `${dayName}، ${dayNum} ${monthName} ${yearNum}`;
    } catch {
      return selectedDate.toLocaleDateString('fa-IR');
    }
  }, [selectedDate]);

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleGoToday = () => {
    setSelectedDate(new Date());
  };

  // Fetch real data from API for active dateKey
  const fetchDailyLog = async (dateStr = dateKey) => {
    try {
      const res = await fetch(`http://localhost:4000/nutrition/daily-log?date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setDailyLog(data);
        if (data.target) {
          setTargetForm((prev) => ({
            ...prev,
            ...data.target,
            calories: data.target.calories || prev.calories || 2200,
            protein: data.target.protein || prev.protein || 120,
            carbs: data.target.carbs || prev.carbs || 260,
            fat: data.target.fat || prev.fat || 60,
          }));
        }
      }
    } catch {
      // Handled
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await fetch('http://localhost:4000/nutrition/foods');
      if (res.ok) {
        const data = await res.json();
        setFoods(data);
      }
    } catch {
      // Handled
    }
  };

  const fetchPresetPlans = async () => {
    try {
      const res = await fetch('http://localhost:4000/nutrition/preset-plans');
      if (res.ok) {
        const data = await res.json();
        setPresetPlans(data);
      }
    } catch {
      // Handled
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchDailyLog(dateKey), fetchFoods(), fetchPresetPlans()]);
      setLoading(false);
    };
    init();
  }, [dateKey]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    foods.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return ['همه', ...Array.from(set)];
  }, [foods]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'همه': foods.length };
    foods.forEach((f) => {
      if (f.category) {
        counts[f.category] = (counts[f.category] || 0) + 1;
      }
    });
    return counts;
  }, [foods]);

  // Infinite scroll limit
  const [visibleLimit, setVisibleLimit] = useState<number>(100);

  // Filter foods for picker across all 800 items
  const filteredFoods = useMemo(() => {
    let list = foods;
    if (selectedCategory && selectedCategory !== 'همه') {
      list = list.filter((f) => f.category === selectedCategory);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.trim().toLowerCase();
    return list.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        (f.searchTerms && f.searchTerms.some((t) => t.toLowerCase().includes(q)))
    );
  }, [foods, searchQuery, selectedCategory]);

  useEffect(() => {
    setVisibleLimit(100);
  }, [searchQuery, selectedCategory]);

  const displayedFoods = useMemo(() => {
    return filteredFoods.slice(0, visibleLimit);
  }, [filteredFoods, visibleLimit]);

  // Open modal for a specific meal
  const handleOpenAdd = (mealKey: keyof DailyLogSummary['meals']) => {
    setSelectedMeal(mealKey);
    setSelectedFood(null);
    setSearchQuery('');
    setSelectedCategory('همه');
    setItemCount(1);
    setModalTab('picker');
    setIsAddModalOpen(true);
  };

  // Add from food list with integer count
  const handleConfirmSelectFood = async () => {
    if (!selectedFood) return;
    try {
      const res = await fetch('http://localhost:4000/nutrition/log-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealType: selectedMeal,
          foodId: selectedFood.id,
          count: itemCount,
          date: dateKey,
          isCompleted: false, // Starts unchecked with [○] beside it!
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setDailyLog(updated);
        setIsAddModalOpen(false);
      }
    } catch {
      // Handled
    }
  };

  // Add manual food
  const handleConfirmManualFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.name || !manualForm.calories) return;

    try {
      const singleCal = Number(manualForm.calories);
      const singleProt = Number(manualForm.protein) || 0;
      const count = Math.max(1, manualForm.count);

      const res = await fetch('http://localhost:4000/nutrition/log-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealType: selectedMeal,
          count: count,
          date: dateKey,
          isCompleted: false, // Starts unchecked with [○] beside it!
          customFood: {
            name: manualForm.name.trim(),
            portion: `۱ ${manualForm.unitName || 'عدد'}`,
            unitName: manualForm.unitName || 'عدد',
            calories: singleCal,
            protein: singleProt,
            carbs: 0,
            fat: 0,
          },
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setDailyLog(updated);
        setIsAddModalOpen(false);
        setManualForm({ name: '', calories: '', protein: '', count: 1, unitName: 'عدد' });
      }
    } catch {
      // Handled
    }
  };

  // Toggle checklist item (قابلیت تیک زدن کنار هر غذا)
  const handleToggleItem = async (itemId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/nutrition/toggle-item/${itemId}?date=${dateKey}`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const updated = await res.json();
        setDailyLog(updated);
      }
    } catch {
      // Handled
    }
  };

  // Edit item count inline (+ / -)
  const handleUpdateItemCount = async (itemId: string, newCount: number) => {
    if (newCount < 1) return;
    try {
      const res = await fetch(`http://localhost:4000/nutrition/update-count/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: newCount, date: dateKey }),
      });
      if (res.ok) {
        const updated = await res.json();
        setDailyLog(updated);
      }
    } catch {
      // Handled
    }
  };

  // Delete logged item
  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/nutrition/log-food/${id}?date=${dateKey}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const updated = await res.json();
        setDailyLog(updated);
      }
    } catch {
      // Handled
    }
  };

  // Apply a preset nutrition plan (رایگان، آماده یا مربی اختصاصی)
  const handleApplyPresetPlan = async (planId: string) => {
    const selectedPreset = presetPlans.find((p) => p.id === planId);

    // Immediate reactive update so the UI never blocks
    if (selectedPreset) {
      const newTarget: DailyNutritionTarget = {
        calories: selectedPreset.dailyCalories,
        protein: selectedPreset.protein,
        carbs: selectedPreset.carbs,
        fat: selectedPreset.fat,
        planTitle: selectedPreset.title,
        planType: selectedPreset.type,
        currentWeight: targetForm.currentWeight,
        targetWeight: targetForm.targetWeight,
        weightGoal: targetForm.weightGoal,
      };

      setTargetForm(newTarget);
      setDailyLog((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          target: newTarget,
          remainingCalories: Math.max(0, newTarget.calories - prev.totalCalories),
        };
      });

      try {
        localStorage.setItem('first_touch_nutrition_target', JSON.stringify(newTarget));
      } catch {
        // Ignored
      }

      showToast(`برنامه غذایی «${selectedPreset.title}» با موفقیت فعال شد.`);
      setIsPlanModalOpen(false);
    }

    try {
      const res = await fetch('http://localhost:4000/nutrition/apply-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, date: dateKey }),
      });
      if (res.ok) {
        const updated = await res.json();
        setDailyLog(updated);
        if (updated.target) setTargetForm((prev) => ({ ...prev, ...updated.target }));
      }
    } catch {
      // Handled via local fallback
    }
  };

  // Reset / Clear active plan
  const handleResetPlan = async () => {
    try {
      const res = await fetch('http://localhost:4000/nutrition/reset-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateKey }),
      });
      if (res.ok) {
        const updated = await res.json();
        setDailyLog(updated);
        if (updated.target) setTargetForm(updated.target);
      }
    } catch {
      // Handled
    }
  };

  // Save custom manual target (کالری هدف، وزن فعلی، وزن هدف)
  const handleSaveTarget = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalProtein = isSmartProtein
      ? calculateSmartProtein(targetForm.currentWeight || 70, proteinMultiplier)
      : targetForm.protein;

    const payload: DailyNutritionTarget = {
      ...targetForm,
      protein: finalProtein,
      planTitle: targetForm.planTitle || 'برنامه دستی اختصاصی',
      planType: 'ready',
    };

    // Immediate reactive local state update
    setTargetForm(payload);
    setDailyLog((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        target: payload,
        remainingCalories: Math.max(0, payload.calories - prev.totalCalories),
      };
    });

    try {
      localStorage.setItem('first_touch_nutrition_target', JSON.stringify(payload));
    } catch {
      // Ignored
    }

    showToast('کالری هدف و درشت‌مغذی‌ها با موفقیت ذخیره و فعال شد.');
    setIsTargetModalOpen(false);

    try {
      const res = await fetch('http://localhost:4000/nutrition/target', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchDailyLog(dateKey);
      }
    } catch {
      // Local state is already active and preserved
    }
  };

  if (loading && !dailyLog) {
    return (
      <div className="py-20 text-center text-xs font-bold text-slate-400">
        در حال بارگذاری اطلاعات تغذیه...
      </div>
    );
  }

  const target = dailyLog?.target || targetForm;
  const totalCalories = dailyLog?.totalCalories || 0;
  const remainingCalories = dailyLog?.remainingCalories ?? target.calories;
  const caloriesPct = dailyLog?.caloriesProgressPct || 0;
  const totalProtein = dailyLog?.totalProtein || 0;
  const totalCarbs = dailyLog?.totalCarbs || 0;
  const totalFat = dailyLog?.totalFat || 0;

  // Determine if a plan or any food item is currently active
  const totalItemsCount =
    (dailyLog?.meals.breakfast.length || 0) +
    (dailyLog?.meals.lunch.length || 0) +
    (dailyLog?.meals.dinner.length || 0) +
    (dailyLog?.meals.snack.length || 0);

  const hasActivePlan = Boolean(
    (target.planTitle && target.planTitle.trim().length > 0 && target.planType !== 'none') ||
    totalItemsCount > 0
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5 text-right select-none pb-28 sm:pb-36 relative">
      {/* Floating Success Notification Toast */}
      {notificationToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] px-4 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-purple-950/95 text-white border border-purple-500/40 shadow-xl flex items-center gap-2 text-xs font-black animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{notificationToast}</span>
        </div>
      )}
      {/* 1. PERSIAN CALENDAR HEADER BAR (تقویم شمسی با ناوبری و ریست روزانه) */}
      <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <button
          type="button"
          onClick={handleNextDay}
          className="h-8 w-8 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
          title="روز بعد"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-purple-600" />
          <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
            {formattedPersianDate}
          </span>
          {isToday ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              امروز
            </span>
          ) : (
            <button
              type="button"
              onClick={handleGoToday}
              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 cursor-pointer transition-colors"
            >
              برو به امروز
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handlePrevDay}
          className="h-8 w-8 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
          title="روز قبل"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* 2. TOP STATS BAR (ACTIVE WHEN PLAN OR TARGET IS SET) */}
      {hasActivePlan && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Apple className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900 dark:text-white">
                    پایش تغذیه روزانه
                  </h2>
                  {target.planTitle && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">
                      {target.planTitle}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  {target.targetWeight ? (
                    <span className="flex items-center gap-1 font-mono text-purple-600 dark:text-purple-400 font-bold">
                      <Scale className="h-3 w-3" />
                      وزن هدف: {target.targetWeight} کیلوگرم
                    </span>
                  ) : (
                    <span>تیک زدن وعده‌های خورده شده جهت محاسبه دقیق</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(true)}
                className="text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 cursor-pointer transition-colors"
              >
                <Apple className="h-3.5 w-3.5 text-purple-600" />
                <span>تعویض برنامه</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTargetModalOpen(true)}
                className="text-xs font-bold text-slate-600 hover:text-purple-600 dark:text-slate-300 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 cursor-pointer transition-colors"
                title="ویرایش کالری و وزن هدف"
              >
                <Edit2 className="h-3 w-3" />
                <span>هدف: {target.calories}</span>
              </button>

              <button
                type="button"
                onClick={handleResetPlan}
                className="text-xs font-bold text-slate-400 hover:text-rose-500 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 cursor-pointer transition-colors"
                title="حذف برنامه و بازگشت به حالت اولیه"
              >
                <RotateCcw className="h-3 w-3" />
                <span>حذف برنامه</span>
              </button>
            </div>
          </div>

          {/* Clean Numbers */}
          <div className="grid grid-cols-3 text-center py-2.5 border-y border-slate-100 dark:border-slate-800/80">
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">هدف روزانه</span>
              <span className="text-lg font-black text-slate-700 dark:text-slate-300 font-mono">
                {target.calories}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">مصرف‌شده (تیک‌خورده)</span>
              <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                {totalCalories}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">باقی‌مانده</span>
              <span
                className={`text-lg font-black font-mono ${
                  remainingCalories >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                }`}
              >
                {remainingCalories}
              </span>
            </div>
          </div>

          {/* Minimal Progress Bar */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  remainingCalories >= 0 ? 'bg-purple-600' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, caloriesPct)}%` }}
              />
            </div>
          </div>

          {/* 3 Clean Macros */}
          <div className="grid grid-cols-3 text-center text-xs pt-1">
            <div>
              <span className="text-[10px] text-slate-400 block">پروتئین</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">
                {totalProtein} <span className="text-[10px] text-slate-400 font-normal">/ {target.protein}g</span>
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">کربوهیدرات</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">
                {totalCarbs} <span className="text-[10px] text-slate-400 font-normal">/ {target.carbs}g</span>
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">چربی</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">
                {totalFat} <span className="text-[10px] text-slate-400 font-normal">/ {target.fat}g</span>
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* 3. INITIAL EMPTY STATE: NO EXTRA SHAPE / CARD BORDER (EXACTLY MATCHING TRAINING PLAN STYLE) */}
      {!hasActivePlan ? (
        <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center space-y-4 select-none">
          <div className="h-16 w-16 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shadow-sm">
            <Apple className="h-8 w-8" />
          </div>

          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              هنوز برنامه غذایی فعالی دریافت نکرده‌اید
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              برای شروع، برنامه غذایی آماده یا رایگان خود را انتخاب کنید یا هدف و کالری روزانه را به صورت دستی تنظیم نمایید.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlanModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <Apple className="h-4 w-4" />
              <span>دریافت برنامه غذایی</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTargetModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>تنظیم هدف و کالری دستی</span>
            </button>
          </div>
        </div>
      ) : (
        /* 4. MEAL CARDS (CHECKLIST WITH TICK BUTTON ON EVERY ITEM) */
        <div className="space-y-3">
          {MEALS.map((meal) => {
            const items = dailyLog?.meals[meal.key] || [];
            const mealEatenCalories = items
              .filter((i) => i.isCompleted)
              .reduce((acc, curr) => acc + curr.calories, 0);

            return (
              <div
                key={meal.key}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-2.5 transition-all"
              >
                {/* Row Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{meal.icon}</span>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white">
                      {meal.title}
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                      {mealEatenCalories > 0 ? `${mealEatenCalories} کالری خورده شده` : ''}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenAdd(meal.key)}
                    className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>افزودن</span>
                  </button>
                </div>

                {/* Items in this meal */}
                {items.length === 0 ? (
                  <p className="text-[11px] text-slate-400 font-medium pt-0.5">
                    هنوز موردی برای این وعده در برنامه نیست
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80 pt-1">
                    {items.map((item) => {
                      const isCompleted = !!item.isCompleted;

                      return (
                        <div
                          key={item.id}
                          className={`py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs transition-opacity border-b border-slate-100/70 dark:border-slate-800/40 last:border-b-0 ${
                            !isCompleted ? 'opacity-75' : 'opacity-100'
                          }`}
                        >
                          {/* CHECKBOX RIGHT BESIDE EVERY ITEM (قابلیت تیک زدن کنار هر غذا) */}
                          <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => handleToggleItem(item.id)}
                              className="shrink-0 mt-0.5 sm:mt-0 transition-transform active:scale-90 cursor-pointer"
                              title={isCompleted ? 'تیک خورده (کالری محاسبه شد)' : 'برای ثبت خوردن کلیک کنید'}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600 hover:text-emerald-500" />
                              )}
                            </button>

                            <div className="min-w-0 flex-1">
                              <span
                                className={`font-bold block text-slate-800 dark:text-slate-200 leading-snug break-words text-xs sm:text-sm ${
                                  isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                                }`}
                              >
                                {item.name}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {!isCompleted ? 'در برنامه • هنوز نخورده‌ام' : 'خورده شد'}
                              </span>
                            </div>
                          </div>

                          {/* Controls: Stepper, Calories & Delete */}
                          <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0 ps-7 sm:ps-0">
                            {/* Inline Count Stepper (تعدادی: + و -) */}
                            <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 px-2 py-1 rounded-xl">
                              <button
                                type="button"
                                onClick={() => handleUpdateItemCount(item.id, item.count - 1)}
                                className="h-5 w-5 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                title="کاهش تعداد"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-xs font-black font-mono text-slate-800 dark:text-slate-200 min-w-[20px] text-center">
                                {item.count}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {item.unitName || 'واحد'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateItemCount(item.id, item.count + 1)}
                                className="h-5 w-5 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                title="افزایش تعداد"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Calories & Delete */}
                            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                              <div className="text-left font-mono">
                                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                                  {item.calories} cal
                                </span>
                                <span className="text-[10px] text-rose-500 font-semibold block">
                                  {item.protein}g P
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteItem(item.id)}
                                className="h-7 w-7 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors cursor-pointer"
                                title="حذف"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Safe bottom spacer */}
      <div className="h-28 sm:h-36 w-full pointer-events-none select-none" aria-hidden="true" />

      {/* =========================================================================
          MODAL: PRESET NUTRITION PLANS (رایگان با تنوع غنی / آماده / مربی اختصاصی)
          ========================================================================= */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isPlanModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative z-10"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Apple className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          دریافت برنامه غذایی فوتبال
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          انتخاب از بین برنامه‌های پرانرژی رایگان، آماده یا مربی اختصاصی
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPlanModalOpen(false)}
                      className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto space-y-3 flex-1">
                    {presetPlans.map((plan) => {
                      const isActive = target.planTitle === plan.title;

                      return (
                        <div
                          key={plan.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isActive
                              ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30'
                              : 'border-slate-200/80 dark:border-slate-800 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                                  plan.type === 'free'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : plan.type === 'coach'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                                }`}
                              >
                                {plan.typeLabel}
                              </span>
                              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                {plan.title}
                              </h4>
                            </div>

                            <span className="text-xs font-black font-mono text-purple-600 dark:text-purple-400">
                              {plan.dailyCalories} کالری
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                            {plan.description}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="flex gap-3 text-[10px] font-mono text-slate-500">
                              <span>پروتئین: <strong className="text-rose-500">{plan.protein}g</strong></span>
                              <span>کربو: <strong className="text-slate-700 dark:text-slate-300">{plan.carbs}g</strong></span>
                              <span>چربی: <strong className="text-slate-700 dark:text-slate-300">{plan.fat}g</strong></span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleApplyPresetPlan(plan.id)}
                              disabled={isActive}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                              }`}
                            >
                              {isActive ? 'برنامه فعال شما' : 'اعمال این برنامه'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* =========================================================================
          MODAL: ADD FOOD (COUNT-BASED STEPPER & MANUAL)
          ========================================================================= */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isAddModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative z-10"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        افزودن غذا به {MEALS.find((m) => m.key === selectedMeal)?.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* 2 Clean Tabs */}
                  <div className="flex border-b border-slate-100 dark:border-slate-800 p-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setModalTab('picker')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        modalTab === 'picker'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      انتخاب از بانک جامع غذاها ({foods.length} غذا)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab('manual')}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        modalTab === 'manual'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      ثبت دستی غذا
                    </button>
                  </div>

                  {/* TAB 1: PICKER */}
                  {modalTab === 'picker' && (
                    <div className="flex flex-col flex-1 overflow-hidden">
                      {/* Search input */}
                      <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="جستجوی بین ۸۰۰ غذای ایرانی و ورزشی (قورمه، کباب، سنگک، فیله مرغ، تخم‌مرغ)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-9 pr-9 pl-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-purple-600"
                          />
                        </div>
                      </div>

                      {/* Category Pills with counts */}
                      <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto border-b border-slate-100 dark:border-slate-800 scrollbar-none shrink-0">
                        {categories.map((cat) => {
                          const count = cat === 'همه' ? foods.length : categoryCounts[cat] || 0;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                                selectedCategory === cat
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              <span>{cat}</span>
                              <span
                                className={`text-[9px] px-1 py-0.2 rounded-md ${
                                  selectedCategory === cat
                                    ? 'bg-purple-700/80 text-white'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                }`}
                              >
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Food list with Progressive Infinite Scroll */}
                      <div
                        onScroll={(e) => {
                          const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
                          if (scrollHeight - scrollTop - clientHeight < 250) {
                            setVisibleLimit((prev) => Math.min(prev + 100, filteredFoods.length));
                          }
                        }}
                        className="p-3 overflow-y-auto flex-1 space-y-1.5 max-h-72"
                      >
                        {displayedFoods.length === 0 ? (
                          <div className="text-center py-8 text-xs text-slate-400">
                            هیچ غذایی با این مشخصات یافت نشد
                          </div>
                        ) : (
                          displayedFoods.map((food) => {
                            const isSelected = selectedFood?.id === food.id;
                            return (
                              <div
                                key={food.id}
                                onClick={() => {
                                  setSelectedFood(food);
                                  setItemCount(1);
                                }}
                                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                                  isSelected
                                    ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 font-bold'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-purple-200'
                                }`}
                              >
                                <div className="min-w-0 flex-1 pl-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
                                      {food.name}
                                    </span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                                      {food.category}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">
                                    هر ۱ {food.unitName || 'واحد'} ({food.portion})
                                  </span>
                                </div>

                                <div className="text-left font-mono">
                                  <span className="font-black text-slate-900 dark:text-white block">
                                    {food.calories} cal
                                  </span>
                                  <span className="text-[10px] text-rose-500">
                                    {food.protein}g پروتئین
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}

                        {visibleLimit < filteredFoods.length && (
                          <button
                            type="button"
                            onClick={() =>
                              setVisibleLimit((prev) => Math.min(prev + 100, filteredFoods.length))
                            }
                            className="w-full py-2.5 text-center text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer border border-dashed border-purple-200 dark:border-purple-800"
                          >
                            نمایش موارد بیشتر (نمایش {displayedFoods.length} از {filteredFoods.length} غذا)
                          </button>
                        )}
                      </div>

                      {/* Count Stepper & Confirm (تعدادی نه سهمی) */}
                      {selectedFood && (
                        <div className="p-3 bg-purple-50/50 dark:bg-purple-950/30 border-t border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                              تعداد:
                            </span>
                            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-xl">
                              <button
                                type="button"
                                onClick={() => setItemCount(Math.max(1, itemCount - 1))}
                                className="h-5 w-5 rounded-md flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-xs font-black font-mono min-w-[20px] text-center">
                                {itemCount}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {selectedFood.unitName || 'عدد'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setItemCount(itemCount + 1)}
                                className="h-5 w-5 rounded-md flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleConfirmSelectFood}
                            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>ثبت در وعده ({Math.round(selectedFood.calories * itemCount)} کالری)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: MANUAL */}
                  {modalTab === 'manual' && (
                    <form onSubmit={handleConfirmManualFood} className="p-4 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          نام غذا
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="مثلاً: ساندویچ فیله مرغ خانگی"
                          value={manualForm.name}
                          onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                            کالری هر واحد (cal)
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="مثلاً: 350"
                            value={manualForm.calories}
                            onChange={(e) => setManualForm({ ...manualForm, calories: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none focus:border-purple-600"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-rose-500 block mb-1">
                            پروتئین (گرم)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="مثلاً: 25"
                            value={manualForm.protein}
                            onChange={(e) => setManualForm({ ...manualForm, protein: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none focus:border-purple-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                            تعداد
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={manualForm.count}
                            onChange={(e) =>
                              setManualForm({ ...manualForm, count: Math.max(1, Number(e.target.value)) })
                            }
                            className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                            واحد شمارش
                          </label>
                          <select
                            value={manualForm.unitName}
                            onChange={(e) => setManualForm({ ...manualForm, unitName: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                          >
                            <option value="عدد">عدد</option>
                            <option value="پرس">پرس</option>
                            <option value="کف دست">کف دست</option>
                            <option value="لیوان">لیوان</option>
                            <option value="کاسه">کاسه</option>
                            <option value="قاشق">قاشق</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddModalOpen(false)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                        >
                          انصراف
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-xs cursor-pointer"
                        >
                          ثبت غذا
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* =========================================================================
          MODAL: EDIT TARGET & MANUAL PLAN (انتخاب کالری هدف، وزن هدف و درشت‌مغذی‌ها)
          ========================================================================= */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isTargetModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4 relative z-10"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        تنظیم هدف و کالری دستی
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTargetModalOpen(false)}
                      className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveTarget} className="space-y-3.5">
                    {/* Goal Type Selector */}
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                        هدف اصلی بدنی
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'lose', label: 'کاهش چربی' },
                          { id: 'maintain', label: 'تثبیت وزن' },
                          { id: 'gain', label: 'عضله‌سازی' },
                        ].map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() =>
                              setTargetForm((prev) => ({
                                ...prev,
                                weightGoal: g.id as any,
                                calories: g.id === 'lose' ? 1900 : g.id === 'gain' ? 2500 : 2200,
                              }))
                            }
                            className={`py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                              targetForm.weightGoal === g.id
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Weight Inputs (Current Weight vs Target Weight) */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          وزن فعلی (kg)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="30"
                          max="150"
                          value={targetForm.currentWeight || ''}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTargetForm({
                              ...targetForm,
                              currentWeight: val,
                              protein: isSmartProtein ? calculateSmartProtein(val, proteinMultiplier) : targetForm.protein,
                            });
                          }}
                          className="w-full h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                          placeholder="مثلاً: 72"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-purple-600 dark:text-purple-400 block mb-1">
                          وزن هدف (kg)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          min="30"
                          max="150"
                          value={targetForm.targetWeight || ''}
                          onChange={(e) =>
                            setTargetForm({ ...targetForm, targetWeight: Number(e.target.value) })
                          }
                          className="w-full h-8 px-2.5 rounded-xl border border-purple-300 dark:border-purple-700 bg-purple-50/40 dark:bg-purple-950/30 text-xs font-mono font-black"
                          placeholder="مثلاً: 75"
                        />
                      </div>
                    </div>

                    {/* Target Calories Input */}
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                        کالری هدف روزانه (kcal)
                      </label>
                      <input
                        type="number"
                        required
                        min="1000"
                        max="5000"
                        value={targetForm.calories}
                        onChange={(e) => setTargetForm({ ...targetForm, calories: Number(e.target.value) })}
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-black font-mono focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    {/* Smart Protein (پروتئین هوشمند بر حسب وزن بدن) */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-50/90 via-indigo-50/50 to-purple-50/90 dark:from-purple-950/40 dark:via-slate-800/60 dark:to-purple-950/30 border border-purple-200/90 dark:border-purple-800/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-lg bg-purple-600/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                            <Sparkles className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight">
                              پروتئین هوشمند (بر حسب وزن بدن)
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              محاسبه خودکار بر پایه وزن بازیکن ({targetForm.currentWeight || 70} کیلوگرم)
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const next = !isSmartProtein;
                            setIsSmartProtein(next);
                            if (next) {
                              const calc = calculateSmartProtein(targetForm.currentWeight || 70, proteinMultiplier);
                              setTargetForm((prev) => ({ ...prev, protein: calc }));
                            }
                          }}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isSmartProtein ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              isSmartProtein ? 'translate-x-0' : '-translate-x-4'
                            }`}
                          />
                        </button>
                      </div>

                      {isSmartProtein && (
                        <div className="space-y-2 pt-1 border-t border-purple-100 dark:border-purple-900/30 animate-in fade-in">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 dark:text-slate-400 font-bold">انتخاب ضریب پروتئین:</span>
                            <span className="font-mono font-black text-purple-700 dark:text-purple-300">
                              {proteinMultiplier} گرم / کیلوگرم
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-1">
                            {[
                              { mult: 1.6, label: '۱.۶g', tip: 'سبک' },
                              { mult: 1.8, label: '۱.۸g', tip: 'فوتبال' },
                              { mult: 2.0, label: '۲.۰g', tip: 'عضله' },
                              { mult: 2.2, label: '۲.۲g', tip: 'حداکثر' },
                            ].map((item) => (
                              <button
                                key={item.mult}
                                type="button"
                                onClick={() => {
                                  setProteinMultiplier(item.mult);
                                  const calc = calculateSmartProtein(targetForm.currentWeight || 70, item.mult);
                                  setTargetForm((prev) => ({ ...prev, protein: calc }));
                                }}
                                className={`py-1 px-1 rounded-lg text-center transition-all cursor-pointer ${
                                  proteinMultiplier === item.mult
                                    ? 'bg-purple-600 text-white font-black shadow-xs'
                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:border-purple-300'
                                }`}
                              >
                                <div className="text-[10px] leading-tight font-mono">{item.label}</div>
                                <div className="text-[8px] opacity-75">{item.tip}</div>
                              </button>
                            ))}
                          </div>

                          <div className="p-1.5 rounded-lg bg-purple-100/70 dark:bg-purple-900/40 text-[10px] text-purple-900 dark:text-purple-200 font-bold text-center flex items-center justify-center gap-1">
                            <span>✨ پروتئین محاسبه شد:</span>
                            <span className="font-mono font-black text-xs text-purple-700 dark:text-purple-300">
                              {calculateSmartProtein(targetForm.currentWeight || 70, proteinMultiplier)} گرم
                            </span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">
                              ({targetForm.currentWeight || 70}kg × {proteinMultiplier})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Macros: Protein, Carbs, Fat */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-rose-500 block">
                            پروتئین (g)
                          </label>
                          {isSmartProtein && (
                            <span className="text-[8px] font-bold px-1 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                              هوشمند
                            </span>
                          )}
                        </div>
                        <input
                          type="number"
                          required
                          value={targetForm.protein}
                          onChange={(e) => {
                            setIsSmartProtein(false);
                            setTargetForm({ ...targetForm, protein: Number(e.target.value) });
                          }}
                          className={`w-full h-8 px-2 rounded-lg border text-xs font-mono font-bold ${
                            isSmartProtein
                              ? 'border-purple-400 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">
                          کربو (g)
                        </label>
                        <input
                          type="number"
                          required
                          value={targetForm.carbs}
                          onChange={(e) => setTargetForm({ ...targetForm, carbs: Number(e.target.value) })}
                          className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">
                          چربی (g)
                        </label>
                        <input
                          type="number"
                          required
                          value={targetForm.fat}
                          onChange={(e) => setTargetForm({ ...targetForm, fat: Number(e.target.value) })}
                          className="w-full h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsTargetModalOpen(false)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-xs cursor-pointer"
                      >
                        ذخیره و فعال‌سازی
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

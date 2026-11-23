import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Plus, Trash2, RotateCcw, Utensils, X, Droplets, Zap } from 'lucide-react';

interface ActiveNutritionPlanCardProps {
  activePlan: any;
  onOpenDetails: () => void;
}

export interface MealFoodItem {
  id: string;
  title: string;
  calories: number;
  protein?: number;
  completed: boolean;
}

export type MealSectionKey = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export const MEAL_SECTIONS: { key: MealSectionKey; title: string; defaultCalories: number }[] = [
  { key: 'breakfast', title: 'صبحانه', defaultCalories: 450 },
  { key: 'lunch', title: 'ناهار', defaultCalories: 650 },
  { key: 'snack', title: 'میان وعده', defaultCalories: 300 },
  { key: 'dinner', title: 'شام', defaultCalories: 500 },
];

export const ActiveNutritionPlanCard: React.FC<ActiveNutritionPlanCardProps> = ({
  activePlan,
  onOpenDetails,
}) => {
  const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  // Current selected day
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    try {
      const d = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(new Date());
      return weekDays.includes(d) ? d : 'شنبه';
    } catch {
      return 'شنبه';
    }
  });

  // Modal Dialog state for adding food
  const [activeModalMeal, setActiveModalMeal] = useState<MealSectionKey | null>(null);
  const [newFoodTitle, setNewFoodTitle] = useState('');
  const [newFoodCalories, setNewFoodCalories] = useState('');

  // Daily Water Tracker State
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ft_player_water_glasses');
      if (saved !== null && !isNaN(Number(saved))) return Number(saved);
      return 0;
    } catch {
      return 0;
    }
  });

  const handleUpdateWater = (newCount: number) => {
    const clamped = Math.max(0, Math.min(16, newCount));
    setWaterGlasses(clamped);
    try {
      localStorage.setItem('ft_player_water_glasses', String(clamped));
      localStorage.setItem('ft_player_water_ml', String(clamped * 250));
      window.dispatchEvent(new Event('ft_water_updated'));
    } catch {}
  };

  // Storage key
  const storageKey = `ft_daily_nutrition_meals_${activePlan?.id || 'default'}`;

  // Default athletic foods for each meal
  const getDefaultMeals = (day: string): Record<MealSectionKey, MealFoodItem[]> => ({
    breakfast: [
      { id: `${day}-b1`, title: 'نان سنگک و پنیر گردو', calories: 280, protein: 12, completed: false },
      { id: `${day}-b2`, title: '۲ عدد تخم‌مرغ آب‌پز', calories: 150, protein: 14, completed: false },
    ],
    lunch: [
      { id: `${day}-l1`, title: 'سینه مرغ گریل و برنج کته', calories: 550, protein: 42, completed: false },
      { id: `${day}-l2`, title: 'ماست کم‌چرب و سالاد فصل', calories: 120, protein: 6, completed: false },
    ],
    snack: [
      { id: `${day}-s1`, title: 'سیب درختی و ۳ عدد خرما', calories: 160, protein: 2, completed: false },
      { id: `${day}-s2`, title: 'مشت بادام خام', calories: 150, protein: 5, completed: false },
    ],
    dinner: [
      { id: `${day}-d1`, title: 'فیله ماهی یا خوراک عدسی', calories: 380, protein: 28, completed: false },
      { id: `${day}-d2`, title: 'سبزیجات بخارپز و زیتون', calories: 90, protein: 3, completed: false },
    ],
  });

  // State for all days
  const [allDaysData, setAllDaysData] = useState<Record<string, Record<MealSectionKey, MealFoodItem[]>>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {}
    const initial: Record<string, Record<MealSectionKey, MealFoodItem[]>> = {};
    weekDays.forEach((d) => {
      initial[d] = getDefaultMeals(d);
    });
    return initial;
  });

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(allDaysData));
    } catch {}
  }, [allDaysData, storageKey]);

  // Current day's meals
  const currentDayMeals = useMemo(() => {
    if (allDaysData[selectedDay]) return allDaysData[selectedDay];
    return getDefaultMeals(selectedDay);
  }, [allDaysData, selectedDay]);

  // Target calories
  const targetCalories = activePlan?.dailyCalories || 2100;

  // Total consumed calories (ticked items)
  const consumedCalories = useMemo(() => {
    let sum = 0;
    MEAL_SECTIONS.forEach(({ key }) => {
      const items = currentDayMeals[key] || [];
      items.forEach((item) => {
        if (item.completed) {
          sum += Number(item.calories) || 0;
        }
      });
    });
    return sum;
  }, [currentDayMeals]);

  // Calorie progress percentage
  const caloriePercent = Math.min(100, Math.round((consumedCalories / targetCalories) * 100));

  // Toggle meal food item
  const handleToggleItem = (mealKey: MealSectionKey, itemId: string) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([14]);
      } catch {}
    }

    setAllDaysData((prev) => {
      const dayMeals = prev[selectedDay] ? { ...prev[selectedDay] } : getDefaultMeals(selectedDay);
      const items = dayMeals[mealKey] || [];
      const updatedItems = items.map((it) => (it.id === itemId ? { ...it, completed: !it.completed } : it));
      return {
        ...prev,
        [selectedDay]: {
          ...dayMeals,
          [mealKey]: updatedItems,
        },
      };
    });
  };

  // Delete meal food item
  const handleDeleteItem = (mealKey: MealSectionKey, itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAllDaysData((prev) => {
      const dayMeals = prev[selectedDay] ? { ...prev[selectedDay] } : getDefaultMeals(selectedDay);
      const items = dayMeals[mealKey] || [];
      return {
        ...prev,
        [selectedDay]: {
          ...dayMeals,
          [mealKey]: items.filter((it) => it.id !== itemId),
        },
      };
    });
  };

  // Add new food item from Dialog
  const handleAddNewFood = (mealKey: MealSectionKey) => {
    if (!newFoodTitle.trim()) return;
    const cals = parseInt(newFoodCalories, 10) || 150;

    const newItem: MealFoodItem = {
      id: `food-${Date.now()}`,
      title: newFoodTitle.trim(),
      calories: cals,
      completed: false,
    };

    setAllDaysData((prev) => {
      const dayMeals = prev[selectedDay] ? { ...prev[selectedDay] } : getDefaultMeals(selectedDay);
      const items = dayMeals[mealKey] || [];
      return {
        ...prev,
        [selectedDay]: {
          ...dayMeals,
          [mealKey]: [...items, newItem],
        },
      };
    });

    setNewFoodTitle('');
    setNewFoodCalories('');
    setActiveModalMeal(null);
  };

  return (
    <div
      dir="rtl"
      className="relative w-full max-w-[480px] rounded-3xl p-3.5 sm:p-4 bg-gradient-to-br from-[#06180f]/95 via-[#081e13]/90 to-[#120b24]/90 border border-emerald-500/40 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.7)] select-none my-2 sm:my-2.5 text-right text-white"
    >
      {/* Neon Emerald Atmosphere Glow */}
      <div
        className="absolute -top-10 -left-10 w-44 h-44 rounded-full pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, transparent 70%)',
          filter: 'blur(24px)',
        }}
      />

      {/* 1. Header Row */}
      <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
            <Utensils className="h-3.5 w-3.5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-black text-white">
              کالری‌شمار و وعده‌های روزانه
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenDetails}
          className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          title="تغییر یا دریافت رژیم جدید"
        >
          <RotateCcw className="h-3 w-3" />
          <span>برنامه غذایی</span>
        </button>
      </div>

      {/* 2. WEEK CALENDAR STRIP */}
      <div className="relative z-10 py-2.5">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
          {weekDays.map((day) => {
            const isSelected = selectedDay === day;
            const dayData = allDaysData[day];
            let totalDayCompleted = 0;
            if (dayData) {
              MEAL_SECTIONS.forEach(({ key }) => {
                totalDayCompleted += (dayData[key] || []).filter((i) => i.completed).length;
              });
            }

            return (
              <motion.button
                key={day}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 py-1 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-slate-950 font-black shadow-[0_0_15px_rgba(52,211,153,0.6)]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <span className="text-[10px] sm:text-[11px] font-bold">{day.replace('‌شنبه', '')}</span>
                {totalDayCompleted > 0 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] mt-0.5" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3. CALORIE PROGRESS BAR (NO YELLOW - Crisp Emerald & Teal) */}
      <div className="relative z-10 p-2.5 rounded-2xl bg-white/5 border border-white/10 mb-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-bold text-slate-200">کالری مصرفی:</span>
            <span className="font-black text-emerald-400">{consumedCalories}</span>
            <span className="text-[10px] text-slate-400">از {targetCalories} kcal</span>
          </div>
          <span className="font-black text-emerald-300 text-xs">{caloriePercent}٪</span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="h-2.5 w-full bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-300"
            style={{ width: `${caloriePercent}%` }}
          />
        </div>
      </div>

      {/* 4. DAILY WATER TRACKER (قابلیت تغییر مصرف آب همینجا) */}
      <div className="relative z-10 p-2.5 rounded-2xl bg-sky-500/[0.06] border border-sky-500/20 mb-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Droplets className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-xs font-black text-white">مصرف آب روزانه:</span>
            <span className="text-xs font-black text-sky-300">
              {waterGlasses} از ۸ لیوان ({waterGlasses * 250} ml)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleUpdateWater(waterGlasses + 1)}
              className="px-2 py-0.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-[10px] font-bold transition-all cursor-pointer"
            >
              +۱ لیوان
            </button>
            <button
              type="button"
              onClick={() => handleUpdateWater(waterGlasses - 1)}
              className="px-1.5 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] font-bold transition-all cursor-pointer"
            >
              -۱
            </button>
          </div>
        </div>

        {/* 8 Glass Visual Bars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 8 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleUpdateWater(idx + 1 === waterGlasses ? idx : idx + 1)}
              className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                idx < waterGlasses
                  ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              title={`تنظیم روی ${idx + 1} لیوان`}
            />
          ))}
        </div>
      </div>

      {/* 5. THE 4 MEALS: صبحانه، ناهار، میان وعده، شام */}
      <div className="relative z-10 space-y-2">
        {MEAL_SECTIONS.map(({ key, title }) => {
          const items = currentDayMeals[key] || [];
          const mealCaloriesSum = items.reduce((sum, it) => sum + (it.calories || 0), 0);

          return (
            <div
              key={key}
              className="rounded-2xl p-2.5 bg-white/[0.04] border border-white/10 space-y-2"
            >
              {/* Meal Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white">{title}</span>
                  <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                    {mealCaloriesSum} kcal
                  </span>
                </div>

                {/* Dialog Open Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalMeal(key);
                    setNewFoodTitle('');
                    setNewFoodCalories('');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Plus className="h-3 w-3" />
                  <span>افزودن</span>
                </button>
              </div>

              {/* Foods List under this Meal */}
              <div className="space-y-1">
                {items.length === 0 ? (
                  <div className="py-2 text-center text-[10px] text-slate-500">
                    موردی ثبت نشده است. دکمه «افزودن» را بزنید.
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleItem(key, item.id)}
                      className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all duration-200 ${
                        item.completed
                          ? 'bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.12)]'
                          : 'bg-white/5 hover:bg-white/10 border-white/5'
                      }`}
                    >
                      {/* Checkbox + Title */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="shrink-0">
                          {item.completed ? (
                            <div className="h-5 w-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_8px_#34d399]">
                              <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          ) : (
                            <Circle className="h-5 w-5 text-slate-500 stroke-[2] hover:text-emerald-400 transition-colors" />
                          )}
                        </div>

                        <span
                          className={`text-xs font-black truncate transition-all duration-200 ${
                            item.completed ? 'text-emerald-300 line-through opacity-75' : 'text-slate-100'
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      {/* Calorie & Delete */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-emerald-400">
                          {item.calories} kcal
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteItem(key, item.id, e)}
                          className="h-6 w-6 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors"
                          title="حذف خوراک"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. DEDICATED DIALOG MODAL FOR ADDING FOOD (دکمه افزودن یک دیالوگ باز می‌کند) */}
      <AnimatePresence>
        {activeModalMeal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              className="w-full max-w-sm rounded-3xl bg-[#091d13] border border-emerald-500/40 p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-4 text-right text-white"
            >
              {/* Dialog Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-black text-white">
                    افزودن خوراک به {MEAL_SECTIONS.find((m) => m.key === activeModalMeal)?.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalMeal(null)}
                  className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    نام خوراک
                  </label>
                  <input
                    type="text"
                    value={newFoodTitle}
                    onChange={(e) => setNewFoodTitle(e.target.value)}
                    placeholder="مثلاً املت، نان سنگک، فیله مرغ"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    کالری (کیلوکالری)
                  </label>
                  <input
                    type="number"
                    value={newFoodCalories}
                    onChange={(e) => setNewFoodCalories(e.target.value)}
                    placeholder="مثلاً ۲۰۰"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Quick suggestions */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1.5">انتخاب سریع:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { title: 'نان سنگک', cal: 150 },
                      { title: 'تخم‌مرغ آب‌پز', cal: 75 },
                      { title: 'سینه مرغ گریل', cal: 220 },
                      { title: 'برنج کته', cal: 200 },
                      { title: 'سیب درختی', cal: 80 },
                      { title: 'شیر کم‌چرب', cal: 110 },
                      { title: 'ماست و سالاد', cal: 90 },
                    ].map((s) => (
                      <button
                        key={s.title}
                        type="button"
                        onClick={() => {
                          setNewFoodTitle(s.title);
                          setNewFoodCalories(String(s.cal));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        {s.title} ({s.cal})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dialog Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleAddNewFood(activeModalMeal)}
                    disabled={!newFoodTitle.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer disabled:opacity-40 shadow-lg shadow-emerald-500/20"
                  >
                    ثبت خوراک
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalMeal(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

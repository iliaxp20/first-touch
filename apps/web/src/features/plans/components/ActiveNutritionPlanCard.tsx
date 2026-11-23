import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, RotateCcw, Utensils } from 'lucide-react';

interface ActiveNutritionPlanCardProps {
  activePlan: any;
  onOpenDetails: () => void;
}

interface MealTask {
  id: string | number;
  type: string;
  title: string;
  desc: string;
  calories: number;
  protein: number;
  completed: boolean;
}

export const ActiveNutritionPlanCard: React.FC<ActiveNutritionPlanCardProps> = ({
  activePlan,
  onOpenDetails,
}) => {
  const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  const [selectedDay, setSelectedDay] = useState<string>(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(new Date());
    } catch {
      return 'شنبه';
    }
  });

  const getDayDefaultMeals = (day: string): MealTask[] => [
    {
      id: `${day}-m1`,
      type: 'صبحانه',
      title: 'املت اسفناج و نان سنگک',
      desc: '۳ عدد سفیده + ۱ تخم‌مرغ کامل، کف دست سنگک',
      calories: 380,
      protein: 24,
      completed: false,
    },
    {
      id: `${day}-m2`,
      type: 'میان‌وعده صبح',
      title: 'سیب درختی، خرما و مغز بادام',
      desc: '۱ عدد سیب متوسط، ۳ عدد خرما پیارم، ۱۰ عدد بادام',
      calories: 220,
      protein: 6,
      completed: false,
    },
    {
      id: `${day}-m3`,
      type: 'ناهار',
      title: 'سینه مرغ گریل با برنج کته و بروکلی',
      desc: '۱۸۰ گرم سینه مرغ، ۱۰ قاشق برنج، لیموترش',
      calories: 620,
      protein: 48,
      completed: false,
    },
    {
      id: `${day}-m4`,
      type: 'عصرانه',
      title: 'موز، اوتمیل و کره بادام‌زمینی',
      desc: 'شیر کم‌چرب، موز، ۱ قاشق کره بادام‌زمینی',
      calories: 300,
      protein: 16,
      completed: false,
    },
    {
      id: `${day}-m5`,
      type: 'شام',
      title: 'فیله ماهی یا خوراک عدسی با قارچ',
      desc: 'سبک با هضم آسان جهت بهبود ترشح هورمون رشد',
      calories: 420,
      protein: 32,
      completed: false,
    },
  ];

  const storageKey = `ft_nutrition_calendar_meals_${activePlan?.id || 'default'}`;

  const [allDaysMeals, setAllDaysMeals] = useState<Record<string, MealTask[]>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<string, MealTask[]> = {};
    weekDays.forEach((d) => {
      initial[d] = getDayDefaultMeals(d);
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(allDaysMeals));
    } catch {}
  }, [allDaysMeals, storageKey]);

  const currentMeals = allDaysMeals[selectedDay] || getDayDefaultMeals(selectedDay);

  // Toggle meal with creative animation (NEVER DISAPPEARS!)
  const toggleMeal = (mealId: string | number) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([16]);
      } catch {}
    }

    setAllDaysMeals((prev) => {
      const updated = (prev[selectedDay] || []).map((m) =>
        m.id === mealId ? { ...m, completed: !m.completed } : m
      );
      return { ...prev, [selectedDay]: updated };
    });
  };

  const totalTargetCalories = activePlan?.dailyCalories || 1940;
  const consumedCalories = currentMeals
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.calories, 0);
  const consumedProtein = currentMeals
    .filter((m) => m.completed)
    .reduce((sum, m) => sum + m.protein, 0);

  const calPercent = Math.min(100, Math.round((consumedCalories / totalTargetCalories) * 100));

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calPercent / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full max-w-[480px] rounded-3xl p-3.5 sm:p-4 bg-gradient-to-br from-[#06180f]/95 via-[#081e13]/90 to-[#120b24]/90 border border-emerald-500/40 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.7)] select-none my-2 sm:my-2.5"
      dir="rtl"
    >
      {/* Neon Emerald Atmosphere Glow */}
      <div
        className="absolute -top-10 -left-10 w-44 h-44 rounded-full pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, transparent 70%)',
          filter: 'blur(24px)',
        }}
      />

      {/* 1. Header: Plan Title + Change Plan */}
      <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
            <Utensils className="h-3.5 w-3.5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-black text-white">
              کالری‌شمار و وعده‌های روزانه
            </span>
            <span className="block text-[10px] text-emerald-400 font-bold">
              {activePlan?.title || 'برنامه غذایی ورزشی'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenDetails}
          className="px-2.5 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          title="افزودن یا تغییر خوراک"
        >
          <RotateCcw className="h-3 w-3" />
          <span>+ تغییر / افزودن خوراک</span>
        </button>
      </div>

      {/* 2. WEEK CALENDAR PILLS */}
      <div className="relative z-10 py-2.5">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
          {weekDays.map((day) => {
            const isSelected = selectedDay === day;
            const dayMeals = allDaysMeals[day] || [];
            const isAllDone = dayMeals.length > 0 && dayMeals.every((m) => m.completed);

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
                <span className="text-[10px] sm:text-[11px]">{day.replace('‌شنبه', '')}</span>
                {isAllDone && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] mt-0.5" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3. CARD BODY: Calorie Circular Progress + Meals Checklist */}
      <div className="relative z-10 flex items-center justify-between gap-3 pt-1">
        {/* Calorie Gauge */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-slate-800/80"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="transition-all duration-500 ease-out"
                stroke="url(#nutritionCardGaugeGrad)"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
              <defs>
                <linearGradient id="nutritionCardGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span className="text-sm sm:text-base font-black text-white tracking-tight">
                {calPercent}%
              </span>
              <span className="text-[8px] text-amber-400 font-bold mt-0.5">کالری</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-amber-400 mt-1">
            {consumedCalories} از {totalTargetCalories} kcal
          </span>
          <span className="text-[9px] font-bold text-emerald-400">
            {consumedProtein}g پروتئین ثبت‌شده
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-32 bg-white/10 shrink-0" />

        {/* Meals Checklist with Creative Animation */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {currentMeals.map((meal) => (
            <motion.div
              key={meal.id}
              layout
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleMeal(meal.id)}
              className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all duration-300 ${
                meal.completed
                  ? 'bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Creative animated checkmark */}
                <motion.div
                  animate={meal.completed ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="shrink-0"
                >
                  {meal.completed ? (
                    <div className="h-5 w-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_10px_#34d399]">
                      <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 text-slate-500 stroke-[2] hover:text-emerald-400 transition-colors" />
                  )}
                </motion.div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-white/10 text-emerald-400">
                      {meal.type}
                    </span>
                    <span
                      className={`text-[11px] font-black truncate transition-all duration-300 ${
                        meal.completed
                          ? 'text-emerald-300 line-through opacity-80'
                          : 'text-slate-100'
                      }`}
                    >
                      {meal.title}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 truncate block mt-0.5">
                    {meal.desc}
                  </span>
                </div>
              </div>

              {/* Calorie & Protein Badge */}
              <div className="text-left shrink-0">
                <span className="text-[10px] font-bold text-amber-400 block">{meal.calories} kcal</span>
                <span className="text-[9px] text-emerald-400 font-semibold">{meal.protein}g پروتئین</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

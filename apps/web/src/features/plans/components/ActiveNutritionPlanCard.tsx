import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, RotateCcw } from 'lucide-react';

interface ActiveNutritionPlanCardProps {
  activePlan: any;
  onOpenDetails: () => void;
}

export const ActiveNutritionPlanCard: React.FC<ActiveNutritionPlanCardProps> = ({
  activePlan,
  onOpenDetails,
}) => {
  const defaultMeals = [
    {
      id: 1,
      title: 'صبحانه',
      desc: 'جو دوسر با میوه و مغزها',
      calories: 450,
      completed: true,
      image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 2,
      title: 'ناهار',
      desc: 'مرغ گریل با سبزیجات',
      calories: 650,
      completed: false,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 3,
      title: 'شام',
      desc: 'ماهی سالمون و سالاد سبز',
      calories: 550,
      completed: false,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=120&q=80',
    },
  ];

  const [meals, setMeals] = useState(() => {
    try {
      const saved = localStorage.getItem('ft_active_nutrition_meals_status');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultMeals;
  });

  const toggleMeal = (id: number) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([14]);
      } catch {}
    }
    setMeals((prev: typeof defaultMeals) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m));
      try {
        localStorage.setItem('ft_active_nutrition_meals_status', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const totalTargetCalories = activePlan?.dailyCalories || 1700;
  const consumedCalories = meals
    .filter((m: any) => m.completed)
    .reduce((sum: number, m: any) => sum + m.calories, 0);

  const calPercent = Math.min(100, Math.round((consumedCalories / totalTargetCalories) * 100));

  // Circular gauge math
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calPercent / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative w-full max-w-[420px] rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-gradient-to-r from-[#06180f] via-[#081e13] to-[#140b29] border border-emerald-500/40 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] overflow-hidden select-none my-3"
      dir="rtl"
    >
      {/* Top Left Neon Emerald Glow */}
      <div
        className="absolute -top-8 -left-8 w-36 h-36 rounded-full pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Bottom Right Neon Purple Glow */}
      <div
        className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, transparent 70%)',
          filter: 'blur(22px)',
        }}
      />

      {/* Top Header Row */}
      <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-white">
          <Calendar className="h-4 w-4 text-purple-400 stroke-[2.2]" />
          <span>{activePlan?.title ? activePlan.title.slice(0, 26) : 'برنامه امروز'}</span>
        </div>
        <button
          type="button"
          onClick={onOpenDetails}
          className="text-[10px] sm:text-[11px] font-bold text-emerald-400/90 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-0.5"
          title="مشاهده و تغییر برنامه غذایی"
        >
          <RotateCcw className="h-3 w-3" />
          <span>تغییر</span>
        </button>
      </div>

      {/* Main Card Body */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-3">
        {/* 1. Left: Circular Progress Gauge + Calories */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="stroke-slate-800/80"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className="transition-all duration-500 ease-out"
                stroke="url(#nutritionGaugeGrad)"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
              <defs>
                <linearGradient id="nutritionGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base sm:text-lg font-black text-white tracking-tight">
                {calPercent}%
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-300 mt-1">کالری مصرفی</span>
          <span className="text-[11px] font-black text-emerald-400 mt-0.5">
            {consumedCalories} / {totalTargetCalories} kcal
          </span>
        </div>

        {/* Vertical Divider Line */}
        <div className="w-px h-28 bg-white/10 shrink-0" />

        {/* 2. Middle: Meals Checklist */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2 py-0.5">
          {meals.map((m: any) => (
            <div
              key={m.id}
              onClick={() => toggleMeal(m.id)}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              {m.completed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-500/20 shrink-0 transition-transform group-hover:scale-110" />
              ) : (
                <Circle className="h-4 w-4 text-slate-500 shrink-0 transition-transform group-hover:scale-110" />
              )}
              <div className="flex flex-col min-w-0 leading-tight">
                <span
                  className={`text-xs font-black transition-colors ${
                    m.completed ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {m.title}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[140px] sm:max-w-[170px]">
                  {m.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Right: Circular Food Photos */}
        <div className="shrink-0 flex flex-col justify-between space-y-2">
          {meals.map((m: any) => (
            <div
              key={m.id}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-white/15 shadow-sm bg-slate-900 shrink-0"
            >
              <img
                src={m.image}
                alt={m.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

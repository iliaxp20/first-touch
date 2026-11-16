import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, ArrowLeft, RotateCcw } from 'lucide-react';

interface ActiveTrainingPlanCardProps {
  activePlan: any;
  onOpenDetails: () => void;
}

export const ActiveTrainingPlanCard: React.FC<ActiveTrainingPlanCardProps> = ({
  activePlan,
  onOpenDetails,
}) => {
  // Default session tasks if not provided
  const defaultTasks = [
    { id: 1, title: '۲۰ دقیقه پاس و کنترل توپ', completed: true },
    { id: 2, title: '۱۵ دقیقه دریبل و سرعت', completed: true },
    { id: 3, title: '۳ ست فوتبال کوچک', completed: false },
  ];

  const [tasks, setTasks] = useState<{ id: number; title: string; completed: boolean }[]>(() => {
    try {
      const saved = localStorage.getItem('ft_active_training_tasks_status');
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultTasks;
  });

  const toggleTask = (id: number) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([14]);
      } catch {}
    }
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      try {
        localStorage.setItem('ft_active_training_tasks_status', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  // SVG circular gauge math
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative w-full max-w-[420px] rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-gradient-to-r from-[#06180f] via-[#081e13] to-[#140b29] border border-emerald-500/40 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] overflow-hidden select-none my-3"
      dir="rtl"
    >
      {/* Top Left Neon Emerald Radiance Glow */}
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
          <span>{activePlan?.title ? activePlan.title.slice(0, 26) : 'برنامه تمرینی شما'}</span>
        </div>
        <button
          type="button"
          onClick={onOpenDetails}
          className="text-[10px] sm:text-[11px] font-bold text-emerald-400/90 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-0.5"
          title="مشاهده و تغییر برنامه"
        >
          <RotateCcw className="h-3 w-3" />
          <span>تغییر</span>
        </button>
      </div>

      {/* Main Card Body */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-3">
        {/* 1. Left Side: Circular Gauge */}
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
                stroke="url(#trainingGaugeGrad)"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
              <defs>
                <linearGradient id="trainingGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base sm:text-lg font-black text-white tracking-tight">
                {progressPercent}%
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-300 mt-1">پیشرفت کلی</span>
        </div>

        {/* Vertical Divider Line */}
        <div className="w-px h-24 bg-white/10 shrink-0" />

        {/* 2. Middle: Tasks Checklist + Details Button */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1.5 py-0.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              {task.completed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-500/20 shrink-0 transition-transform group-hover:scale-110" />
              ) : (
                <Circle className="h-4 w-4 text-slate-500 shrink-0 transition-transform group-hover:scale-110" />
              )}
              <span
                className={`text-[11px] font-bold leading-tight truncate transition-colors ${
                  task.completed ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {task.title}
              </span>
            </div>
          ))}

          {/* Action Button: مشاهده جزئیات برنامه */}
          <button
            type="button"
            onClick={onOpenDetails}
            className="mt-1 w-fit px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 text-[10px] font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)]"
          >
            <span>مشاهده جزئیات برنامه</span>
            <ArrowLeft className="h-3 w-3 text-emerald-400" />
          </button>
        </div>

        {/* 3. Right: Silhouette Footballer with Neon Aura */}
        <div className="shrink-0 w-16 sm:w-20 h-24 relative flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-90"
            style={{
              background: 'radial-gradient(ellipse at 60% 50%, rgba(16, 185, 129, 0.45) 0%, rgba(139, 92, 246, 0.3) 50%, transparent 80%)',
              filter: 'blur(8px)',
            }}
          />
          <img
            src="/haaland.png"
            alt="بازیکن"
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(52,211,153,0.7)]"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

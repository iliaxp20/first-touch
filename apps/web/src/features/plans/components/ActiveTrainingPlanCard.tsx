import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Circle, RotateCcw, Play, Clock } from 'lucide-react';
import { VideoModal } from '@/features/admin/components/VideoModal';
import { resolveMediaUrl } from '@/lib/api';
import { getTrainingDrills } from '../data/freeTrainingCategories';

interface ActiveTrainingPlanCardProps {
  activePlan: any;
  onOpenDetails: () => void;
}

interface TrainingTask {
  id: string | number;
  title: string;
  duration?: string;
  videoUrl?: string;
  completed: boolean;
}

export const ActiveTrainingPlanCard: React.FC<ActiveTrainingPlanCardProps> = ({
  activePlan,
  onOpenDetails,
}) => {
  // Calendar days for training week
  const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  // Current selected day
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(new Date());
    } catch {
      return 'شنبه';
    }
  });

  // Video preview modal
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  // Default tasks generator based on day
  const getDayDefaultTasks = (day: string): TrainingTask[] => {
    const daySeed = day === 'شنبه' ? 1 : day === 'دوشنبه' ? 2 : day === 'چهارشنبه' ? 3 : 0;
    if (daySeed === 0) {
      return [
        { id: `${day}-1`, title: 'استراحت فعال و کشش عضلانی', duration: '۱۵ دقیقه', completed: false },
        { id: `${day}-2`, title: 'ریکاوری و هیدراتاسیون پویا', duration: '۱۰ دقیقه', completed: false },
      ];
    }
    return [
      {
        id: `${day}-1`,
        title: 'گرم‌کردن پویا و چابکی با نردبان',
        duration: '۱۵ دقیقه',
        videoUrl: '/uploads/drill_agility.mp4',
        completed: false,
      },
      {
        id: `${day}-2`,
        title: 'تمرین لمس اول و شتاب اولیه در جهت مخالف',
        duration: '۲۰ دقیقه',
        videoUrl: '/uploads/drill_first_touch.mp4',
        completed: false,
      },
      {
        id: `${day}-3`,
        title: 'دریبلینگ و انتقال توپ در فضاهای فشرده',
        duration: '۱۵ دقیقه',
        videoUrl: '/uploads/drill_dribble.mp4',
        completed: false,
      },
    ];
  };

  // State for all tasks indexed by storage key
  const storageKey = `ft_training_calendar_tasks_${activePlan?.id || 'default'}`;

  const [allDaysTasks, setAllDaysTasks] = useState<Record<string, TrainingTask[]>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial: Record<string, TrainingTask[]> = {};
    weekDays.forEach((d) => {
      initial[d] = getDayDefaultTasks(d);
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(allDaysTasks));
    } catch {}
  }, [allDaysTasks, storageKey]);

  // Current day tasks
  const currentTasks = allDaysTasks[selectedDay] || getDayDefaultTasks(selectedDay);

  // Toggle task with CREATIVE GLOWING ANIMATION (NEVER REMOVES THE TASK!)
  const toggleTask = (taskId: string | number) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([16]);
      } catch {}
    }

    setAllDaysTasks((prev) => {
      const updatedDayTasks = (prev[selectedDay] || []).map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const next = { ...prev, [selectedDay]: updatedDayTasks };
      return next;
    });
  };

  // Progress metrics
  const completedCount = currentTasks.filter((t) => t.completed).length;
  const progressPercent = currentTasks.length > 0 ? Math.round((completedCount / currentTasks.length) * 100) : 0;

  // SVG Gauge
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[480px] rounded-3xl p-3.5 sm:p-4 bg-gradient-to-br from-[#06180f]/95 via-[#081e13]/90 to-[#120b24]/90 border border-emerald-500/40 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.7)] select-none my-2 sm:my-3"
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

        {/* 1. Header Row: Plan Title + Change Plan Button */}
        <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Calendar className="h-3.5 w-3.5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-white">
                {activePlan?.title ? activePlan.title.slice(0, 30) : 'برنامه تمرینی اختصاصی'}
              </span>
              <span className="block text-[10px] text-emerald-400 font-bold">تقویم هفتگی جلسات</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDetails}
            className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            title="تغییر برنامه تمرینی"
          >
            <RotateCcw className="h-3 w-3" />
            <span>تغییر برنامه</span>
          </button>
        </div>

        {/* 2. WEEK CALENDAR PILLS SELECTOR */}
        <div className="relative z-10 py-2.5">
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
            {weekDays.map((day) => {
              const isSelected = selectedDay === day;
              const dayTasks = allDaysTasks[day] || [];
              const isAllDone = dayTasks.length > 0 && dayTasks.every((t) => t.completed);

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

        {/* 3. CARD BODY: Progress Gauge + Interactive Checklist */}
        <div className="relative z-10 flex items-center justify-between gap-3 pt-1">
          {/* Circular Progress Gauge */}
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
                  stroke="url(#trainingCardGaugeGrad)"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="trainingCardGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-sm sm:text-base font-black text-white tracking-tight">
                  {progressPercent}%
                </span>
                <span className="text-[8px] text-emerald-400 font-bold mt-0.5">انجام شد</span>
              </div>
            </div>
            <span className="text-[9px] font-bold text-slate-400 mt-1">پیشرفت جلسه</span>
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-28 bg-white/10 shrink-0" />

          {/* Drills Checklist with Creative Animation (NEVER REMOVES ITEMS!) */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {currentTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleTask(task.id)}
                className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all duration-300 ${
                  task.completed
                    ? 'bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* Creative animated checkmark */}
                  <motion.div
                    animate={task.completed ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0"
                  >
                    {task.completed ? (
                      <div className="h-5 w-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_10px_#34d399]">
                        <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <Circle className="h-5 w-5 text-slate-500 stroke-[2] hover:text-emerald-400 transition-colors" />
                    )}
                  </motion.div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-[11px] font-black block truncate transition-all duration-300 ${
                        task.completed
                          ? 'text-emerald-300 line-through opacity-80'
                          : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </span>
                    {task.duration && (
                      <span className="text-[9px] text-slate-400 font-bold flex items-center gap-0.5 mt-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{task.duration}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct Video Preview Button (به جای عکس بازیکن) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const drills = getTrainingDrills();
                    const matching = drills.find((d) => d.title === task.title || task.title.includes(d.title));
                    const resolvedVideo =
                      task.videoUrl ||
                      matching?.videoUrl ||
                      activePlan?.videoUrl ||
                      '/uploads/1795327247084-C63495EC-5FAC-443D-8C87-97E8EDD4FF88.mp4';
                    setActiveVideo({
                      url: resolvedVideo,
                      title: task.title,
                    });
                  }}
                  className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[9px] font-black flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                  title="مشاهده ویدیوی این تمرین"
                >
                  <Play className="h-2.5 w-2.5 fill-current" />
                  <span>ویدیو</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Video Modal Player */}
      {activeVideo && (
        <VideoModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          videoUrl={resolveMediaUrl(activeVideo.url)}
          title={activeVideo.title}
        />
      )}
    </>
  );
};

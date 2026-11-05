import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import {
  Apple,
  Clock,
  Dumbbell,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Circle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { saveUnlockedPlan } from '../data/readyProgramsStore';
import { ExecutiveCalendarModal, TrainingProgramItem } from './ExecutiveCalendarModal';
import { PlanAcquisitionModal } from './PlanAcquisitionModal';
import { NutritionTracker } from './NutritionTracker';

type MainSectionTab = 'training' | 'nutrition';

export const PlanList: React.FC = () => {
  // 2 MAIN TABS AT TOP
  const [activeTab, setActiveTab] = useState<MainSectionTab>('training');

  // Real Active Plans State (NO MOCK DATA)
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgramItem[]>([]);
  const [calendarActiveWeek, setCalendarActiveWeek] = useState<number>(1);

  // Persian Calendar State for Training Section (Matching NutritionTracker!)
  const [selectedTrainingDate, setSelectedTrainingDate] = useState<Date>(new Date());

  const formattedTrainingPersianDate = useMemo(() => {
    try {
      const dayName = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long' }).format(selectedTrainingDate);
      const dayNum = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric' }).format(selectedTrainingDate);
      const monthName = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'long' }).format(selectedTrainingDate);
      const yearNum = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(selectedTrainingDate);
      return `${dayName}، ${dayNum} ${monthName} ${yearNum}`;
    } catch {
      return selectedTrainingDate.toLocaleDateString('fa-IR');
    }
  }, [selectedTrainingDate]);

  const selectedWeekdayName = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long' }).format(selectedTrainingDate);
    } catch {
      return 'شنبه';
    }
  }, [selectedTrainingDate]);

  const isTrainingToday = useMemo(() => {
    return new Date().toDateString() === selectedTrainingDate.toDateString();
  }, [selectedTrainingDate]);

  const handleNextTrainingDay = () => {
    const next = new Date(selectedTrainingDate);
    next.setDate(next.getDate() + 1);
    setSelectedTrainingDate(next);
  };

  const handlePrevTrainingDay = () => {
    const prev = new Date(selectedTrainingDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedTrainingDate(prev);
  };

  const handleTrainingGoToday = () => {
    setSelectedTrainingDate(new Date());
  };

  // Modals state
  const [isAcquisitionModalOpen, setIsAcquisitionModalOpen] = useState(false);
  const [acquisitionMode, setAcquisitionMode] = useState<'training' | 'nutrition'>('training');
  const [selectedCalendarProgram, setSelectedCalendarProgram] = useState<TrainingProgramItem | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Strictly load ONLY REAL user-enrolled plans (ZERO MOCK DATA)
  useEffect(() => {
    try {
      const savedPlans = localStorage.getItem('first_touch_student_active_plans');
      if (savedPlans) {
        const parsed = JSON.parse(savedPlans);
        const realOnly = Array.isArray(parsed)
          ? parsed.filter((p: any) => p && p.id !== 'prog-active-1')
          : [];
        setTrainingPrograms(realOnly);
        localStorage.setItem('first_touch_student_active_plans', JSON.stringify(realOnly));
      } else {
        setTrainingPrograms([]);
      }
    } catch {
      setTrainingPrograms([]);
    }
  }, []);

  const handleOpenAcquisition = (mode: 'training' | 'nutrition') => {
    setAcquisitionMode(mode);
    setIsAcquisitionModalOpen(true);
  };

  const handlePlanActivated = (planDetails: any) => {
    if (acquisitionMode === 'training') {
      const durationWeeks = Number(planDetails.durationWeeks) || 4;
      const sessionsPerWeek = Number(planDetails.sessionsPerWeek) || 3;
      const totalSessions = planDetails.totalSessions || durationWeeks * sessionsPerWeek;

      const schedule = Array.isArray(planDetails.schedule) && planDetails.schedule.length > 0
        ? planDetails.schedule
        : Array.from({ length: durationWeeks }).map((_, wIdx) => ({
            weekNumber: wIdx + 1,
            sessions: [
              { dayName: 'شنبه', title: 'تمرین جلسه اول هفته', focus: 'شتاب اولیه و لمس اول', durationMinutes: 50, completed: false, drillsCount: 3 },
              { dayName: 'دوشنبه', title: 'تمرین جلسه دوم هفته', focus: 'چابکی و انتقال توپ', durationMinutes: 50, completed: false, drillsCount: 3 },
              { dayName: 'چهارشنبه', title: 'تمرین جلسه سوم هفته', focus: 'تاکتیک و شوت‌زنی', durationMinutes: 50, completed: false, drillsCount: 3 },
            ],
          }));

      const newProgram: TrainingProgramItem = {
        id: planDetails.id || `prog-${Date.now()}`,
        title: planDetails.title,
        coachName: planDetails.coachName || 'کادر فنی آکادمی',
        coachTitle: 'آکادمی فوتبال فرست تاچ',
        goal: planDetails.goal || 'ارتقای توان بدنی و مهارتی شاگرد',
        difficulty: planDetails.difficulty || 'متوسط',
        ageGroup: planDetails.ageGroup || 'تمامی رده‌ها',
        durationWeeks,
        sessionsPerWeek,
        equipment: planDetails.equipment || ['توپ', 'مخروط', 'نردبان'],
        description: planDetails.description || 'برنامه تمرینی اختصاصی فعال شده برای شاگرد.',
        price: planDetails.price || 'پرداخت شده',
        isFree: planDetails.price === 'رایگان' || planDetails.isFree === true,
        studentsCount: 1,
        rating: 5,
        completedSessions: 0,
        totalSessions,
        schedule,
      };

      // Save unlocked plan so lifetime access is guaranteed
      saveUnlockedPlan(planDetails.id, planDetails.title);
      const updated = [newProgram, ...trainingPrograms];
      setTrainingPrograms(updated);
      localStorage.setItem('first_touch_student_active_plans', JSON.stringify(updated));

      // Sync with API in background
      fetch('http://localhost:4000/programs/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgram),
      }).catch(() => {});

      setToastNotification(`برنامه تمرینی «${planDetails.title}» با موفقیت فعال و به پنل اضافه شد.`);
    } else {
      // Save unlocked plan so lifetime access is guaranteed
      saveUnlockedPlan('nutrition-plan', planDetails.title);
      // Synchronize with Nutrition API target
      if (planDetails.dailyCalories) {
        fetch('http://localhost:4000/nutrition/target', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            calories: Number(planDetails.dailyCalories),
            note: planDetails.title || 'برنامه رژیم فعال',
          }),
        }).catch(() => {});
      }
      setToastNotification(`برنامه غذایی «${planDetails.title}» با موفقیت فعال و با کالری‌شمار هوشمند تنظیم گردید.`);
    }

    setTimeout(() => setToastNotification(null), 4000);
  };

  const handleDirectToggleSession = (programId: string, weekNumber: number, dayName: string) => {
    const updated = trainingPrograms.map((prog) => {
      if (prog.id !== programId) return prog;

      const nextSchedule = prog.schedule.map((w) => {
        if (w.weekNumber !== weekNumber) return w;
        return {
          ...w,
          sessions: w.sessions.map((s) => (s.dayName === dayName ? { ...s, completed: !s.completed } : s)),
        };
      });

      let completedCount = 0;
      for (const w of nextSchedule) {
        for (const s of w.sessions) {
          if (s.completed) completedCount++;
        }
      }

      const updatedProg = {
        ...prog,
        schedule: nextSchedule,
        completedSessions: completedCount,
      };

      // Real API Sync
      fetch(`http://localhost:4000/programs/${prog.id}/session-toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekNumber, dayName }),
      }).catch(() => {});

      fetch('http://localhost:4000/programs/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProg),
      }).catch(() => {});

      return updatedProg;
    });

    setTrainingPrograms(updated);
    localStorage.setItem('first_touch_student_active_plans', JSON.stringify(updated));
  };

  const handleSessionToggled = (updatedProgram: TrainingProgramItem) => {
    const updated = trainingPrograms.map((p) => (p.id === updatedProgram.id ? updatedProgram : p));
    setTrainingPrograms(updated);
    localStorage.setItem('first_touch_student_active_plans', JSON.stringify(updated));
    setSelectedCalendarProgram(updatedProgram);

    // Sync to API
    fetch('http://localhost:4000/programs/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProgram),
    }).catch(() => {});
  };

  const handleDeleteTrainingProgram = (id: string, title: string) => {
    if (!window.confirm(`آیا از حذف برنامه تمرینی «${title}» اطمینان دارید؟\nدسترسی شما محفوظ خواهد ماند و در آینده بدون نیاز به پرداخت مجدد می‌توانید آن را فعال نمایید.`)) {
      return;
    }
    // Record in unlocked store so it NEVER asks for payment again
    saveUnlockedPlan(id, title);
    const updated = trainingPrograms.filter((p) => p.id !== id);
    setTrainingPrograms(updated);
    localStorage.setItem('first_touch_student_active_plans', JSON.stringify(updated));
    setToastNotification(`برنامه تمرینی «${title}» حذف شد. شما می‌توانید هر زمان بدون پرداخت مجدد آن را مجدداً اضافه نمایید.`);
    setTimeout(() => setToastNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 select-none">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span>{toastNotification}</span>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-emerald-500 hover:text-emerald-800 text-xs cursor-pointer"
          >
            بستن
          </button>
        </div>
      )}

      {/* Main Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="h-6 w-6 text-purple-600" />
            سامانه تمرین و تغذیه شاگرد
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            پیگیری روزانه جلسات تمرین، تقویم اجرایی و برنامه تغذیه فوتبال
          </p>
        </div>
      </div>

      {/* =========================================================================
          2 TABS AT TOP: TRAINING & NUTRITION WITH SLIDING SPRING PILL
          ========================================================================= */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300/60 dark:border-white/10 select-none relative">
        {/* Tab 1: برنامه تمرینی */}
        <button
          type="button"
          onClick={() => setActiveTab('training')}
          className={`relative flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-black transition-colors duration-200 cursor-pointer ${
            activeTab === 'training'
              ? 'text-purple-900 dark:text-purple-100'
              : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300'
          }`}
        >
          {activeTab === 'training' && (
            <motion.div
              layoutId="mainPlanTabIndicator"
              className="absolute inset-0 rounded-xl bg-white dark:bg-purple-950/90 shadow-md border border-purple-200/80 dark:border-purple-600/40"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
          <Dumbbell className="h-5 w-5 text-purple-600 relative z-10" />
          <span className="relative z-10">برنامه تمرینی</span>
        </button>

        {/* Tab 2: برنامه غذایی */}
        <button
          type="button"
          onClick={() => setActiveTab('nutrition')}
          className={`relative flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-black transition-colors duration-200 cursor-pointer ${
            activeTab === 'nutrition'
              ? 'text-purple-900 dark:text-purple-100'
              : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300'
          }`}
        >
          {activeTab === 'nutrition' && (
            <motion.div
              layoutId="mainPlanTabIndicator"
              className="absolute inset-0 rounded-xl bg-white dark:bg-purple-950/90 shadow-md border border-purple-200/80 dark:border-purple-600/40"
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            />
          )}
          <Apple className="h-5 w-5 text-purple-600 relative z-10" />
          <span className="relative z-10">برنامه غذایی</span>
        </button>
      </div>

      {/* =========================================================================
          SLIDING CAROUSEL CONTENT CONTAINER (NO BLUR, PURE CRISP SLIDE)
          ========================================================================= */}
      <div className="overflow-hidden relative w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ x: activeTab === 'training' ? -60 : 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: activeTab === 'training' ? 60 : -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.8 }}
            className="w-full"
          >
            {activeTab === 'training' ? (
              <div className="max-w-3xl mx-auto space-y-5 text-right select-none pb-28 sm:pb-36 relative">
                {/* 1. PERSIAN CALENDAR HEADER BAR (دقیقاً مشابه بخش برنامه غذایی) */}
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <button
                    type="button"
                    onClick={handleNextTrainingDay}
                    className="h-8 w-8 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                    title="روز بعد"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                      {formattedTrainingPersianDate}
                    </span>
                    {isTrainingToday ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        امروز
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleTrainingGoToday}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 cursor-pointer transition-colors"
                      >
                        برو به امروز
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handlePrevTrainingDay}
                    className="h-8 w-8 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                    title="روز قبل"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>

                {/* 2. ACTIVE PROGRAM OVERVIEW & REAL PROGRESS */}
                {(() => {
                  const activeProgram = trainingPrograms[0] || null;
                  const totalSessions = activeProgram?.totalSessions || 12;
                  const completedSessions = activeProgram?.completedSessions || 0;
                  const progressPct = Math.min(100, Math.round((completedSessions / totalSessions) * 100));

                  return (
                    <>
                      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                {activeProgram ? activeProgram.ageGroup || 'دوره ۴ هفته‌ای' : 'دوره ۴ هفته‌ای'}
                              </span>
                              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                                {activeProgram ? activeProgram.title : 'هنوز برنامه تمرینی فعالی ثبت نشده است'}
                              </h3>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {activeProgram
                                ? `طراح: ${activeProgram.coachName} • ۳ جلسه در هفته • مجموعاً ۱۲ جلسه کل`
                                : 'جهت صدور و تنظیم برنامه تقویمی، دکمه دریافت برنامه رایگان را بزنید.'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <Button
                              variant="primary"
                              onClick={() => handleOpenAcquisition('training')}
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-4 h-9 rounded-xl shadow-md cursor-pointer gap-1.5"
                            >
                              <Plus className="h-4 w-4" />
                              {activeProgram ? 'تغییر یا دریافت برنامه جدید' : 'دریافت برنامه ساده (رایگان)'}
                            </Button>
                            {activeProgram && (
                              <Button
                                variant="outline"
                                onClick={() => handleDeleteTrainingProgram(activeProgram.id, activeProgram.title)}
                                title="حذف برنامه تمرینی"
                                className="h-9 w-9 p-0 border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer rounded-xl"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {activeProgram && (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                              <span>پیشرفت دوره تمرینی:</span>
                              <span className="text-purple-700 dark:text-purple-300 font-black">
                                {completedSessions} از {totalSessions} جلسه انجام شده ({progressPct}٪)
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 rounded-full"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>

                            {/* Video Player - Only if uploaded or present */}
                            {activeProgram.videoUrl && (
                              <div className="pt-2">
                                <video
                                  src={activeProgram.videoUrl}
                                  controls
                                  playsInline
                                  className="w-full aspect-video rounded-xl bg-black object-cover max-h-56 border border-border"
                                />
                              </div>
                            )}

                            {/* Description - Only if provided */}
                            {Boolean(activeProgram.description && activeProgram.description.trim()) && (
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                                {activeProgram.description}
                              </p>
                            )}

                            {/* Equipment - Only if provided */}
                            {Boolean(activeProgram.equipment && activeProgram.equipment.length > 0) && (
                              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                                <span className="font-bold">تجهیزات لازم:</span>
                                <span className="font-semibold text-foreground">
                                  {Array.isArray(activeProgram.equipment)
                                    ? activeProgram.equipment.join('، ')
                                    : activeProgram.equipment}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 3. TODAY'S SESSION ON SELECTED DATE (تقویم جلسه همان روز) */}
                      {!activeProgram ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 p-6">
                          <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                            <Dumbbell className="h-7 w-7" />
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                            هنوز برنامه تمرینی ۴ هفته‌ای (۱۲ جلسه) دریافت نکرده‌اید
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => handleOpenAcquisition('training')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-6 h-10 rounded-xl shadow-md cursor-pointer gap-1.5"
                          >
                            <Plus className="h-4 w-4" />
                            دریافت برنامه ساده (رایگان) - ۱۲ جلسه
                          </Button>
                        </div>
                      ) : (
                        (() => {
                          const currentWeek =
                            activeProgram.schedule.find((w) => w.weekNumber === calendarActiveWeek) ||
                            activeProgram.schedule[0];
                          const todaySession = currentWeek?.sessions?.find(
                            (s) => s.dayName === selectedWeekdayName
                          );

                          return (
                            <div className="space-y-4">
                              {todaySession ? (
                                /* TRAINING SESSION FOR SELECTED DAY */
                                <div
                                  className={`p-5 rounded-2xl border transition-all space-y-3.5 shadow-xs ${
                                    todaySession.completed
                                      ? 'bg-emerald-500/[0.05] border-emerald-500/30'
                                      : 'bg-white dark:bg-slate-900 border-purple-200/80 dark:border-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-purple-600 text-white shadow-xs">
                                        جلسه تمرینی: {todaySession.dayName}
                                      </span>
                                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                                        هفته {calendarActiveWeek}
                                      </span>
                                    </div>

                                    <span
                                      className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                                        todaySession.completed
                                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                      }`}
                                    >
                                      {todaySession.completed ? 'انجام شد (تیک خورده)' : 'در انتظار انجام'}
                                    </span>
                                  </div>

                                  <div>
                                    <h4
                                      className={`text-base font-black transition-colors ${
                                        todaySession.completed
                                          ? 'line-through text-slate-400 dark:text-slate-500'
                                          : 'text-slate-900 dark:text-white'
                                      }`}
                                    >
                                      {todaySession.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                      تمرکز جلسه: <span className="text-slate-800 dark:text-slate-200 font-bold">{todaySession.focus}</span>
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                      <span className="flex items-center gap-1 font-bold">
                                        <Clock className="h-3.5 w-3.5 text-purple-500" />
                                        <span>{todaySession.durationMinutes} دقیقه</span>
                                      </span>
                                      <span>•</span>
                                      <span className="font-bold text-purple-600 dark:text-purple-400">
                                        {todaySession.drillsCount} حرکت تمرینی
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDirectToggleSession(
                                          activeProgram.id,
                                          calendarActiveWeek,
                                          todaySession.dayName
                                        )
                                      }
                                      className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                                        todaySession.completed
                                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/25'
                                      }`}
                                    >
                                      {todaySession.completed ? (
                                        <>
                                          <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                                          <span>تیک خورده (انجام شد)</span>
                                        </>
                                      ) : (
                                        <>
                                          <Circle className="h-4 w-4 stroke-[2]" />
                                          <span>ثبت و تیک انجام جلسه</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* REST & RECOVERY DAY ON SELECTED DATE */
                                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4 text-right">
                                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Sparkles className="h-6 w-6" />
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                      روز استراحت و ریکاوری فعال ({selectedWeekdayName})
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                      امروز جلسه تمرین سنگین در برنامه شما تعیین نشده است. خواب کافی، هیدراتاسیون مناسب و مصرف پروتئین را رعایت فرمایید.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* 4. WEEKS 1 TO 4 CHECKLIST (نمای کامل ۱۲ جلسه با قابلیت تیک زدن) */}
                              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                                    چک‌لیست جلسات دوره (۴ هفته • ۱۲ جلسه کل):
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {activeProgram.schedule.map((w) => (
                                      <button
                                        key={w.weekNumber}
                                        type="button"
                                        onClick={() => setCalendarActiveWeek(w.weekNumber)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                                          calendarActiveWeek === w.weekNumber
                                            ? 'bg-purple-600 text-white shadow-xs'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}
                                      >
                                        هفته {w.weekNumber}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  {currentWeek?.sessions.map((sess) => (
                                    <div
                                      key={sess.dayName}
                                      onClick={() =>
                                        handleDirectToggleSession(
                                          activeProgram.id,
                                          calendarActiveWeek,
                                          sess.dayName
                                        )
                                      }
                                      className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                                        sess.completed
                                          ? 'bg-emerald-500/[0.04] border-emerald-500/25'
                                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-800 hover:border-purple-300'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <button
                                          type="button"
                                          className="text-muted-foreground shrink-0 cursor-pointer"
                                        >
                                          {sess.completed ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600 stroke-[2.5]" />
                                          ) : (
                                            <Circle className="h-5 w-5 text-slate-400 stroke-[1.8]" />
                                          )}
                                        </button>
                                        <div className="min-w-0">
                                          <p
                                            className={`text-xs font-bold line-clamp-1 ${
                                              sess.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                                            }`}
                                          >
                                            {sess.title}
                                          </p>
                                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                            {sess.dayName} • {sess.focus} • {sess.durationMinutes} دقیقه
                                          </p>
                                        </div>
                                      </div>

                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                                          sess.completed
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-slate-200/60 dark:bg-slate-700 text-slate-500'
                                        }`}
                                      >
                                        {sess.completed ? 'انجام شد' : `${sess.drillsCount} حرکت`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
        /* TAB 2: NUTRITION TAB (REAL-TIME CALORIE & MACRO TRACKER + IRANIAN FOOD DATABASE FROM API) */
        <NutritionTracker />
      )}
    </motion.div>
  </AnimatePresence>
</div>

      {/* PLAN ACQUISITION MODAL (3 TABS: FREE SIMPLE, READY 199K, COACH CUSTOM 399K) */}
      <PlanAcquisitionModal
        isOpen={isAcquisitionModalOpen}
        onClose={() => setIsAcquisitionModalOpen(false)}
        mode={acquisitionMode}
        onPlanActivated={handlePlanActivated}
      />

      {/* EXECUTIVE WORKOUT CALENDAR MODAL */}
      {selectedCalendarProgram && (
        <ExecutiveCalendarModal
          isOpen={!!selectedCalendarProgram}
          onClose={() => setSelectedCalendarProgram(null)}
          program={selectedCalendarProgram}
          onSessionToggled={handleSessionToggled}
        />
      )}
    </div>
  );
};

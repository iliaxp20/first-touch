import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CalendarCheck2,
  Apple,
  Clock,
  Dumbbell,
  CheckCircle2,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
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

      const newProgram: TrainingProgramItem = {
        id: `prog-${Date.now()}`,
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
        isFree: planDetails.price === 'رایگان',
        studentsCount: 1,
        rating: 5,
        completedSessions: 0,
        totalSessions,
        schedule: Array.from({ length: durationWeeks }).map((_, wIdx) => ({
          weekNumber: wIdx + 1,
          sessions: [
            { dayName: 'شنبه', title: 'تمرین جلسه اول هفته', focus: 'شتاب اولیه و لمس اول', durationMinutes: 50, completed: false, drillsCount: 3 },
            { dayName: 'دوشنبه', title: 'تمرین جلسه دوم هفته', focus: 'چابکی و انتقال توپ', durationMinutes: 50, completed: false, drillsCount: 3 },
            { dayName: 'چهارشنبه', title: 'تمرین جلسه سوم هفته', focus: 'تاکتیک و شوت‌زنی', durationMinutes: 50, completed: false, drillsCount: 3 },
          ],
        })),
      };

      // Save unlocked plan so lifetime access is guaranteed
      saveUnlockedPlan(planDetails.id, planDetails.title);
      const updated = [newProgram, ...trainingPrograms];
      setTrainingPrograms(updated);
      localStorage.setItem('first_touch_student_active_plans', JSON.stringify(updated));
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

  const handleSessionToggled = (updatedProgram: TrainingProgramItem) => {
    const updated = trainingPrograms.map((p) => (p.id === updatedProgram.id ? updatedProgram : p));
    setTrainingPrograms(updated);
    localStorage.setItem('first_touch_student_active_plans', JSON.stringify(updated));
    setSelectedCalendarProgram(updatedProgram);
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
        <div className="space-y-6">
          {trainingPrograms.length === 0 ? (
            /* CLEAN MINIMALIST CENTERED BUTTON: ZERO CLUTTER */
            <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shadow-sm">
                <Dumbbell className="h-8 w-8" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                هنوز برنامه تمرینی فعالی دریافت نکرده‌اید
              </p>
              <Button
                variant="primary"
                onClick={() => handleOpenAcquisition('training')}
                className="px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-xl shadow-purple-500/25 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-5 w-5" />
                دریافت برنامه تمرینی
              </Button>
            </div>
          ) : (
            /* REAL ENROLLED PLANS + CLEAN ADD BUTTON */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    برنامه‌های تمرینی فعال شما ({trainingPrograms.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    جهت ثبت جلسات انجام شده و مشاهده تقویم روزانه روی برنامه کلیک نمایید
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleOpenAcquisition('training')}
                  className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs px-4 h-9 rounded-xl shadow-md cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  افزودن
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingPrograms.map((program) => {
                  const totalSessions = program.totalSessions || 12;
                  const completedSessions = program.completedSessions || 0;
                  const progressPct = Math.min(100, Math.round((completedSessions / totalSessions) * 100));

                  return (
                    <Card
                      key={program.id}
                      className="flex flex-col justify-between hover:border-purple-400 dark:hover:border-purple-600 transition-all shadow-sm border border-purple-100 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 rounded-2xl overflow-hidden"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-black px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            {program.ageGroup}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            برنامه فعال شاگرد
                          </span>
                        </div>
                        <CardTitle className="text-base font-black text-slate-900 dark:text-white line-clamp-1">
                          {program.title}
                        </CardTitle>
                        <CardDescription className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {program.goal}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-0">
                        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/25 border border-purple-100 dark:border-white/5 text-center text-xs">
                          <div>
                            <Clock className="h-4 w-4 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {program.durationWeeks} هفته
                            </span>
                          </div>
                          <div>
                            <Dumbbell className="h-4 w-4 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {program.sessionsPerWeek} جلسه/هفته
                            </span>
                          </div>
                          <div>
                            <Calendar className="h-4 w-4 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {program.totalSessions} جلسه کل
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                            <span>پیشرفت جلسات دوره:</span>
                            <span className="text-purple-700 dark:text-purple-300 font-black">
                              {completedSessions} از {totalSessions} جلسه ({progressPct}٪)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 rounded-full"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
                        <Button
                          variant="primary"
                          onClick={() => setSelectedCalendarProgram(program)}
                          className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md shadow-purple-500/25 cursor-pointer h-10"
                        >
                          <CalendarCheck2 className="h-4 w-4" />
                          مشاهده تقویم اجرایی
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDeleteTrainingProgram(program.id, program.title)}
                          title="حذف برنامه تمرینی"
                          className="h-10 w-10 p-0 border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer shrink-0 rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
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

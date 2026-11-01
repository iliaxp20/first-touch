import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import {
  X,
  Calendar,
  CheckCircle2,
  Circle,
  TrendingUp,
} from 'lucide-react';

export interface ProgramSession {
  dayName: string;
  title: string;
  focus: string;
  durationMinutes: number;
  completed: boolean;
  drillsCount: number;
}

export interface TrainingProgramItem {
  id: string;
  title: string;
  coachName: string;
  coachTitle: string;
  goal: string;
  difficulty: 'مبتدی' | 'متوسط' | 'پیشرفته';
  ageGroup: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  equipment: string[];
  description: string;
  price: string;
  isFree: boolean;
  studentsCount: number;
  rating: number;
  imageUrl?: string;
  completedSessions: number;
  totalSessions: number;
  schedule: {
    weekNumber: number;
    sessions: ProgramSession[];
  }[];
}

interface ExecutiveCalendarModalProps {
  program: TrainingProgramItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSessionToggled?: (updatedProgram: TrainingProgramItem) => void;
}

export const ExecutiveCalendarModal: React.FC<ExecutiveCalendarModalProps> = ({
  program,
  isOpen,
  onClose,
  onSessionToggled,
}) => {
  const [activeWeek, setActiveWeek] = useState(1);
  const [loadingSession, setLoadingSession] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('has-modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('has-modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('has-modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !program) return null;

  const currentWeek = program.schedule.find((w) => w.weekNumber === activeWeek) || program.schedule[0];
  const weekSessions = currentWeek ? currentWeek.sessions : [];
  const weekCompletedCount = weekSessions.filter((s) => s.completed).length;
  const progressPercent = Math.round((program.completedSessions / (program.totalSessions || 1)) * 100);

  const handleToggleSession = async (dayName: string) => {
    const key = `${activeWeek}-${dayName}`;
    setLoadingSession(key);

    try {
      const res = await fetch(`http://localhost:4000/programs/${program.id}/session-toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekNumber: activeWeek, dayName }),
      });

      if (res.ok) {
        const updated = await res.json();
        if (onSessionToggled) onSessionToggled(updated);
      }
    } catch {
      // Local fallback
    } finally {
      setLoadingSession(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/95 sm:bg-slate-950/98 backdrop-blur-xl overflow-y-auto select-none">
      <Card className="w-full max-w-2xl border border-purple-200/90 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl shadow-purple-950/25 relative overflow-hidden rounded-3xl my-4">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between bg-purple-50/50 dark:bg-purple-950/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-500/30">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                تقویم اجرایی تمرینات: {program.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                طراحی توسط: {program.coachName} ({program.coachTitle})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="p-4 sm:p-5 border-b border-border/60 bg-gradient-to-r from-purple-500/5 via-transparent to-purple-500/5">
          <div className="flex items-center justify-between mb-2 text-xs font-black">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              پیشرفت کل دوره تمرینی ({program.completedSessions} از {program.totalSessions} جلسه انجام شده)
            </span>
            <span className="text-purple-600 dark:text-purple-400 text-sm font-black">{progressPercent}٪</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Week Tabs */}
        <div className="px-4 sm:px-5 pt-4 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-border/60 pb-3">
          {program.schedule.map((w) => {
            const isSelected = w.weekNumber === activeWeek;
            const wDone = w.sessions.filter((s) => s.completed).length;
            const isAllDone = wDone === w.sessions.length && w.sessions.length > 0;

            return (
              <button
                key={w.weekNumber}
                onClick={() => setActiveWeek(w.weekNumber)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 font-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>هفته {w.weekNumber}</span>
                {isAllDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                ) : (
                  <span className="text-[10px] opacity-80">
                    ({wDone}/{w.sessions.length})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Current Week Sessions */}
        <CardContent className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>برنامه زمان‌بندی هفته {activeWeek}:</span>
            <span>
              {weekCompletedCount} از {weekSessions.length} جلسه تکمیل شده
            </span>
          </div>

          <div className="space-y-2.5">
            {weekSessions.map((session) => {
              const isLoading = loadingSession === `${activeWeek}-${session.dayName}`;

              return (
                <div
                  key={session.dayName}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    session.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-800 dark:text-slate-200'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-white/5 text-slate-800 dark:text-slate-200 hover:border-purple-300 dark:hover:border-purple-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleSession(session.dayName)}
                      disabled={isLoading}
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 ${
                        session.completed
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                          : 'border-2 border-slate-300 dark:border-slate-600 text-transparent hover:border-purple-600 hover:text-purple-600'
                      }`}
                      title={session.completed ? 'علامت‌گذاری به عنوان انجام نشده' : 'علامت‌گذاری به عنوان انجام شده'}
                    >
                      {session.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5 stroke-[2]" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          {session.dayName}
                        </span>
                        <h4
                          className={`text-sm font-black ${
                            session.completed ? 'line-through opacity-75' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {session.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        تمرکز جلسه: <span className="text-slate-700 dark:text-slate-300 font-medium">{session.focus}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs shrink-0">
                    <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 font-bold">
                      {session.durationMinutes} دقیقه
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-100/70 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
                      {session.drillsCount} تمرین
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>

        {/* Footer */}
        <div className="p-4 border-t border-border/80 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            با کلیک روی دایره هر جلسه، وضعیت انجام تمرین شما بلافاصله ذخیره می‌شود.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md shadow-purple-500/25"
          >
            تایید و بستن
          </button>
        </div>
      </Card>
    </div>
  );
};

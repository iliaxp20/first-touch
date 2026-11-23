import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  X,
  Heart,
  Droplets,
  Moon,
  TrendingUp,
  Award,
  Plus,
  Minus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/api';
import { LinearPerformanceChart, DayPoint } from './components/LinearPerformanceChart';
import { Button } from '@/components/ui/Button';

const WATER_STORAGE_KEY = 'ft_player_water_glasses';
const TARGET_WATER_GLASSES = 8;

export const DashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Page readiness and image preloader
  const [isReady, setIsReady] = useState(false);

  // Modals state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isStudentReportModalOpen, setIsStudentReportModalOpen] = useState(false);

  // Water Tracker
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(WATER_STORAGE_KEY);
      if (saved !== null && !isNaN(Number(saved))) return Number(saved);
      return 6;
    } catch {
      return 6;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WATER_STORAGE_KEY, String(waterGlasses));
      localStorage.setItem('ft_player_water_ml', String(waterGlasses * 250));
    } catch {}
  }, [waterGlasses]);

  // Real Training & Performance Data
  const [weeklyPerformanceData, setWeeklyPerformanceData] = useState<DayPoint[]>([]);
  const [activeProgram, setActiveProgram] = useState<any>(null);

  // Haptic feedback
  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([14]);
      } catch {}
    }
  }, []);

  // Synchronized asset preloader
  useEffect(() => {
    const imagesToLoad = [
      '/firsttouchcrop.png',
      '/glossy-profile-icon.png',
      '/dashboard-banner-profile.webp',
      '/dashboard-tactics-nutrition.webp',
      '/dashboard-training-quiz-progress.webp',
      '/dashboard-messages-health.webp',
      '/dashboard-student-report.webp',
    ];

    let loadedCount = 0;
    let isMounted = true;

    const onImageLoaded = () => {
      loadedCount++;
      if (loadedCount >= imagesToLoad.length && isMounted) {
        setIsReady(true);
      }
    };

    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.complete) {
        onImageLoaded();
      } else {
        img.onload = onImageLoaded;
        img.onerror = onImageLoaded;
      }
    });

    const timer = setTimeout(() => {
      if (isMounted) setIsReady(true);
    }, 280);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Load programs & performance data
  useEffect(() => {
    try {
      const savedPlans = localStorage.getItem('first_touch_student_active_plans');
      if (savedPlans) {
        const parsed = JSON.parse(savedPlans);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setActiveProgram(parsed[0]);
        }
      }
    } catch {}

    fetch(`${API_BASE_URL}/programs/weekly-performance`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.points && Array.isArray(d.points)) {
          setWeeklyPerformanceData(d.points);
        }
      })
      .catch(() => {});
  }, []);

  // Player details for banner
  const playerName = currentUser?.fullName || 'مهدی طارمی';
  const playerAge = currentUser?.age || 17;
  const playerPosition = currentUser?.position || 'هافبک دفاعی';

  return (
    <div
      className={`w-full max-w-lg mx-auto px-2 sm:px-3 pt-1 pb-32 select-none transition-opacity duration-300 ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* =========================================================================
          TOP APP BAR (دقیقاً مشابه بخش‌های برنامه غذایی و تمرینات)
          - لوگوی بزرگ First Touch با تابش سبز نئونی
          - زنگوله اعلان با دایره فیکس
          - آیکون سه‌بعدی پروفایل متناسب
          ========================================================================= */}
      <header
        dir="ltr"
        className="w-full flex items-center justify-between py-2 px-1 sm:px-2 mb-3 relative"
      >
        {/* Header Ambient Emerald Atmosphere */}
        <div
          className="absolute -top-6 -left-4 w-80 h-28 rounded-full pointer-events-none opacity-75 z-0"
          style={{
            background:
              'radial-gradient(circle at 35% 45%, rgba(34, 197, 94, 0.38) 0%, rgba(16, 185, 129, 0.20) 48%, transparent 75%)',
            filter: 'blur(28px)',
          }}
        />

        {/* 1. Left side: Large First Touch Logo with dedicated Emerald Radiance */}
        <div
          className="relative flex items-center shrink-0 cursor-pointer"
          onClick={() => {
            triggerHaptic();
            navigate('/');
          }}
        >
          <div
            className="absolute -inset-x-5 -inset-y-3 rounded-full pointer-events-none opacity-90 z-0"
            style={{
              background:
                'radial-gradient(ellipse at 45% 50%, rgba(16, 185, 129, 0.58) 0%, rgba(5, 150, 105, 0.32) 42%, rgba(4, 120, 87, 0.12) 65%, transparent 80%)',
              filter: 'blur(16px)',
            }}
          />
          <motion.img
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            src="/firsttouchcrop.png"
            alt="فرست تاچ"
            loading="eager"
            decoding="sync"
            className="relative z-10 h-11 sm:h-14 md:h-16 w-auto max-h-16 object-contain drop-shadow-[0_4px_24px_rgba(16,185,129,0.7)]"
          />
        </div>

        {/* 2 & 3. Right side: Notification Bell + Pure 3D Profile Icon */}
        <div className="relative z-10 flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* 2. Notification Bell Button with neon green dot */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              triggerHaptic();
              setIsNotifOpen(!isNotifOpen);
            }}
            className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 aspect-square rounded-full bg-white/10 dark:bg-[#07160e]/80 hover:bg-white/20 dark:hover:bg-[#0c2a1a] border border-slate-200/50 dark:border-emerald-500/30 backdrop-blur-xl flex items-center justify-center text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-white shadow-[0_2px_10px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_15px_rgba(0,0,0,0.4)] transition-colors cursor-pointer"
            title="اعلان‌ها"
          >
            <Bell className="h-5 w-5 sm:h-5.5 sm:w-5.5 stroke-[2] shrink-0" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] ring-2 ring-background" />
          </motion.button>

          {/* 3. Pure 3D Profile Icon */}
          <motion.img
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHaptic();
              navigate('/settings');
            }}
            src="/glossy-profile-icon.png"
            alt="پروفایل کاربری"
            loading="eager"
            decoding="sync"
            className="w-[41px] h-[41px] sm:w-[45px] sm:h-[45px] shrink-0 aspect-square object-contain cursor-pointer"
            title="پروفایل کاربری"
          />
        </div>
      </header>

      {/* =========================================================================
          NOTIFICATIONS MODAL (z-[100] ABOVE ALL DOCKS)
          ========================================================================= */}
      <AnimatePresence>
        {isNotifOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="w-full max-w-md rounded-3xl bg-card dark:bg-[#091b12] border border-border dark:border-emerald-500/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-foreground dark:text-white space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border dark:border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                    <Bell className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-black">پیام‌ها و اطلاعیه‌ها</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-right">
                <div className="p-3 rounded-2xl bg-muted/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-emerald-400 font-bold">امروز • ۱۰:۳۰</span>
                    <h4 className="text-xs font-black">جلسه تمرینی روزانه آماده است</h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    جلسه تمرین استقامت و کنترل توپ توسط کادر فنی بارگذاری شد.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-amber-400 font-bold">دیروز</span>
                    <h4 className="text-xs font-black">ثبت میان‌وعده ریکاوری</h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    میزان پروتئین و آب‌رسانی پس از تمرین خود را در برنامه غذایی ثبت کنید.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          1. ITEM 1: PROFILE BANNER
          - تصویر 64bad590... زیر topappbar
          - روی تصویر کنار دکمش سن، نام و پست هافبک دفاعی
          ========================================================================= */}
      <div className="w-full mb-3 sm:mb-3.5">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            triggerHaptic();
            navigate('/settings');
          }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          title="مشاهده پروفایل کاربری"
        >
          <img
            src="/dashboard-banner-profile.webp"
            alt="پروفایل بازیکن"
            className="w-full h-auto block select-none"
            loading="eager"
            decoding="sync"
          />

          {/* User details overlay positioned right next to the button */}
          <div
            dir="rtl"
            className="absolute inset-y-0 right-[32%] sm:right-[31%] left-[22%] sm:left-[20%] flex flex-col justify-center items-start text-right pointer-events-none select-none z-10"
          >
            <div className="truncate max-w-full">
              <span className="text-xs sm:text-sm md:text-base font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {playerName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] md:text-xs font-bold text-emerald-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] truncate max-w-full">
              <span>{playerAge} سال</span>
              <span className="text-emerald-500/70">•</span>
              <span className="text-emerald-300 font-extrabold">{playerPosition}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =========================================================================
          2. ITEM 2: TACTICS & NUTRITION ROW
          - تصویر 5c237fbd...
          - سمت چپ: تخته تاکتیک -> /tactics
          - سمت راست: برنامه غذایی -> /nutrition
          ========================================================================= */}
      <div className="w-full mb-3 sm:mb-3.5">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <img
            src="/dashboard-tactics-nutrition.webp"
            alt="تخته تاکتیک و برنامه غذایی"
            className="w-full h-auto block select-none"
            loading="eager"
            decoding="sync"
          />

          {/* Tactics Hotspot (Left 50% in image) */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              triggerHaptic();
              navigate('/tactics');
            }}
            className="absolute inset-y-0 left-0 w-1/2 cursor-pointer transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.08]"
            title="ورود به تخته تاکتیک"
          />

          {/* Nutrition Hotspot (Right 50% in image) */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              triggerHaptic();
              navigate('/nutrition');
            }}
            className="absolute inset-y-0 right-0 w-1/2 cursor-pointer transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.08]"
            title="مشاهده برنامه غذایی"
          />
        </div>
      </div>

      {/* =========================================================================
          3. ITEM 3: TRAINING, QUIZ & PROGRESS ROW
          - تصویر 7a243db5...
          - چپ: تمرینات و برنامه‌ها -> /practice
          - وسط: بازی کوییز -> /quiz
          - راست: گزارش پیشرفت -> باز شدن مودال تحلیل پیشرفت
          ========================================================================= */}
      <div className="w-full mb-3 sm:mb-3.5">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <img
            src="/dashboard-training-quiz-progress.webp"
            alt="تمرینات، بازی کوییز و گزارش پیشرفت"
            className="w-full h-auto block select-none"
            loading="eager"
            decoding="sync"
          />

          {/* Training Hotspot (Left 33.3% in image) */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              triggerHaptic();
              navigate('/practice');
            }}
            className="absolute inset-y-0 left-0 w-[33.33%] cursor-pointer transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.08]"
            title="مشاهده برنامه تمرینات"
          />

          {/* Quiz Hotspot (Middle 33.3% in image) */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              triggerHaptic();
              navigate('/quiz');
            }}
            className="absolute inset-y-0 left-[33.33%] w-[33.34%] cursor-pointer transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.08]"
            title="شروع بازی کوییز"
          />

          {/* Progress Hotspot (Right 33.3% in image) */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              triggerHaptic();
              setIsProgressModalOpen(true);
            }}
            className="absolute inset-y-0 right-0 w-[33.33%] cursor-pointer transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.08]"
            title="مشاهده گزارش پیشرفت"
          />
        </div>
      </div>

      {/* =========================================================================
          4. ITEM 4: MESSAGES & HEALTH STATUS ROW
          - تصویر 0b98f1f0...
          - چپ: پیام‌ها و اطلاعیه‌ها -> باز شدن مودال پیام‌ها
          - راست: وضعیت خواب و سلامت -> باز شدن مودال وضعیت خواب و هیدراتاسیون
          ========================================================================= */}
      <div className="w-full mb-3 sm:mb-3.5">
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <img
            src="/dashboard-messages-health.webp"
            alt="پیام‌ها و وضعیت خواب و سلامت"
            className="w-full h-auto block select-none"
            loading="eager"
            decoding="sync"
          />

          {/* Messages Hotspot (Left 50% in image) */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              triggerHaptic();
              setIsNotifOpen(true);
            }}
            className="absolute inset-y-0 left-0 w-1/2 cursor-pointer transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.08]"
            title="مشاهده پیام‌ها و اطلاعیه‌ها"
          />

          {/* Health & Sleep Hotspot (Right 50% in image) */}
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              triggerHaptic();
              setIsHealthModalOpen(true);
            }}
            className="absolute inset-y-0 right-0 w-1/2 cursor-pointer transition-all duration-200 hover:bg-white/[0.04] active:bg-white/[0.08]"
            title="مشاهده جزئیات خواب و سلامت"
          />
        </div>
      </div>

      {/* =========================================================================
          5. ITEM 5: STUDENT PERFORMANCE REPORT BANNER
          - تصویر a301f3fb...
          - گزارش عملکرد دانش‌آموز (مشاهده گزارش ماهانه)
          ========================================================================= */}
      <div className="w-full mb-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            triggerHaptic();
            setIsStudentReportModalOpen(true);
          }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          title="مشاهده گزارش عملکرد دانش‌آموز"
        >
          <img
            src="/dashboard-student-report.webp"
            alt="گزارش عملکرد ماهانه دانش‌آموز"
            className="w-full h-auto block select-none"
            loading="eager"
            decoding="sync"
          />
        </motion.div>
      </div>

      {/* =========================================================================
          PROGRESS REPORT MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isProgressModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="w-full max-w-lg rounded-3xl bg-card dark:bg-[#07160e] border border-border dark:border-emerald-500/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-foreground dark:text-white space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border dark:border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">گزارش و تحلیل پیشرفت</h3>
                    <p className="text-[10px] text-muted-foreground">آمار عملکرد هفتگی بازیکن</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProgressModalOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Linear Performance Chart */}
              <div className="pt-2">
                <LinearPerformanceChart
                  data={weeklyPerformanceData}
                  hasActiveProgram={!!activeProgram}
                  onGetProgram={() => {
                    setIsProgressModalOpen(false);
                    navigate('/practice');
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-right">
                  <span className="text-[10px] text-muted-foreground font-semibold">پایبندی به تمرینات</span>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">۸۵٪</div>
                  <span className="text-[10px] text-emerald-500 font-bold">عالی و رو به رشد</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-right">
                  <span className="text-[10px] text-muted-foreground font-semibold">مجموع دقایق فعالیت</span>
                  <div className="text-lg font-black text-sky-400 mt-0.5">۳۲۰ دقیقه</div>
                  <span className="text-[10px] text-sky-400 font-bold">در ۷ روز اخیر</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          HEALTH & SLEEP STATUS MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isHealthModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="w-full max-w-md rounded-3xl bg-card dark:bg-[#07160e] border border-border dark:border-emerald-500/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-foreground dark:text-white space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border dark:border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">وضعیت خواب و سلامت</h3>
                    <p className="text-[10px] text-muted-foreground">پایش ریکاوری و هیدراتاسیون بدن</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHealthModalOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sleep details */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Moon className="h-4 w-4 text-indigo-400" />
                    خواب دیشب
                  </span>
                  <span className="text-xs font-black text-indigo-400">۸ ساعت و ۱۵ دقیقه</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1 border-t border-white/5">
                  <span>زمان خواب: ۲۳:۱۵</span>
                  <span>زمان بیداری: ۰۷:۳۰</span>
                  <span className="text-emerald-400 font-bold">کیفیت: عالی (۹۴٪)</span>
                </div>
              </div>

              {/* Hydration Tracker */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Droplets className="h-4 w-4 text-sky-400" />
                    آب‌رسانی روزانه
                  </span>
                  <span className="text-xs font-black text-sky-400">
                    {waterGlasses} از {TARGET_WATER_GLASSES} لیوان
                  </span>
                </div>

                {/* Glasses indicator */}
                <div className="grid grid-cols-8 gap-1.5 py-1">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-7 rounded-lg transition-all duration-300 flex items-center justify-center ${
                        idx < waterGlasses
                          ? 'bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.5)] text-white'
                          : 'bg-white/10 text-white/20'
                      }`}
                    >
                      <Droplets className="h-3.5 w-3.5" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      triggerHaptic();
                      setWaterGlasses((prev) => Math.max(0, prev - 1));
                    }}
                    className="h-8 flex-1 text-xs font-bold border-white/10 hover:bg-white/10"
                  >
                    <Minus className="h-3.5 w-3.5 ml-1" />
                    کاهش
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      triggerHaptic();
                      setWaterGlasses((prev) => Math.min(16, prev + 1));
                    }}
                    className="h-8 flex-1 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white"
                  >
                    <Plus className="h-3.5 w-3.5 ml-1" />
                    ثبت یک لیوان
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          STUDENT REPORT MODAL
          ========================================================================= */}
      <AnimatePresence>
        {isStudentReportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="w-full max-w-md rounded-3xl bg-card dark:bg-[#07160e] border border-border dark:border-emerald-500/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-foreground dark:text-white space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-border dark:border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">گزارش عملکرد ماهانه دانش‌آموز</h3>
                    <p className="text-[10px] text-muted-foreground">ارزیابی کادر فنی و پیشرفت مهارت‌ها</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStudentReportModalOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Monthly Overview Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/30 via-emerald-950/20 to-black/40 border border-purple-500/20 text-right space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">{playerName}</span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    رده برتر ماه
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
                  <div>
                    <div className="text-xs text-muted-foreground">حضور منظم</div>
                    <div className="text-base font-black text-emerald-400 mt-0.5">۹۴٪</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">نمره مهارت</div>
                    <div className="text-base font-black text-purple-400 mt-0.5">A+</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">انضباط تیمی</div>
                    <div className="text-base font-black text-sky-400 mt-0.5">۱۰۰٪</div>
                  </div>
                </div>
              </div>

              {/* Skills Radar / Bars */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-right">
                <h4 className="text-xs font-bold text-muted-foreground">شاخص‌های فنی بازیکن:</h4>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span>کنترل توپ و فرست تاچ</span>
                    <span className="text-emerald-400">۹۲٪</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span>دید و هوش بازی (تاکتیک)</span>
                    <span className="text-sky-400">۸۸٪</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full w-[88%]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span>استقامت و چابکی</span>
                    <span className="text-purple-400">۸۵٪</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full w-[85%]" />
                  </div>
                </div>
              </div>

              {/* Coach Feedback Note */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-right space-y-1">
                <span className="text-[11px] font-black text-emerald-400">نظر سرمربی:</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  تمرکز روی جاگیری در فاز دفاعی و سرعت انتقال توپ بسیار مثبت بوده است. تداوم تمرینات هفتگی حفظ شود.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

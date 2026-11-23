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
import { useNotifications } from '@/hooks/useNotifications';

const WATER_STORAGE_KEY = 'ft_player_water_glasses';
const TARGET_WATER_GLASSES = 8;

export const DashboardView: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { notifications } = useNotifications();

  // Page readiness and image preloader
  const [isReady, setIsReady] = useState(false);

  // Modals state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isStudentReportModalOpen, setIsStudentReportModalOpen] = useState(false);

  // Water Tracker (Default to 0 glasses until player logs)
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(WATER_STORAGE_KEY);
      if (saved !== null && !isNaN(Number(saved))) return Number(saved);
      return 0;
    } catch {
      return 0;
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
  const [healthData, setHealthData] = useState<any>(null);
  const [studentReportData, setStudentReportData] = useState<any>(null);

  // Sync health & water with API
  const updateWater = useCallback((newVal: number) => {
    setWaterGlasses(newVal);
    fetch(`${API_BASE_URL}/programs/health-sleep`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ waterGlasses: newVal, isRecorded: true }),
    }).catch(() => {});
  }, []);

  const handleSaveSleep = async (hours: number) => {
    triggerHaptic();
    try {
      const res = await fetch(`${API_BASE_URL}/programs/health-sleep`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sleepHours: hours, isRecorded: true }),
      });
      if (res.ok) {
        const d = await res.json();
        setHealthData(d);
      } else {
        setHealthData((prev: any) => ({ ...(prev || {}), sleepHours: hours, isRecorded: true }));
      }
    } catch {
      setHealthData((prev: any) => ({ ...(prev || {}), sleepHours: hours, isRecorded: true }));
    }
  };

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
      '/dashboard-cards/card_banner_profile.webp',
      '/dashboard-cards/card_nutrition.webp',
      '/dashboard-cards/card_tactics.webp',
      '/dashboard-cards/card_progress.webp',
      '/dashboard-cards/card_quiz.webp',
      '/dashboard-cards/card_training.webp',
      '/dashboard-cards/card_health.webp',
      '/dashboard-cards/card_messages.webp',
      '/dashboard-cards/card_student_report.webp',
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

    // Real Health & Sleep Data
    fetch(`${API_BASE_URL}/programs/health-sleep`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setHealthData(d);
          if (d.waterGlasses !== undefined) setWaterGlasses(d.waterGlasses);
        }
      })
      .catch(() => {});

    // Real Student Evaluation Report
    fetch(`${API_BASE_URL}/programs/student-report`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setStudentReportData(d);
      })
      .catch(() => {});
  }, []);

  // Player details for banner (real authenticated profile data)
  const playerName =
    currentUser?.fullName ||
    (currentUser?.phoneNumber ? `کاربر ${currentUser.phoneNumber.slice(-4)}` : 'ورزشکار فرست تاچ');
  const playerAge = currentUser?.age ? `${currentUser.age} سال` : '';
  const playerPosition = currentUser?.position || '';

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
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] ring-2 ring-background" />
            )}
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

              <div className="space-y-2.5 text-right max-h-[60vh] overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    هیچ اعلان یا پیامی برای نمایش وجود ندارد.
                  </div>
                ) : (
                  notifications.map((n) => {
                    const badgeColor =
                      n.type === 'training'
                        ? 'text-emerald-400'
                        : n.type === 'nutrition'
                        ? 'text-amber-400'
                        : n.type === 'urgent'
                        ? 'text-rose-400'
                        : 'text-sky-400';
                    return (
                      <div
                        key={n.id}
                        className="p-3 rounded-2xl bg-muted/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/10"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold ${badgeColor}`}>
                            {n.type === 'training'
                              ? 'تمرینی'
                              : n.type === 'nutrition'
                              ? 'تغذیه'
                              : n.type === 'urgent'
                              ? 'فوری'
                              : 'سیستمی'}
                          </span>
                          <h4 className="text-xs font-black">{n.title}</h4>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          1. ITEM 1: PROFILE BANNER
          - تصویر کراپ‌شده card_banner_profile.webp بدون حاشیه مشکی
          - موقعیت متن نام و مشخصات بازیکن به سمت چپ‌تر منتقل شده تا از دکمه فاصله بگیرد
          ========================================================================= */}
      <div className="w-full mb-2 sm:mb-2.5">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            triggerHaptic();
            navigate('/settings');
          }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          title="مشاهده پروفایل کاربری"
        >
          <img
            src="/dashboard-cards/card_banner_profile.webp"
            alt="پروفایل بازیکن"
            className="w-full h-auto block select-none"
            loading="eager"
            decoding="sync"
          />

          {/* User details overlay: shifted comfortably to the left */}
          <div
            dir="rtl"
            className="absolute inset-y-0 right-[38%] sm:right-[40%] left-[10%] flex flex-col justify-center items-start text-right pointer-events-none select-none z-10"
          >
            <div className="truncate max-w-full">
              <span className="text-xs sm:text-sm md:text-base font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {playerName}
              </span>
            </div>
            {(playerAge || playerPosition) && (
              <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] md:text-xs font-bold text-emerald-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] truncate max-w-full">
                {playerAge && <span>{playerAge}</span>}
                {playerAge && playerPosition && <span className="text-emerald-500/70">•</span>}
                {playerPosition && <span className="text-emerald-300 font-extrabold">{playerPosition}</span>}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* =========================================================================
          2. ITEM 2: TACTICS & NUTRITION ROW
          - تصاویر کراپ‌شده اختصاصی و شفاف (بدون حاشیه و بک‌گراند مشکی)
          - راست: برنامه غذایی -> /nutrition
          - چپ: تخته تاکتیک -> /tactics
          - فاصله مینیمال و فشرده (gap-2)
          ========================================================================= */}
      <div className="w-full mb-2 sm:mb-2.5">
        <div dir="rtl" className="grid grid-cols-[1fr_1.16fr] gap-2 sm:gap-2.5 items-stretch">
          {/* Nutrition (Right in RTL) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              triggerHaptic();
              navigate('/nutrition');
            }}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-emerald-500/20"
            title="مشاهده برنامه غذایی"
          >
            <img
              src="/dashboard-cards/card_nutrition.webp"
              alt="برنامه غذایی"
              className="w-full h-full object-cover block select-none"
              loading="eager"
              decoding="sync"
            />
          </motion.div>

          {/* Tactics (Left in RTL) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              triggerHaptic();
              navigate('/tactics');
            }}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-emerald-500/20"
            title="ورود به تخته تاکتیک"
          >
            <img
              src="/dashboard-cards/card_tactics.webp"
              alt="تخته تاکتیک"
              className="w-full h-full object-cover block select-none"
              loading="eager"
              decoding="sync"
            />
          </motion.div>
        </div>
      </div>

      {/* =========================================================================
          3. ITEM 3: TRAINING, QUIZ & PROGRESS ROW
          - تصاویر کراپ‌شده اختصاصی و شفاف (بدون حاشیه مشکی)
          - راست: گزارش پیشرفت -> باز شدن مودال تحلیل پیشرفت
          - وسط: بازی کوییز -> /quiz
          - چپ: تمرینات و برنامه‌ها -> /practice
          ========================================================================= */}
      <div className="w-full mb-2 sm:mb-2.5">
        <div dir="rtl" className="grid grid-cols-3 gap-2 sm:gap-2.5 items-stretch">
          {/* Progress (Right in RTL) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              triggerHaptic();
              navigate('/progress');
            }}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-emerald-500/20"
            title="مشاهده گزارش و تحلیل پیشرفت"
          >
            <img
              src="/dashboard-cards/card_progress.webp"
              alt="گزارش پیشرفت"
              className="w-full h-full object-cover block select-none"
              loading="eager"
              decoding="sync"
            />
          </motion.div>

          {/* Quiz (Middle) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              triggerHaptic();
              navigate('/quiz');
            }}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-emerald-500/20"
            title="شروع بازی کوییز"
          >
            <img
              src="/dashboard-cards/card_quiz.webp"
              alt="بازی کوییز"
              className="w-full h-full object-cover block select-none"
              loading="eager"
              decoding="sync"
            />
          </motion.div>

          {/* Training (Left in RTL) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              triggerHaptic();
              navigate('/practice');
            }}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-emerald-500/20"
            title="مشاهده برنامه تمرینات"
          >
            <img
              src="/dashboard-cards/card_training.webp"
              alt="تمرینات و برنامه‌ها"
              className="w-full h-full object-cover block select-none"
              loading="eager"
              decoding="sync"
            />
          </motion.div>
        </div>
      </div>

      {/* =========================================================================
          4. ITEM 4: MESSAGES & HEALTH STATUS ROW
          - تصاویر کراپ‌شده اختصاصی و شفاف (بدون حاشیه مشکی)
          - راست: وضعیت خواب و سلامت -> باز شدن مودال
          - چپ: پیام‌ها و اطلاعیه‌ها -> باز شدن مودال
          ========================================================================= */}
      <div className="w-full mb-2 sm:mb-2.5">
        <div dir="rtl" className="grid grid-cols-2 gap-2 sm:gap-2.5 items-stretch">
          {/* Health & Sleep (Right in RTL) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              triggerHaptic();
              setIsHealthModalOpen(true);
            }}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-emerald-500/20"
            title="مشاهده جزئیات خواب و سلامت"
          >
            <img
              src="/dashboard-cards/card_health.webp"
              alt="وضعیت خواب و سلامت"
              className="w-full h-full object-cover block select-none"
              loading="eager"
              decoding="sync"
            />
          </motion.div>

          {/* Messages (Left in RTL) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              triggerHaptic();
              setIsNotifOpen(true);
            }}
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-emerald-500/20"
            title="مشاهده پیام‌ها و اطلاعیه‌ها"
          >
            <img
              src="/dashboard-cards/card_messages.webp"
              alt="پیام‌ها و اطلاعیه‌ها"
              className="w-full h-full object-cover block select-none"
              loading="eager"
              decoding="sync"
            />
          </motion.div>
        </div>
      </div>

      {/* =========================================================================
          5. ITEM 5: STUDENT PERFORMANCE REPORT BANNER
          - تصویر کراپ‌شده بدون حاشیه مشکی
          ========================================================================= */}
      <div className="w-full mb-3">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            triggerHaptic();
            setIsStudentReportModalOpen(true);
          }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          title="مشاهده گزارش عملکرد دانش‌آموز"
        >
          <img
            src="/dashboard-cards/card_student_report.webp"
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
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Moon className="h-4 w-4 text-indigo-400" />
                    خواب دیشب
                  </span>
                  {healthData?.sleepHours ? (
                    <span className="text-xs font-black text-indigo-400">
                      {healthData.sleepHours} ساعت
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      ثبت نشده
                    </span>
                  )}
                </div>

                {/* Interactive Sleep Logger Form */}
                <div className="space-y-1.5 pt-1.5 border-t border-white/10">
                  <div className="text-[11px] text-muted-foreground font-semibold flex items-center justify-between">
                    <span>ثبت ساعات خواب دیشب:</span>
                    {healthData?.sleepHours && (
                      <span className="text-emerald-400 text-[10px]">ثبت شده: {healthData.sleepHours} ساعت</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {[6, 6.5, 7, 7.5, 8, 8.5, 9].map((hr) => (
                      <button
                        key={hr}
                        type="button"
                        onClick={() => handleSaveSleep(hr)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                          healthData?.sleepHours === hr
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-white/10 text-slate-300 hover:text-white border-white/10'
                        }`}
                      >
                        {hr} ساعت
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1 border-t border-white/5">
                  <span>ضربان استراحت: {healthData?.restingHeartRate ? `${healthData.restingHeartRate} bpm` : 'پایش با ساعت هوشمند'}</span>
                  {healthData?.recoveryScore && (
                    <span className="text-emerald-400 font-bold">
                      ریکاوری: {healthData.recoveryScore}٪
                    </span>
                  )}
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
                    {waterGlasses} از {TARGET_WATER_GLASSES} لیوان ({waterGlasses * 250} ml)
                  </span>
                </div>

                {/* Glasses indicator */}
                <div className="grid grid-cols-8 gap-1.5 py-1">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        triggerHaptic();
                        updateWater(idx + 1 === waterGlasses ? idx : idx + 1);
                      }}
                      className={`h-7 rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer ${
                        idx < waterGlasses
                          ? 'bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.5)] text-white'
                          : 'bg-white/10 text-white/20 hover:bg-white/15'
                      }`}
                      title={`${(idx + 1) * 250} میلی‌لیتر`}
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
                      updateWater(Math.max(0, waterGlasses - 1));
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
                      updateWater(Math.min(16, waterGlasses + 1));
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
              {studentReportData?.overallScore ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/30 via-emerald-950/20 to-black/40 border border-purple-500/20 text-right space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{playerName}</span>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {studentReportData.reportMonth || 'ماه جاری'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
                    <div>
                      <div className="text-xs text-muted-foreground">حضور منظم</div>
                      <div className="text-base font-black text-emerald-400 mt-0.5">
                        {studentReportData.attendancePercent}٪
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">نمره عملکرد</div>
                      <div className="text-base font-black text-purple-400 mt-0.5">
                        {studentReportData.overallScore}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">انضباط تیمی</div>
                      <div className="text-base font-black text-sky-400 mt-0.5">۱۰۰٪</div>
                    </div>
                  </div>

                  {studentReportData.coachFeedback && (
                    <p className="text-[11px] text-slate-300 pt-2 border-t border-white/10 leading-relaxed">
                      «{studentReportData.coachFeedback}»
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                  <Award className="h-10 w-10 text-purple-400/60 mx-auto" />
                  <h4 className="text-xs font-black text-white">گزارش عملکرد هنوز ثبت نشده است</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    به محض ثبت ارزیابی فنی و انضباطی پایان ماه توسط مربی در پنل مدیریت، کارنامه و شاخص‌های فنی بازیکن در این بخش قرار می‌گیرد.
                  </p>
                </div>
              )}

              {/* Skills Radar / Bars if report exists */}
              {studentReportData?.metrics && studentReportData.metrics.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-right">
                  <h4 className="text-xs font-bold text-muted-foreground">شاخص‌های فنی بازیکن:</h4>

                  <div className="space-y-2">
                    {studentReportData.metrics.map((m: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold">
                          <span>{m.label}</span>
                          <span className="text-emerald-400">{m.score}٪ ({m.status})</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                            style={{ width: `${m.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

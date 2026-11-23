import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlanAcquisitionModal } from './PlanAcquisitionModal';
import { ActiveTrainingPlanCard } from './ActiveTrainingPlanCard';
import { getSuggestedDrills, syncSuggestedDrillsWithServer, SuggestedDrill } from '../data/freeTrainingCategories';
import { VideoModal } from '@/features/admin/components/VideoModal';
import { resolveMediaUrl } from '@/lib/api';
import { useNotifications } from '@/hooks/useNotifications';

export const PlanList: React.FC = () => {
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [initialCategoryKey, setInitialCategoryKey] = useState<string>('all');
  const [isPlanPressed, setIsPlanPressed] = useState(false);
  const [isAcquisitionOpen, setIsAcquisitionOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [suggestedDrills, setSuggestedDrills] = useState<SuggestedDrill[]>(getSuggestedDrills);

  const [activePlan, setActivePlan] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('first_touch_student_active_plans');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch {}
    return null;
  });

  useEffect(() => {
    const handlePlanUpdate = () => {
      try {
        const saved = localStorage.getItem('first_touch_student_active_plans');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setActivePlan(parsed[0]);
            return;
          }
        }
        setActivePlan(null);
      } catch {}
    };

    const handleSuggestedUpdate = () => {
      setSuggestedDrills(getSuggestedDrills());
    };

    syncSuggestedDrillsWithServer().then((drills) => {
      if (drills && drills.length > 0) {
        setSuggestedDrills(drills);
      }
    });

    window.addEventListener('ft_student_plan_updated', handlePlanUpdate);
    window.addEventListener('ft_suggested_drills_updated', handleSuggestedUpdate);
    return () => {
      window.removeEventListener('ft_student_plan_updated', handlePlanUpdate);
      window.removeEventListener('ft_suggested_drills_updated', handleSuggestedUpdate);
    };
  }, []);

  // هماهنگ‌سازی و بارگذاری همزمان تمام تصاویر صفحه بدون نمایش تکه‌تکه
  useEffect(() => {
    const imagesToLoad = [
      '/firsttouchcrop.png',
      '/glossy-profile-icon.png',
      '/neon-training-banner.png',
      '/category-1.png',
      '/category-2.png',
      '/category-3.png',
      '/category-4.png',
      '/category-5.png',
      '/training-plan-progress-card.png',
      '/drill-thumb-cones.png',
      '/drill-thumb-agility.png',
      '/drill-thumb-passing.png',
      '/pro-trophy-banner.png',
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

  const categories = [
    { id: 1, key: 'agility', title: 'چابکی', image: '/category-1.png' },
    { id: 2, key: 'strength', title: 'قدرتی', image: '/category-2.png' },
    { id: 3, key: 'speed', title: 'سرعت', image: '/category-3.png' },
    { id: 4, key: 'endurance', title: 'استقامت', image: '/category-4.png' },
    { id: 5, key: 'technique', title: 'تکنیکی', image: '/category-5.png' },
  ];

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([14]);
      } catch {}
    }
  };

  const handleCategoryClick = (cat: typeof categories[0]) => {
    triggerHaptic();
    setSelectedCategory(cat.id);
    setInitialCategoryKey(cat.key);
    setIsAcquisitionOpen(true);
  };

  return (
    <div
      className={`w-full max-w-lg mx-auto px-2 sm:px-3 pt-1 pb-32 select-none transition-opacity duration-300 ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* =========================================================================
          TOP APP BAR
          - لوگو فرست تاچ بزرگ‌تر و خوانا در سمت چپ
          - زنگوله نوتیفیکیشن با دایره فیکس
          - آیکون پروفایل سه بعدی به اندازه اعلان (کمی بزرگ‌تر) بدون هیچ کادر اضافی
          ========================================================================= */}
      <header
        dir="ltr"
        className="w-full flex items-center justify-between py-2 px-1 sm:px-2 mb-3 relative"
      >
        {/* Header Ambient Emerald Atmosphere (هاله سبز ملایم در محدوده تاپ‌بار بدون افتادن روی اسلایدر) */}
        <div
          className="absolute -top-6 -left-4 w-80 h-28 rounded-full pointer-events-none opacity-75 z-0"
          style={{
            background: 'radial-gradient(circle at 35% 45%, rgba(34, 197, 94, 0.38) 0%, rgba(16, 185, 129, 0.20) 48%, transparent 75%)',
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
          {/* تابش سبز نئونی اختصاصی دقیقاً زیر و پشت لوگوی فرست تاچ */}
          <div
            className="absolute -inset-x-5 -inset-y-3 rounded-full pointer-events-none opacity-90 z-0"
            style={{
              background: 'radial-gradient(ellipse at 45% 50%, rgba(16, 185, 129, 0.58) 0%, rgba(5, 150, 105, 0.32) 42%, rgba(4, 120, 87, 0.12) 65%, transparent 80%)',
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

          {/* 3. Pure 3D Profile Icon (دقیقاً متناسب با اعلان، با کاهش بسیار ظریف در ابعاد) */}
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

      {/* NOTIFICATIONS MODAL (z-[100] ABOVE ALL DOCKS) */}
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
                  <h3 className="text-sm font-black">اعلان‌ها و پیام‌ها</h3>
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
          NEON FOOTBALL TRAINING BANNER
          (کامل و بدون برش و بدون نصفه‌شدن - نمایش ۱۰۰٪ تصویر بنر)
          ========================================================================= */}
      <div className="w-full my-2">
        <img
          src="/neon-training-banner.png"
          alt="تمرین امروزت آماده‌ست - بهتر بازی کن، بیشتر رشد کن"
          loading="eager"
          decoding="sync"
          className="w-full h-auto rounded-2xl sm:rounded-3xl cursor-pointer"
          onClick={triggerHaptic}
        />
      </div>

      {/* =========================================================================
          TRAINING CATEGORIES (با فاصله ملایم از اسلایدر بالا)
          ========================================================================= */}
      <div className="w-full mt-4 sm:mt-5 mb-5">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 w-full">
          {categories.map((cat, index) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <motion.div
                key={cat.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => handleCategoryClick(cat)}
                className={`relative flex flex-col items-center justify-center p-0.5 sm:p-1.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                    : 'hover:bg-white/5 active:bg-white/10'
                }`}
              >
                <img
                  src={cat.image}
                  alt={`دسته‌بندی تمرینی ${index + 1}`}
                  loading="eager"
                  decoding="sync"
                  className={`w-full h-auto object-contain transition-all duration-300 select-none ${
                    isSelected
                      ? 'drop-shadow-[0_0_14px_rgba(52,211,153,0.85)] brightness-115'
                      : 'drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] hover:brightness-105'
                  }`}
                  draggable={false}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MY TRAINING PLAN PROGRESS CARD (عکس دریافت برنامه تمرینی / کارت زنده پس از دریافت)
          ========================================================================= */}
      <div className="w-full my-3 flex justify-center">
        {activePlan ? (
          <ActiveTrainingPlanCard
            activePlan={activePlan}
            onOpenDetails={() => setIsAcquisitionOpen(true)}
          />
        ) : (
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.95, rotateX: 3, rotateY: -1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => {
              triggerHaptic();
              setIsPlanPressed(true);
              setTimeout(() => setIsPlanPressed(false), 300);
              setIsAcquisitionOpen(true);
            }}
            className={`relative w-[82%] sm:w-[78%] max-w-[360px] cursor-pointer rounded-2xl sm:rounded-3xl transition-all duration-300 select-none ${
              isPlanPressed
                ? 'ring-2 ring-emerald-400/90 shadow-[0_0_30px_rgba(52,211,153,0.5)] scale-[0.97]'
                : 'hover:drop-shadow-[0_8px_20px_rgba(16,185,129,0.25)]'
            }`}
          >
            <img
              src="/training-plan-progress-card.png"
              alt="دریافت برنامه تمرینی"
              loading="eager"
              decoding="sync"
              className="w-full h-auto object-contain rounded-2xl sm:rounded-3xl drop-shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
              draggable={false}
            />
          </motion.div>
        )}
      </div>

      {/* =========================================================================
          SUGGESTED DRILLS SECTION (تمرینات پیشنهادی دقیقاً مطابق تصویر کاربر)
          - همراه با هاله سبز نئونی استادیومی در سمت چپ بالای تمرینات
          ========================================================================= */}
      <div className="relative w-full mt-6 mb-3" dir="rtl">
        {/* هاله سبز نئونی استادیومی بالای تمرینات پیشنهادی سمت چپ */}
        <div
          className="absolute -top-8 -left-8 w-64 sm:w-80 h-36 rounded-full pointer-events-none opacity-85 z-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 45%, rgba(16, 185, 129, 0.50) 0%, rgba(5, 150, 105, 0.26) 45%, rgba(4, 120, 87, 0.10) 65%, transparent 80%)',
            filter: 'blur(30px)',
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm sm:text-base font-black text-slate-100 tracking-tight">
              تمرینات پیشنهادی
            </h3>
            <span className="text-amber-400 text-sm animate-pulse">✨</span>
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-2 sm:gap-3.5 mb-6" dir="rtl">
        {suggestedDrills.map((drill) => (
          <motion.div
            key={drill.id}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={() => {
              triggerHaptic();
              setActiveVideo({
                url: resolveMediaUrl(drill.videoUrl || '/uploads/drill_agility.mp4'),
                title: drill.title,
              });
            }}
            className="group relative flex flex-col rounded-2xl sm:rounded-3xl bg-[#07160e]/90 hover:bg-[#0b2417] border border-emerald-500/20 hover:border-emerald-500/50 backdrop-blur-xl overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.4)] cursor-pointer transition-colors"
          >
            {/* Thumbnail Header with Duration Badge */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/40">
              {drill.image ? (
                <img
                  src={resolveMediaUrl(drill.image)}
                  alt={drill.title}
                  loading="eager"
                  decoding="sync"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  draggable={false}
                />
              ) : drill.videoUrl ? (
                <video
                  src={`${resolveMediaUrl(drill.videoUrl)}#t=0.5`}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : null}
              <div
                dir="ltr"
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-400"
              >
                <span>{drill.duration}</span>
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.2]" />
              </div>
            </div>

            {/* Content Body */}
            <div className="p-2 sm:p-3 flex flex-col justify-between flex-1 gap-2">
              <h4 className="text-[11px] sm:text-xs md:text-sm font-black text-white line-clamp-1 leading-snug">
                {drill.title}
              </h4>

              {/* Bottom Row: Difficulty + Action Arrow Button */}
              <div className="flex items-center justify-between mt-auto pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs text-slate-300 font-semibold">
                    {drill.difficultyLabel}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {drill.difficultyBars.map((active, idx) => (
                      <span
                        key={idx}
                        className={`w-1.5 sm:w-2 h-3 sm:h-3.5 rounded-full transition-all ${
                          active
                            ? drill.barColor === 'purple'
                              ? 'bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]'
                              : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                            : 'bg-slate-700/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Circular Arrow Button (matching screenshot) */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-emerald-400/50 bg-emerald-950/40 group-hover:bg-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:text-white transition-colors shrink-0">
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* =========================================================================
          PRO LEVEL TROPHY BANNER (به سطح بالاتری برس)
          ========================================================================= */}
      <div className="relative w-full mt-2 mb-8">
        {/* هاله سبز زمردی ملایم در زمینه بنر جام */}
        <div
          className="absolute -bottom-6 -right-6 w-64 h-28 rounded-full pointer-events-none opacity-65 z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.42) 0%, rgba(5, 150, 105, 0.20) 48%, transparent 75%)',
            filter: 'blur(30px)',
          }}
        />

        <motion.div
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          onClick={triggerHaptic}
          className="relative z-10 w-full cursor-pointer rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
        >
          <img
            src="/pro-trophy-banner.png"
            alt="به سطح بالاتری برس - با برنامه‌های حرفه‌ای First Touch"
            loading="eager"
            decoding="sync"
            className="w-full h-auto object-contain rounded-3xl"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* 3-Line Liquid Glass Plan Acquisition Modal */}
      {isAcquisitionOpen && (
        <PlanAcquisitionModal
          isOpen={isAcquisitionOpen}
          onClose={() => setIsAcquisitionOpen(false)}
          mode="training"
          initialCategoryKey={initialCategoryKey}
          onPlanActivated={(newPlan) => {
            try {
              const active = [newPlan];
              localStorage.setItem('first_touch_student_active_plans', JSON.stringify(active));
              window.dispatchEvent(new Event('ft_student_plan_updated'));
            } catch {}
          }}
        />
      )}
      {/* Video Modal Player */}
      {activeVideo && (
        <VideoModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          videoUrl={resolveMediaUrl(activeVideo.url)}
          title={activeVideo.title}
        />
      )}
    </div>
  );
};

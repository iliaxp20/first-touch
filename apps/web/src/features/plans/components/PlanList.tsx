import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PlanList: React.FC = () => {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isPlanPressed, setIsPlanPressed] = useState(false);

  const categories = [
    { id: 1, image: '/category-1.png' },
    { id: 2, image: '/category-2.png' },
    { id: 3, image: '/category-3.png' },
    { id: 4, image: '/category-4.png' },
    { id: 5, image: '/category-5.png' },
  ];

  const suggestedDrills = [
    {
      id: 'drill-passing',
      title: 'پاس‌کاری دقیق',
      duration: '15 min',
      difficultyLabel: 'آسان',
      difficultyBars: [true, false, false],
      barColor: 'emerald',
      image: '/drill-thumb-passing.png',
    },
    {
      id: 'drill-agility',
      title: 'کنترل توپ در فضاهای تنگ',
      duration: '20 min',
      difficultyLabel: 'سخت',
      difficultyBars: [true, true, false],
      barColor: 'purple',
      image: '/drill-thumb-agility.png',
    },
    {
      id: 'drill-cones',
      title: 'دریبلینگ با مخروط‌ها',
      duration: '15 min',
      difficultyLabel: 'متوسط',
      difficultyBars: [true, true, false],
      barColor: 'emerald',
      image: '/drill-thumb-cones.png',
    },
  ];

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([14]);
      } catch {}
    }
  };

  const handleCategoryClick = (id: number) => {
    triggerHaptic();
    setSelectedCategory((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2 sm:px-3 pt-1 pb-32 select-none animate-in fade-in duration-300">
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
            {/* Neon Green Unread Indicator Dot */}
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] ring-2 ring-background" />
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

              <div className="p-3 rounded-2xl bg-muted/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/10 text-right">
                <h4 className="text-xs font-black">تمرین امروز شما آماده است</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  جهت شروع تمرینات تخصصی، برنامه روزانه را مشاهده کنید.
                </p>
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
        <motion.img
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          src="/neon-training-banner.png"
          alt="تمرین امروزت آماده‌ست - بهتر بازی کن، بیشتر رشد کن"
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
                onClick={() => handleCategoryClick(cat.id)}
                className={`relative flex flex-col items-center justify-center p-0.5 sm:p-1.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                    : 'hover:bg-white/5 active:bg-white/10'
                }`}
              >
                <img
                  src={cat.image}
                  alt={`دسته‌بندی تمرینی ${index + 1}`}
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
          MY TRAINING PLAN PROGRESS CARD (عکس دریافت برنامه تمرینی - کوچک‌تر و متمرکز)
          ========================================================================= */}
      <div className="w-full my-3 flex justify-center">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.95, rotateX: 3, rotateY: -1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={() => {
            triggerHaptic();
            setIsPlanPressed(true);
            setTimeout(() => setIsPlanPressed(false), 500);
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
            className="w-full h-auto object-contain rounded-2xl sm:rounded-3xl drop-shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
            draggable={false}
          />
        </motion.div>
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
            onClick={triggerHaptic}
            className="group relative flex flex-col rounded-2xl sm:rounded-3xl bg-[#07160e]/90 hover:bg-[#0b2417] border border-emerald-500/20 hover:border-emerald-500/50 backdrop-blur-xl overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.4)] cursor-pointer transition-colors"
          >
            {/* Thumbnail Header with Duration Badge */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/40">
              <img
                src={drill.image}
                alt={drill.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                draggable={false}
              />
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
            className="w-full h-auto object-contain rounded-3xl"
            draggable={false}
          />
        </motion.div>
      </div>
    </div>
  );
};

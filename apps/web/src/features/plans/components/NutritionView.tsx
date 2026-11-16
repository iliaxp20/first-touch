import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NutritionView: React.FC = () => {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isPlanPressed, setIsPlanPressed] = useState(false);

  const categories = [
    { id: 1, image: '/nutrition-cat-1.png' },
    { id: 2, image: '/nutrition-cat-2.png' },
    { id: 3, image: '/nutrition-cat-3.png' },
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
          TOP APP BAR (دقیقاً مشابه بخش تمرینات)
          - لوگوی بزرگ First Touch با تابش سبز نئونی
          - زنگوله اعلان با دایره فیکس
          - آیکون سه‌بعدی پروفایل متناسب
          ========================================================================= */}
      <header
        dir="ltr"
        className="w-full flex items-center justify-between py-2 px-1 sm:px-2 mb-4 relative"
      >
        {/* Header Ambient Emerald Atmosphere */}
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
                <h4 className="text-xs font-black">برنامه غذایی شما به‌روز است</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  میزان کالری مصرفی و آب‌رسانی روزانه خود را ثبت و پیگیری کنید.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          HEALTHY EATING NUTRITION BANNER / SLIDER
          (فقط خود تصویر اسلایدر تغذیه بدون کادر اضافه)
          ========================================================================= */}
      <div className="w-full my-2">
        <motion.img
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          src="/healthy-eating-banner.png"
          alt="برنامه تغذیه سالم و ورزشی فرست تاچ"
          className="w-full h-auto rounded-2xl sm:rounded-3xl cursor-pointer"
          onClick={triggerHaptic}
        />
      </div>

      {/* =========================================================================
          NUTRITION CATEGORIES (کراپ‌شده از تصویر ۳ تایی، همراه با انیمیشن کلیک نرم)
          ========================================================================= */}
      <div className="w-full mt-4 sm:mt-5 mb-5">
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 w-full">
          {categories.map((cat, index) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <motion.div
                key={cat.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => handleCategoryClick(cat.id)}
                className={`relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                    : 'hover:bg-white/5 active:bg-white/10'
                }`}
              >
                <img
                  src={cat.image}
                  alt={`دسته‌بندی تغذیه ${index + 1}`}
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
          NUTRITION PLAN PROGRESS CARD (دریافت برنامه غذایی - کوچک و متمرکز)
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
            src="/nutrition-plan-progress-card.png"
            alt="دریافت برنامه غذایی"
            className="w-full h-auto object-contain rounded-2xl sm:rounded-3xl drop-shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* =========================================================================
          NUTRITION PROMO SECTION (بخش پایینی بنر تغذیه)
          ========================================================================= */}
      <div className="relative w-full mt-2 mb-8">
        {/* هاله سبز زمردی ملایم در زمینه بنر */}
        <div
          className="absolute -bottom-6 -left-6 w-64 h-28 rounded-full pointer-events-none opacity-65 z-0"
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
            src="/nutrition-promo-banner.png"
            alt="برنامه جامع تغذیه ورزشی First Touch"
            className="w-full h-auto object-contain rounded-3xl"
            draggable={false}
          />
        </motion.div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PlanList: React.FC = () => {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([12]);
      } catch {}
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-1 sm:px-4 pt-1 sm:pt-3 pb-32 select-none animate-in fade-in duration-300">
      {/* =========================================================================
          TOP APP BAR
          - لوگو فرست تاچ متناسب و تراز در سمت چپ
          - زنگوله نوتیفیکیشن با دایره فیکس و بدون تغییر شکل
          - آیکون پروفایل سه بعدی
          ========================================================================= */}
      <header
        dir="ltr"
        className="w-full flex items-center justify-between py-1.5 sm:py-2 px-0.5 sm:px-2 mb-3"
      >
        {/* 1. Left side: Balanced First Touch Logo */}
        <div
          className="flex items-center shrink-0 cursor-pointer"
          onClick={() => {
            triggerHaptic();
            navigate('/');
          }}
        >
          <motion.img
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            src="/first-touch-logo.png"
            alt="فرست تاچ"
            className="h-8 sm:h-9 w-auto max-h-9 object-contain drop-shadow-[0_2px_12px_rgba(16,185,129,0.35)]"
          />
        </div>

        {/* 2 & 3. Right side: Notification Bell + Pure 3D Profile Icon */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
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

          {/* 3. Pure 3D Profile Icon (فقط خود تصویر خالص - بدون هیچ سایه، هاله سیاه یا کادر) */}
          <motion.img
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              triggerHaptic();
              navigate('/settings');
            }}
            src="/glossy-profile-icon.png"
            alt="پروفایل کاربری"
            className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 aspect-square object-contain cursor-pointer"
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
          (فقط خود تصویر - بدون هیچ کادر، بوردر، سایه یا کارد اضافه)
          ========================================================================= */}
      <div className="w-full my-2">
        <motion.img
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          src="/neon-training-banner.png"
          alt="تمرین امروزت آماده‌ست - بهتر بازی کن، بیشتر رشد کن"
          className="w-full h-auto object-cover rounded-2xl sm:rounded-3xl cursor-pointer"
          onClick={triggerHaptic}
        />
      </div>
    </div>
  );
};

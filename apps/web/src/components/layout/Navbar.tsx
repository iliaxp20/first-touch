import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Search, Bell, User, X, Dumbbell, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeRole?: 'COACH' | 'STUDENT' | 'PLAYER' | 'PARENT';
  userName?: string;
  isProfileComplete?: boolean;
  userAvatar?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName,
  userAvatar,
}) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  const displayName = userName && userName.trim() ? userName : 'کاربر گرامی';

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([12]);
      } catch {}
    }
  };

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchQuery.trim()) return;
    setIsSearchOpen(false);
    navigate(`/practice?q=${encodeURIComponent(quickSearchQuery.trim())}`);
  };

  return (
    <>
      <header className="app-top-header sticky top-0 z-40 w-full pt-4 sm:pt-6 pb-2 bg-transparent select-none transition-all duration-300">
        <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
          {/* Right side (RTL): User Profile & Time Greeting (Exactly matching reference screenshot) */}
          <Link
            to="/settings"
            onClick={triggerHaptic}
            className="flex items-center gap-3 group cursor-pointer"
            title="مشاهده حساب کاربری و تنظیمات"
          >
            {/* Circular Glass Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-full ring-2 ring-emerald-500/50 p-0.5 bg-gradient-to-br from-emerald-400/25 to-teal-500/10 shadow-[0_0_20px_rgba(52,211,153,0.3)] shrink-0 overflow-hidden"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={displayName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-emerald-950/80 flex items-center justify-center text-emerald-400">
                  <User className="h-5 w-5" />
                </div>
              )}
            </motion.div>

            {/* Greeting & Display Name Stack */}
            <div className="flex flex-col text-right">
              <span className="text-sm sm:text-base font-black text-slate-800 dark:text-white tracking-tight leading-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                وقت بخیر
              </span>
              <span className="text-xs text-slate-600 dark:text-emerald-100/70 font-semibold leading-normal mt-0.5 truncate max-w-[120px] sm:max-w-[180px]">
                {displayName}
              </span>
            </div>
          </Link>

          {/* Left side: Frosted Glass Circular Buttons (Search, Theme, Notification) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* 1. Frosted Glass Circular Search Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                triggerHaptic();
                setIsSearchOpen(true);
              }}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/80 dark:bg-emerald-950/40 hover:bg-white dark:hover:bg-emerald-900/50 backdrop-blur-xl border border-slate-200/80 dark:border-emerald-500/25 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.25)] transition-colors cursor-pointer"
              title="جستجوی سریع تمرینات و برنامه‌ها"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
            </motion.button>

            {/* 2. Frosted Glass Theme Switcher */}
            <ThemeToggle />

            {/* 3. Frosted Glass Notification Bell Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                triggerHaptic();
                setIsNotifOpen(!isNotifOpen);
              }}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/80 dark:bg-emerald-950/40 hover:bg-white dark:hover:bg-emerald-900/50 backdrop-blur-xl border border-slate-200/80 dark:border-emerald-500/25 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-white relative shadow-[0_4px_15px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.25)] transition-colors cursor-pointer"
              title="اعلان‌ها و یادآورها"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2]" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* QUICK SEARCH GLASS OVERLAY MODAL (z-[100] ABOVE ALL NAVIGATION DOCKS) */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="w-full max-w-lg rounded-3xl bg-card dark:bg-[#091b12] border border-border dark:border-emerald-500/30 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-foreground dark:text-white space-y-4"
            >
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Search className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-black text-white">جستجوی هوشمند در سامانه</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleQuickSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="جستجوی تمرین، تکنیک، سرعت، تغذیه یا مربی..."
                  value={quickSearchQuery}
                  onChange={(e) => setQuickSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full h-11 pr-11 pl-4 rounded-2xl bg-black/40 border border-emerald-500/30 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 font-bold"
                />
                <Search className="h-4 w-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </form>

              {/* Quick Suggestion Pills */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400 block">دسترسی‌های سریع:</span>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate('/practice');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/25 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Dumbbell className="h-3.5 w-3.5" />
                    <span>برنامه‌های تمرینی</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate('/tactics');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/25 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>تخته تاکتیک</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate('/rewards');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/25 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trophy className="h-3.5 w-3.5" />
                    <span>جوایز و مسابقه</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* NOTIFICATIONS GLASS OVERLAY MODAL (z-[100] ABOVE ALL NAVIGATION DOCKS) */}
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
                  <h3 className="text-sm font-black">اعلان‌ها و یادآورهای تمرین</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2.5 py-1">
                <div className="p-3 rounded-2xl bg-muted/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/10 flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div className="text-right">
                    <h4 className="text-xs font-black">برنامه تمرینی آماده شد</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">جلسه امروز شامل تمرینات تکنیک و شوت است.</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 dark:bg-white/[0.04] border border-border/60 dark:border-white/10 flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                  <div className="text-right">
                    <h4 className="text-xs font-black">یادآور هیدراتاسیون</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">ثبت مصرف آب امروز را فراموش نکنید.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

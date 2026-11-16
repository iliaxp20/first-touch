import React, { useEffect } from 'react';
import { Star, Dumbbell, Apple } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavItemKey } from './Sidebar';

interface LiquidGlassNavProps {
  activeItem?: NavItemKey;
  onSelect?: (item: NavItemKey) => void;
}

// 1. Solid Pentagonal House Icon with Door
const SolidHomeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3.2L3 10.6v9.2a1.2 1.2 0 0 0 1.2 1.2h15.6a1.2 1.2 0 0 0 1.2-1.2v-9.2L12 3.2zm2 14.6h-4v-2.2h4v2.2z" />
  </svg>
);

// 2. Football Tactics Pitch Icon (زمین فوتبال شیک، مینی‌مال و استاندارد مطابق سبک سایر آیکون‌ها)
const FootballTacticsIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* کادر مستطیل زمین با گوشه‌های نرم */}
    <rect x="4" y="2" width="16" height="20" rx="2.5" />
    {/* خط میانه زمین */}
    <line x1="4" y1="12" x2="20" y2="12" />
    {/* دایره سنتر */}
    <circle cx="12" cy="12" r="3" />
    {/* محوطه جریمه بالا */}
    <path d="M8 2v3.5h8V2" />
    {/* محوطه جریمه پایین */}
    <path d="M8 22v-3.5h8V22" />
  </svg>
);

interface NavTab {
  key: NavItemKey;
  label: string;
  persianLabel: string;
  icon: React.ElementType;
  path: string;
}

export const LiquidGlassNav: React.FC<LiquidGlassNavProps> = ({
  activeItem,
  onSelect,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // تمام عناوین کاملاً فارسی مطابق درخواست کاربر
  const tabs: NavTab[] = [
    { key: 'dashboard', label: 'خانه', persianLabel: 'خانه', icon: SolidHomeIcon, path: '/' },
    { key: 'plans', label: 'تمرینات', persianLabel: 'تمرینات', icon: Dumbbell, path: '/practice' },
    { key: 'nutrition', label: 'تغذیه', persianLabel: 'تغذیه', icon: Apple, path: '/nutrition' },
    { key: 'rewards', label: 'جوایز', persianLabel: 'جوایز', icon: Star, path: '/rewards' },
    { key: 'tactics', label: 'تاکتیک', persianLabel: 'تاکتیک', icon: FootballTacticsIcon, path: '/tactics' },
  ];

  const getCurrentActiveKey = (): NavItemKey => {
    const path = location.pathname;
    if (path === '/tactics' || path.startsWith('/tactics')) return 'tactics';
    if (path === '/practice' || path.startsWith('/plans') || path.startsWith('/exercises') || path.startsWith('/training')) return 'plans';
    if (path === '/nutrition' || path.startsWith('/diet') || path.startsWith('/meals')) return 'nutrition';
    if (path === '/rewards' || path === '/quiz') return 'rewards';
    if (path === '/settings' || path === '/profile') return 'settings';
    if (path === '/subscriptions') return 'subscriptions';
    if (activeItem) return activeItem;
    return 'dashboard';
  };

  const currentActive = getCurrentActiveKey();

  // پیش‌بارگذاری تمام تصاویر تب‌های ناوبری جهت جلوگیری از لود تکه‌تکه
  useEffect(() => {
    const assets = [
      '/firsttouchcrop.png',
      '/glossy-profile-icon.png',
      '/healthy-eating-banner.png',
      '/nutrition-cat-1.png',
      '/nutrition-cat-2.png',
      '/nutrition-cat-3.png',
      '/nutrition-plan-progress-card.png',
      '/nutrition-promo-banner.png',
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
    assets.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // بازخورد لمسی (Haptic Feedback)
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([14]);
      } catch {}
    }
  };

  const handleTabClick = (tab: NavTab) => {
    triggerHaptic();
    navigate(tab.path);
    if (onSelect) {
      onSelect(tab.key);
    }
  };

  // مخفی شدن فقط در اتاق ترسیم تاکتیک تمام‌صفحه
  if (location.pathname.startsWith('/tactics/')) {
    return null;
  }

  return (
    <nav
      className="liquid-glass-nav fixed bottom-3 sm:bottom-6 left-0 right-0 z-50 flex justify-center items-center pointer-events-none px-3 select-none"
      aria-label="ناوبری اصلی شیشه‌ای فرست تاچ"
    >
      <div
        className="pointer-events-auto relative flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-[36px] bg-white/80 dark:bg-[#030d07]/85 backdrop-blur-3xl border border-slate-200/80 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.25),0_0_30px_rgba(34,197,94,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(34,197,94,0.12)] transition-colors duration-300"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentActive === tab.key;
          const isSolidIcon = tab.key === 'dashboard';

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`relative flex items-center justify-center outline-none focus:outline-none cursor-pointer transition-all duration-300 ease-out h-12 sm:h-14 ${
                isActive
                  ? 'px-4 sm:px-5 rounded-full bg-gradient-to-r from-[#A3E635] via-[#4ADE80] to-[#22D3EE] text-slate-950 shadow-[0_4px_25px_rgba(74,222,128,0.5)] font-black'
                  : 'w-12 sm:w-14 rounded-full bg-slate-100/80 dark:bg-white/[0.08] hover:bg-slate-200/90 dark:hover:bg-white/[0.14] text-slate-700 dark:text-white/90 border border-slate-200/60 dark:border-white/15 shadow-[0_4px_15px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.4)]'
              }`}
              title={tab.persianLabel}
            >
              {/* 1. Specular Liquid Glass Top Reflection Sheen */}
              <div
                className={`absolute inset-x-1.5 top-1 h-[45%] rounded-t-full pointer-events-none ${
                  isActive
                    ? 'bg-gradient-to-b from-white/40 via-white/10 to-transparent'
                    : 'bg-gradient-to-b from-white/25 via-white/5 to-transparent'
                }`}
              />

              {/* 2. Chromatic Refraction Glow on Tactics */}
              {tab.key === 'tactics' && !isActive && (
                <div className="absolute -bottom-1 inset-x-2 h-3.5 rounded-b-full bg-gradient-to-t from-rose-500/35 via-amber-500/20 to-transparent blur-[2px] pointer-events-none" />
              )}

              {/* 3. Icon & Stable Label (با تفکیک آیکون‌های توپر و خطی تا هرگز توپر مشکی نشوند) */}
              <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 shrink-0">
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <Icon
                    className={`h-5.5 w-5.5 sm:h-6 sm:w-6 transition-colors shrink-0 ${
                      isActive
                        ? isSolidIcon
                          ? 'text-slate-950 fill-current'
                          : 'text-slate-950 stroke-[2.4] fill-none'
                        : isSolidIcon
                        ? 'text-slate-700 dark:text-white/90 fill-current'
                        : 'text-slate-700 dark:text-white/90 stroke-[1.8] fill-none'
                    }`}
                  />
                </div>
                {isActive && (
                  <span
                    className="text-xs sm:text-sm font-black text-slate-950 whitespace-nowrap tracking-tight select-none animate-in fade-in duration-200"
                  >
                    {tab.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

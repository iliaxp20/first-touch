import React from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { Home, Compass, CalendarCheck2, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavItemKey } from './Sidebar';

interface LiquidGlassNavProps {
  activeItem?: NavItemKey;
  onSelect?: (item: NavItemKey) => void;
}

interface NavTab {
  key: NavItemKey;
  label: string;
  icon: React.ElementType;
  path: string;
}

export const LiquidGlassNav: React.FC<LiquidGlassNavProps> = ({
  activeItem,
  onSelect,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs: NavTab[] = [
    { key: 'dashboard', label: 'داشبورد', icon: Home, path: '/' },
    { key: 'tactics', label: 'تخته تاکتیک', icon: Compass, path: '/tactics' },
    { key: 'plans', label: 'تمرینات', icon: CalendarCheck2, path: '/practice' },
    { key: 'settings', label: 'حساب من', icon: User, path: '/settings' },
  ];

  const getCurrentActiveKey = (): NavItemKey => {
    const path = location.pathname;
    if (path === '/tactics') return 'tactics';
    if (path === '/practice' || path.startsWith('/plans') || path.startsWith('/exercises')) return 'plans';
    if (path === '/settings' || path === '/profile') return 'settings';
    if (path === '/subscriptions') return 'subscriptions';
    if (activeItem) return activeItem;
    return 'dashboard';
  };

  const currentActive = getCurrentActiveKey();

  const handleTabClick = (tab: NavTab) => {
    navigate(tab.path);
    if (onSelect) {
      onSelect(tab.key);
    }
  };

  return (
    <nav
      className="liquid-glass-nav fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex justify-center items-center pointer-events-none px-4 select-none"
      aria-label="ناوبری اصلی اپلیکیشن فرست تاچ"
    >
      <LayoutGroup id="bottomNavGroup">
        {/* Outer Apple VisionOS / iOS Liquid Glass Capsule */}
        <motion.div
          className="pointer-events-auto relative flex items-center p-1.5 rounded-full overflow-hidden backdrop-blur-2xl bg-white/90 dark:bg-[#120e24]/90 border border-white/80 dark:border-white/15 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.06),inset_0_1.5px_1px_rgba(255,255,255,0.95)] dark:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.85),inset_0_1.5px_1.5px_rgba(255,255,255,0.18),inset_0_-1.5px_2px_rgba(0,0,0,0.5)] transition-all duration-300"
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        >
          <div className="flex items-center gap-1 sm:gap-1.5 relative">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentActive === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabClick(tab)}
                  className={`relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-full flex flex-col items-center justify-center transition-colors duration-200 min-w-[4.6rem] sm:min-w-[5.2rem] outline-none focus:outline-none cursor-pointer ${
                    isActive
                      ? 'text-purple-800 dark:text-purple-200 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-semibold'
                  }`}
                >
                  {/* Fluid Sliding Droplet Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="liquidNavPill"
                      className="absolute inset-0 rounded-full bg-purple-100/90 dark:bg-purple-900/40 border border-purple-200/90 dark:border-purple-500/30 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.8),0_4px_12px_-2px_rgba(124,58,237,0.18)] dark:shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.5)] -z-0"
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 32,
                        mass: 0.7,
                      }}
                    />
                  )}

                  {/* Icon & Label */}
                  <motion.div
                    className="relative z-10 flex flex-col items-center justify-center gap-1"
                    animate={{
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Icon
                      className={`h-5 w-5 transition-colors duration-200 ${
                        isActive
                          ? 'text-purple-700 dark:text-purple-300 stroke-[2.4]'
                          : 'text-slate-600 dark:text-slate-400 stroke-[1.8]'
                      }`}
                    />
                    <span
                      className={`text-[0.72rem] tracking-tight leading-none transition-colors duration-200 ${
                        isActive
                          ? 'text-purple-800 dark:text-purple-200 font-black'
                          : 'text-slate-600 dark:text-slate-400 font-semibold'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </motion.div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </LayoutGroup>
    </nav>
  );
};

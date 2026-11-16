import React from 'react';
import { Navbar } from './Navbar';
import { NavItemKey } from './Sidebar';
import { LiquidGlassNav } from './LiquidGlassNav';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
  activeItem?: NavItemKey;
  onSelectNavItem?: (item: NavItemKey) => void;
  activeRole?: 'COACH' | 'STUDENT' | 'PARENT' | 'PLAYER';
  userName?: string;
  isProfileComplete?: boolean;
  userAvatar?: string;
  hideNavbar?: boolean;
  hideBottomNav?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeItem,
  onSelectNavItem,
  activeRole,
  userName,
  isProfileComplete,
  userAvatar,
  hideNavbar,
  hideBottomNav,
}) => {
  const auth = useAuth();
  const location = useLocation();

  const isPracticePage = location.pathname === '/practice' || location.pathname.startsWith('/plans');
  const isNutritionPage = location.pathname === '/nutrition' || location.pathname.startsWith('/diet') || location.pathname.startsWith('/meals');
  const isTacticsActiveRoom = location.pathname.startsWith('/tactics/');
  const shouldHideNavbar = hideNavbar ?? (isTacticsActiveRoom || isPracticePage || isNutritionPage);
  const shouldHideBottomNav = hideBottomNav ?? isTacticsActiveRoom;

  const effectiveRole = activeRole ?? auth.currentUser?.role ?? 'PLAYER';
  const effectiveName = userName ?? auth.currentUser?.fullName ?? 'کاربر گرامی';
  const effectiveProfileComplete = isProfileComplete ?? auth.currentUser?.isProfileComplete ?? false;
  const effectiveAvatar = userAvatar ?? auth.currentUser?.avatarUrl;

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-[#030d07] text-foreground transition-colors duration-200 relative overflow-x-hidden">
      {/* Stadium Floodlight Green Luminous Atmosphere (روی صفحات تمرین و تغذیه غیرفعال تا رنگ تداخل نداشته باشد) */}
      {!isPracticePage && !isNutritionPage && (
        <>
          <div 
            className="fixed -top-28 left-1/2 -translate-x-1/2 w-[650px] sm:w-[950px] h-[500px] sm:h-[620px] rounded-full pointer-events-none z-0 opacity-20 dark:opacity-100 transition-opacity"
            style={{
              background: 'radial-gradient(circle at 50% 35%, rgba(16, 185, 129, 0.45) 0%, rgba(5, 150, 105, 0.30) 32%, rgba(4, 120, 87, 0.16) 55%, transparent 75%)',
              filter: 'blur(50px)',
            }}
          />
          <div 
            className="fixed top-0 inset-x-0 h-96 pointer-events-none z-0 opacity-25 dark:opacity-100 transition-opacity"
            style={{
              background: 'radial-gradient(ellipse 95% 65% at 50% -10%, rgba(34, 197, 94, 0.30) 0%, rgba(16, 185, 129, 0.15) 42%, transparent 75%)',
            }}
          />
        </>
      )}

      {/* Top Navbar */}
      {!shouldHideNavbar && (
        <Navbar
          activeRole={effectiveRole}
          userName={effectiveName}
          isProfileComplete={effectiveProfileComplete}
          userAvatar={effectiveAvatar}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <main
          className={`flex-1 overflow-y-auto ${
            shouldHideBottomNav ? 'p-2 sm:p-4 pb-4' : 'p-4 sm:p-6 lg:p-8 pb-32'
          }`}
        >
          <div className={shouldHideNavbar ? 'w-full' : 'mx-auto max-w-7xl'}>
            {children}
          </div>
        </main>
      </div>

      {/* Floating Liquid Glass Navigation Bar */}
      {!shouldHideBottomNav && (
        <LiquidGlassNav
          activeItem={activeItem}
          onSelect={onSelectNavItem}
        />
      )}
    </div>
  );
};

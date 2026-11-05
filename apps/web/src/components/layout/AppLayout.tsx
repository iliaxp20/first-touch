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

  const isTacticsActiveRoom = location.pathname.startsWith('/tactics/');
  const shouldHideNavbar = hideNavbar ?? isTacticsActiveRoom;
  const shouldHideBottomNav = hideBottomNav ?? isTacticsActiveRoom;

  const effectiveRole = activeRole ?? auth.currentUser?.role ?? 'PLAYER';
  const effectiveName = userName ?? auth.currentUser?.fullName ?? 'کاربر گرامی';
  const effectiveProfileComplete = isProfileComplete ?? auth.currentUser?.isProfileComplete ?? false;
  const effectiveAvatar = userAvatar ?? auth.currentUser?.avatarUrl;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100/70 via-slate-50 to-violet-100/60 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/40 text-foreground transition-colors duration-200 relative overflow-x-hidden">
      {/* Ambient Flowing Light Orbs in Background */}
      <div className="fixed top-1/4 -right-20 w-80 h-80 rounded-full bg-purple-300/35 dark:bg-purple-900/20 blur-[120px] pointer-events-none animate-orb-1" />
      <div className="fixed bottom-1/4 -left-20 w-96 h-96 rounded-full bg-violet-300/30 dark:bg-violet-900/15 blur-[140px] pointer-events-none animate-orb-2" />

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

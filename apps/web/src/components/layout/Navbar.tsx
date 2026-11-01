import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Bell, User } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  activeRole?: 'COACH' | 'STUDENT' | 'PLAYER' | 'PARENT';
  userName?: string;
  isProfileComplete?: boolean;
  userAvatar?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole = 'PLAYER',
  userName,
  isProfileComplete = false,
  userAvatar,
}) => {
  const roleLabel =
    activeRole === 'COACH'
      ? 'بخش مربیگری'
      : activeRole === 'PARENT'
      ? 'بخش اولیا'
      : 'بخش بازیکن';

  const displayName = userName && userName.trim() ? userName : 'کاربر گرامی';
  const displayStatus = isProfileComplete ? 'پروفایل تایید شده' : 'پروفایل تکمیل‌نشده';

  return (
    <header className="app-top-header sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 select-none">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Right side (RTL): Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="لوگوی فرست تاچ"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-md select-none transition-transform hover:scale-105"
            />
            <div>
              <span className="text-lg font-black tracking-tight text-foreground block leading-tight">
                فرست تاچ
              </span>
              <span className="text-xs text-muted-foreground font-medium hidden sm:block">
                سامانه آموزش و تمرین فوتبال
              </span>
            </div>
          </div>
        </div>

        {/* Left side: Role Badge, Theme Toggle, Notifications & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {roleLabel}
          </div>

          <ThemeToggle />

          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
          </Button>

          <div className="flex items-center gap-2 border-r border-border pr-2 sm:pr-3 mr-1">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border overflow-hidden">
              {userAvatar ? (
                <img src={userAvatar} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold leading-none text-foreground">{displayName}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{displayStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

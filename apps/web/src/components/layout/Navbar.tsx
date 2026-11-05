import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Bell, User, ChevronLeft } from 'lucide-react';
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
  userAvatar,
}) => {
  const roleLabel =
    activeRole === 'COACH'
      ? 'بخش مربیگری'
      : activeRole === 'PARENT'
      ? 'بخش اولیا'
      : 'بخش بازیکن';

  const displayName = userName && userName.trim() ? userName : 'کاربر گرامی';

  return (
    <header className="app-top-header sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 select-none">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Right side (RTL): Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 select-none group cursor-pointer">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="لوگوی فرست تاچ"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-md select-none transition-transform group-hover:scale-105"
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
        </Link>

        {/* Left side: Role Badge, Theme Toggle, Notifications & My Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {roleLabel}
          </div>

          <ThemeToggle />

          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
          </Button>

          {/* My Account (حساب من) Link - Replacing static profile status */}
          <Link
            to="/settings"
            className="flex items-center gap-2 sm:gap-2.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-muted/50 hover:bg-muted border border-border/70 hover:border-border transition-all group cursor-pointer"
            title="ورود به حساب من و تنظیمات"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/25 overflow-hidden group-hover:scale-105 transition-transform shrink-0">
              {userAvatar ? (
                <img src={userAvatar} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors block leading-tight">
                حساب من
              </span>
              <p className="text-[10px] text-muted-foreground font-semibold leading-none mt-0.5 truncate max-w-[90px] sm:max-w-[120px]">
                {displayName}
              </p>
            </div>
            <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:-translate-x-0.5 shrink-0 hidden sm:block" />
          </Link>
        </div>
      </div>
    </header>
  );
};

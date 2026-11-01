import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { NavItemKey } from './components/layout/Sidebar';
import { TacticsBoard } from './features/tactics/components/TacticsBoard';
import { PlanList } from './features/plans/components/PlanList';
import { SubscriptionCard } from './features/subscriptions/components/SubscriptionCard';
import { AuthScreen, UserRole } from './features/auth/components/AuthScreen';
import { ProfileCompletionModal } from './features/profile/components/ProfileCompletionModal';
import { SecretAdminPortal } from './features/admin/SecretAdminPortal';
import { FootballCustomCursor } from './components/ui/FootballCustomCursor';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Activity, Users, Trophy, ArrowUpRight, Sparkles, ShieldAlert, Lock, LogOut } from 'lucide-react';

interface AuthUser {
  phoneNumber: string;
  role: UserRole;
  isProfileComplete: boolean;
  fullName?: string;
  avatarUrl?: string;
}

// Reusable Locked View with Clean Subtle Dimming
const LockedFeatureView: React.FC<{
  title: string;
  description: string;
  isUnlocked: boolean;
  onUnlockClick: () => void;
  children: React.ReactNode;
}> = ({ title, description, isUnlocked, onUnlockClick, children }) => {
  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-[520px] rounded-3xl overflow-hidden border border-purple-200/60 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50">
      {/* Background content gently dimmed without smudged muddy blur */}
      <div className="opacity-25 pointer-events-none select-none filter blur-[1.5px] scale-[0.99] transition-all duration-300">
        {children}
      </div>

      {/* Modern Clean Floating Lock Centerpiece */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-gradient-to-b from-white/70 via-purple-50/60 to-white/80 dark:from-slate-950/75 dark:via-purple-950/40 dark:to-slate-950/80">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 text-center shadow-xl shadow-purple-950/10 dark:shadow-black/60 space-y-4">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300 flex items-center justify-center shadow-sm">
            <Lock className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={onUnlockClick}
            className="w-full h-11 text-xs font-black rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            تکمیل پروفایل و فعال‌سازی قابلیت
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardView: React.FC<{
  onNavigate: (key: NavItemKey) => void;
  isProfileComplete: boolean;
  fullName?: string;
  onOpenProfileModal: () => void;
}> = ({ onNavigate, isProfileComplete, fullName, onOpenProfileModal }) => {
  const displayName = fullName && fullName.trim() ? fullName : 'کاربر گرامی';

  // Real Active Plans State (NO MOCK DATA)
  const [activePlans] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('first_touch_student_active_plans');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.filter((p: any) => p && p.id !== 'prog-active-1') : [];
      }
    } catch {
      // Ignored
    }
    return [];
  });

  const totalCompletedSessions = activePlans.reduce(
    (acc, p) => acc + (p.completedSessions || 0),
    0
  );
  const activeProgram = activePlans[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Profile Completion Warning Banner */}
      {!isProfileComplete && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-100/90 via-violet-50/80 to-white/90 dark:from-purple-950/60 dark:via-slate-900/90 dark:to-slate-950/90 border-2 border-purple-300/80 dark:border-purple-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-purple-900/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                برای استفاده از تمام قابلیت‌ها پروفایل خود را تکمیل کنید
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ثبت اطلاعات فردی، قد، وزن، دور بازو، دور ساق و سابقه تمرینی جهت مشاهده توسط مربی
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenProfileModal}
            className="px-4 py-2 text-xs font-black rounded-xl shrink-0 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            تکمیل پروفایل و اطلاعات بدنی
          </button>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-violet-700 to-indigo-800 dark:from-purple-900 dark:via-purple-950 dark:to-indigo-950 p-6 sm:p-8 text-white shadow-xl shadow-purple-900/15">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>سامانه تخصصی فرست تاچ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight">
            {isProfileComplete
              ? `خوش آمدید ${displayName}، روز تمرینی پرانرژی داشته باشید`
              : `خوش آمدید ${displayName}، به سامانه آموزش فرست تاچ`}
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            {isProfileComplete
              ? 'پروفایل ورزشی شما تایید گردید. برنامه‌های تمرینی اختصاصی لمس اول و تخته تاکتیک آماده استفاده شماست.'
              : 'برای ارزیابی و صدور برنامه تمرینی اختصاصی، آزمون لمس اول و اتصال به کارتابل مربی، لطفاً ابتدا پروفایل ورزشی خود را تکمیل فرمایید.'}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {isProfileComplete ? (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('plans')}
                  className="px-5 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-white/90 text-sm font-black shadow-md transition-all cursor-pointer"
                >
                  مشاهده تمرینات اختصاصی
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('tactics')}
                  className="px-5 py-2.5 rounded-xl border border-white/40 text-white hover:bg-white/10 text-sm font-semibold transition-all cursor-pointer"
                >
                  تخته تاکتیک مربی
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenProfileModal}
                className="px-5 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-white/90 text-sm font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-purple-600" />
                تکمیل مشخصات ورزشی و بدنی
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/90 dark:bg-slate-900/90 border-purple-200/70 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">وضعیت اشتراک</span>
            <Trophy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-2">عضو فعال آکادمی</p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">۲۸ روز تا تمدید</span>
        </Card>

        <Card className="p-4 bg-white/90 dark:bg-slate-900/90 border-purple-200/70 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">امتیاز لمس اول</span>
            <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">۸۸ از ۱۰۰</p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">۱۲ درصد پیشرفت این ماه</span>
        </Card>

        <Card className="p-4 bg-white/90 dark:bg-slate-900/90 border-purple-200/70 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">تمرینات تکمیل شده</span>
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {totalCompletedSessions} جلسه
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {activePlans.length > 0 ? `${activePlans.length} برنامه فعال` : 'هنوز دوره‌ای آغاز نشده'}
          </span>
        </Card>

        <Card className="p-4 bg-white/90 dark:bg-slate-900/90 border-purple-200/70 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">مربی اختصاصی</span>
            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-base font-black text-slate-900 dark:text-white mt-2">
            {activeProgram?.coachName || (isProfileComplete ? 'در انتظار انتخاب برنامه' : 'نیازمند تکمیل پروفایل')}
          </p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            {activeProgram ? 'دوره فعال' : 'بدون مربی فعال'}
          </span>
        </Card>
      </div>

      {/* Quick Interactive Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/90 dark:bg-slate-900/90 border-purple-200/70 dark:border-white/10 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-slate-900 dark:text-white">
                  {activeProgram ? `جلسات برنامه: ${activeProgram.title}` : 'جلسات تمرینی فعال'}
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  {activeProgram ? activeProgram.goal : 'برنامه‌های تمرینی پس از انتخاب و دریافت در این بخش نمایش داده می‌شوند'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('plans')} className="text-xs gap-1 text-purple-600 dark:text-purple-400 cursor-pointer">
                {activeProgram ? 'مشاهده همه' : 'دریافت برنامه'} <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeProgram && activeProgram.schedule && activeProgram.schedule[0] ? (
              <div className="space-y-3">
                {activeProgram.schedule[0].sessions.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-purple-100 dark:border-white/5 bg-purple-50/40 dark:bg-purple-950/25 hover:bg-purple-50/70 dark:hover:bg-purple-950/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-black flex items-center justify-center text-xs">
                        {item.dayName || idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">تمرکز: {item.focus}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-purple-700 dark:text-purple-300 shadow-2xs">
                        {item.durationMinutes} دقیقه
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-purple-200 dark:border-slate-800 text-center space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  هنوز برنامه تمرینی فعالی دریافت نکرده‌اید. با کلیک بر روی دکمه زیر می‌توانید برنامه ساده رایگان، برنامه آماده رده سنی یا اختصاصی با مربی را انتخاب کنید.
                </p>
                <Button
                  variant="primary"
                  onClick={() => onNavigate('plans')}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black cursor-pointer"
                >
                  ورود به بخش برنامه‌ها و دریافت برنامه
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Col: Schedule */}
        <Card className="bg-white/90 dark:bg-slate-900/90 border-purple-200/70 dark:border-white/10 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">جلسات حضوری و وبینارها</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">تقویم مسابقات آکادمی</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { day: 'چهارشنبه', title: 'تمرین چمن تیم الف', time: '۱۷:۰۰ - ۱۸:۳۰', field: 'زمین شماره ۱' },
              { day: 'پنج‌شنبه', title: 'تحلیل ویدیویی لمس اول با مربی', time: '۲۰:۰۰ - ۲۱:۰۰', field: 'اتاق مجازی' },
              { day: 'جمعه', title: 'مسابقه تست استعدادیابی', time: '۱۰:۰۰ صبح', field: 'ورزشگاه آزادی' },
            ].map((event, i) => (
              <div key={i} className="p-3 rounded-xl border border-purple-100 dark:border-white/5 bg-purple-50/40 dark:bg-purple-950/25">
                <div className="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">
                  <span>{event.day}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-normal">{event.time}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{event.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.field}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export function App() {
  // Persistent Login state from localStorage
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('first_touch_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeItem, setActiveItem] = useState<NavItemKey>('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSecretAdminOpen, setIsSecretAdminOpen] = useState(false);

  // Hidden stealth access for Secret Admin (via secret URL param, hash or Ctrl+Alt+Shift+A)
  useEffect(() => {
    const checkSecretRoute = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (
        urlParams.get('secret_admin') === 'ft-console-secure-x99' ||
        window.location.hash === '#ft-secret-terminal'
      ) {
        setIsSecretAdminOpen(true);
      }
    };

    checkSecretRoute();
    window.addEventListener('hashchange', checkSecretRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Key: Ctrl + Shift + Alt + A
      if (e.ctrlKey && e.shiftKey && e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ش')) {
        e.preventDefault();
        setIsSecretAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkSecretRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sync auth state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('first_touch_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('first_touch_auth_user');
    }
  }, [currentUser]);

  // If user is not logged in, show AuthScreen
  if (!currentUser) {
    return (
      <ThemeProvider>
        <FootballCustomCursor />
        <AuthScreen
          onLoginSuccess={(user) => {
            setCurrentUser({
              ...user,
              isProfileComplete: user.isProfileComplete || false,
              fullName: user.fullName || 'کاربر گرامی',
            });
          }}
        />
        <SecretAdminPortal
          isOpen={isSecretAdminOpen}
          onClose={() => setIsSecretAdminOpen(false)}
        />
      </ThemeProvider>
    );
  }

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('first_touch_auth_user');
  };

  return (
    <ThemeProvider>
      <AppLayout
        activeItem={activeItem}
        onSelectNavItem={setActiveItem}
        activeRole={currentUser.role}
        userName={currentUser.fullName || 'کاربر گرامی'}
        isProfileComplete={currentUser.isProfileComplete}
        userAvatar={currentUser.avatarUrl}
      >
        {activeItem === 'dashboard' && (
          <DashboardView
            onNavigate={setActiveItem}
            isProfileComplete={currentUser.isProfileComplete}
            fullName={currentUser.fullName}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* Tactics Board with Blur Lock when profile is incomplete */}
        {activeItem === 'tactics' && (
          <LockedFeatureView
            title="تخته تاکتیک مربیگری قفل است"
            description="برای دسترسی به تخته تاکتیک، تحلیل چیدمان و ارسال تمرینات، ابتدا پروفایل و شاخص‌های فیزیکی خود را تکمیل نمایید."
            isUnlocked={currentUser.isProfileComplete}
            onUnlockClick={() => setIsProfileModalOpen(true)}
          >
            <TacticsBoard />
          </LockedFeatureView>
        )}

        {/* Training Plans with Blur Lock when profile is incomplete */}
        {activeItem === 'plans' && (
          <LockedFeatureView
            title="برنامه‌های تمرینی غیرفعال است"
            description="برنامه‌های تمرینی اختصاصی پس از ثبت قد، وزن و اندازه‌گیری‌های فیزیکی برای شما فعال و صادر می‌گردد."
            isUnlocked={currentUser.isProfileComplete}
            onUnlockClick={() => setIsProfileModalOpen(true)}
          >
            <PlanList />
          </LockedFeatureView>
        )}

        {/* Subscriptions with Blur Lock when profile is incomplete */}
        {activeItem === 'subscriptions' && (
          <LockedFeatureView
            title="خرید و تمدید اشتراک نیازمند ثبت مشخصات است"
            description="جهت صدور فاکتور و اتصال به مربی اختصاصی، ثبت مشخصات ورزشی الزامی است."
            isUnlocked={currentUser.isProfileComplete}
            onUnlockClick={() => setIsProfileModalOpen(true)}
          >
            <SubscriptionCard />
          </LockedFeatureView>
        )}

        {activeItem === 'settings' && (
          <div className="max-w-xl mx-auto space-y-6">
            <Card className="p-6 bg-white/90 dark:bg-slate-900/90 border-purple-200/80 dark:border-white/10 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">تنظیمات حساب کاربری</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">نام کاربر:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentUser.fullName || 'کاربر گرامی'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">شماره موبایل / شناسه:</span>
                  <span className="font-bold dir-ltr text-slate-900 dark:text-white">{currentUser.phoneNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">نقش کاربری:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {currentUser.role === 'PLAYER' ? 'بازیکن (شاگرد)' : currentUser.role === 'COACH' ? 'مربی' : 'اولیا'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">وضعیت تکمیل پروفایل:</span>
                  <span className={`font-bold ${currentUser.isProfileComplete ? 'text-purple-600 dark:text-purple-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {currentUser.isProfileComplete ? 'تکمیل شده و تایید' : 'در انتظار تکمیل'}
                  </span>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-3">
                {!currentUser.isProfileComplete && (
                  <Button
                    variant="primary"
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    تکمیل اطلاعات پروفایل
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex-1 border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  خروج از حساب کاربری
                </Button>
              </div>
            </Card>
          </div>
        )}
      </AppLayout>

      {/* Multi-Step Profile Completion Wizard Modal */}
      <ProfileCompletionModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onComplete={(profileData) => {
          setCurrentUser((prev) =>
            prev
              ? {
                  ...prev,
                  isProfileComplete: true,
                  fullName: profileData.fullName || 'کاربر گرامی',
                  avatarUrl: profileData.avatarUrl,
                }
              : null
          );
          setIsProfileModalOpen(false);
        }}
      />

      {/* Secret Stealth Admin Console (Hidden from public) */}
      <SecretAdminPortal
        isOpen={isSecretAdminOpen}
        onClose={() => setIsSecretAdminOpen(false)}
      />

      {/* Football Tactical Custom Cursor */}
      <FootballCustomCursor />
    </ThemeProvider>
  );
}

export default App;

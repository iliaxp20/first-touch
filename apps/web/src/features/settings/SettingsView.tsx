import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LogOut, Edit3, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAgeGroupFromAge } from '../plans/data/readyProgramsStore';

export const SettingsView: React.FC = () => {
  const { currentUser, logout, setIsProfileModalOpen } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const userAgeGroup = getAgeGroupFromAge(currentUser.age);

  return (
    <div className="max-w-xl mx-auto space-y-6 select-none animate-in fade-in duration-200">
      <Card className="p-6 bg-card border border-border/80 shadow-sm rounded-3xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 overflow-hidden">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="h-full w-full object-cover" />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground">
                {currentUser.fullName || 'کاربر گرامی'}
              </h2>
              <p className="text-xs text-muted-foreground font-semibold">
                {currentUser.role === 'PLAYER'
                  ? 'بازیکن فوتبال'
                  : currentUser.role === 'COACH'
                  ? 'مربی اختصاصی'
                  : 'اولیا'}
              </p>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 ${
              currentUser.isProfileComplete
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
            }`}
          >
            {currentUser.isProfileComplete ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>پروفایل تکمیل شده</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                <span>نیاز به تکمیل اطلاعات</span>
              </>
            )}
          </div>
        </div>

        {/* Profile Info Details List */}
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">نام و نام خانوادگی:</span>
            <span className="font-bold text-foreground">
              {currentUser.fullName || 'ثبت نشده'}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">شماره تماس:</span>
            <span className="font-bold dir-ltr font-mono text-foreground">
              {currentUser.phoneNumber}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">کد ملی:</span>
            <span className="font-bold font-mono text-foreground">
              {currentUser.nationalId || 'ثبت نشده'}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">سن و رده سنی:</span>
            <span className="font-bold text-foreground">
              {currentUser.age ? `${currentUser.age} سال (${userAgeGroup})` : 'ثبت نشده'}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">قد و وزن:</span>
            <span className="font-bold text-foreground">
              {currentUser.height && currentUser.weight
                ? `${currentUser.height} سانتی‌متر • ${currentUser.weight} کیلوگرم`
                : 'ثبت نشده'}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">پست و پای تخصصی:</span>
            <span className="font-bold text-foreground">
              {currentUser.position || 'هافبک'} • پای {currentUser.preferredFoot || 'راست'}
            </span>
          </div>
        </div>

        {/* Actions Button Bar */}
        <div className="pt-3 flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs h-11 rounded-2xl gap-2 shadow-sm"
          >
            <Edit3 className="h-4 w-4" />
            <span>ویرایش و تغییر اطلاعات پروفایل</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-black h-11 rounded-2xl gap-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>خروج از حساب</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

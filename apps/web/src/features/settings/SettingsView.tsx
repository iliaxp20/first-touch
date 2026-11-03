import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SettingsView: React.FC = () => {
  const { currentUser, logout, setIsProfileModalOpen } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card className="p-6 bg-white/90 dark:bg-slate-900/90 border-purple-200/80 dark:border-white/10 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">تنظیمات حساب کاربری</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">نام کاربر:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currentUser.fullName || 'کاربر گرامی'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">شماره موبایل / شناسه:</span>
            <span className="font-bold dir-ltr text-slate-900 dark:text-white">
              {currentUser.phoneNumber}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">نقش کاربری:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {currentUser.role === 'PLAYER'
                ? 'بازیکن (شاگرد)'
                : currentUser.role === 'COACH'
                ? 'مربی'
                : 'اولیا'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">وضعیت تکمیل پروفایل:</span>
            <span
              className={`font-bold ${
                currentUser.isProfileComplete
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
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
            className="flex-1 border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            خروج از حساب کاربری
          </Button>
        </div>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Phone, KeyRound, User, Lock, Shield, Award, Users, ChevronLeft } from 'lucide-react';

export type UserRole = 'PLAYER' | 'COACH' | 'PARENT';

interface AuthScreenProps {
  onLoginSuccess: (user: { token?: string; phoneNumber: string; role: UserRole; isProfileComplete: boolean; fullName?: string }) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [authStep, setAuthStep] = useState<'otp-request' | 'otp-verify' | 'password-login' | 'role-selection'>('otp-request');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [otp, setOtp] = useState('');
  const [testOtpNotice, setTestOtpNotice] = useState<string | null>(null);
  const [verifiedToken, setVerifiedToken] = useState<string | undefined>(undefined);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('لطفاً شماره تلفن همراه معتبر وارد نمایید (مانند ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: cleanPhone, referralCode: referralCode.trim() || undefined }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'خطا در ارسال کد تایید');
      }

      if (data.testOtp) {
        setTestOtpNotice(data.testOtp);
        setOtp(data.testOtp);
      }
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط با سرویس پیامک');
    } finally {
      setLoading(false);
      setAuthStep('otp-verify');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length < 4) {
      setError('کد تایید وارد شده معتبر نیست (حداقل ۵ رقم)');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim(), otp: cleanOtp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'کد تایید وارد شده نادرست یا منقضی شده است');
      }

      setVerifiedToken(data.token);
      setVerifiedUser(data.user);

      // If user profile is already completed in DB, log in directly
      if (data.user?.isProfileComplete) {
        onLoginSuccess({
          token: data.token,
          phoneNumber: phoneNumber.trim(),
          role: data.user.role || 'PLAYER',
          isProfileComplete: true,
          fullName: data.user.fullName || 'کاربر گرامی',
        });
      } else {
        setAuthStep('role-selection');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در اعتبارسنجی کد تایید');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || cleanPassword.length < 4) {
      setError('نام کاربری و رمز عبور (حداقل ۴ نویسه) الزامی است');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/auth/login-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password: cleanPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'نام کاربری یا رمز عبور اشتباه است');
      }

      // Successful password login with server JWT token
      onLoginSuccess({
        token: data.token,
        phoneNumber: cleanUsername,
        role: (data.user?.role as UserRole) || 'PLAYER',
        isProfileComplete: Boolean(data.user?.isProfileComplete),
        fullName: data.user?.fullName || cleanUsername,
      });
    } catch (err: any) {
      setError(err.message || 'خطا در احراز هویت با نام کاربری و رمز عبور');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (role: UserRole) => {
    onLoginSuccess({
      token: verifiedToken,
      phoneNumber: phoneNumber || '۰۹۱۲۳۴۵۶۷۸۹',
      role,
      isProfileComplete: false,
      fullName: verifiedUser?.fullName || 'کاربر گرامی',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100/70 via-slate-50 to-violet-100/60 dark:from-slate-950 dark:via-purple-950/40 dark:to-slate-900 relative overflow-hidden select-none transition-colors duration-200">
      {/* Animated Flowing Pastel Orbs */}
      <div className="absolute top-1/4 -right-16 w-80 h-80 rounded-full bg-purple-300/35 dark:bg-purple-900/25 blur-[100px] pointer-events-none animate-orb-1" />
      <div className="absolute bottom-1/4 -left-16 w-96 h-96 rounded-full bg-violet-300/30 dark:bg-violet-900/20 blur-[120px] pointer-events-none animate-orb-2" />
      <div className="absolute top-2/3 right-1/3 w-64 h-64 rounded-full bg-purple-200/25 dark:bg-purple-800/15 blur-[80px] pointer-events-none" />

      {/* Decorative Pitch Yard Lines */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full border-2 border-slate-900 dark:border-white" />
        <div className="absolute inset-x-0 h-[2px] bg-slate-900 dark:bg-white" />
      </div>

      <Card className="w-full max-w-md bg-white/95 dark:bg-slate-900/90 border border-purple-200/90 dark:border-white/10 backdrop-blur-2xl shadow-2xl shadow-purple-950/10 dark:shadow-black/60 relative z-10 overflow-hidden transition-all duration-300">
        {/* Brand Header with Transparent Logo */}
        <div className="p-6 text-center border-b border-purple-100 dark:border-white/10 bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent relative">
          <img
            src="/logo.png"
            alt="لوگوی فرست تاچ"
            className="mx-auto h-24 w-24 object-contain drop-shadow-[0_10px_20px_rgba(124,58,237,0.25)] mb-2 transition-transform duration-300 hover:scale-105 select-none"
          />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">فرست تاچ</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            سامانه تخصصی آموزش و مدیریت مربیان و بازیکنان فوتبال
          </p>
        </div>

        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold leading-relaxed text-right animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* STEP 1: PHONE NUMBER & REFERRAL */}
          {authStep === 'otp-request' && (
            <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  شماره تلفن همراه
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-center tracking-widest"
                  required
                />
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="h-4 w-4 text-slate-400" />
                  کد معرف (اختیاری)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="اختیاری"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:bg-white dark:focus:bg-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-center transition-all"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 text-sm font-black shadow-lg shadow-purple-500/25 bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'در حال ارسال کد...' : 'دریافت کد تایید یکبار مصرف'}
              </Button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 font-semibold">
                  یا
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setAuthStep('password-login')}
                className="w-full h-10 text-xs font-semibold gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                ورود با نام کاربری و رمز عبور
              </Button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {authStep === 'otp-verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-300">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">کد تایید برای شماره زیر ارسال شد:</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white dir-ltr">{phoneNumber}</p>
              </div>

              {testOtpNotice && (
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs text-center font-bold">
                  کد تایید آزمایشی سیستم: <span className="text-sm font-black tracking-widest">{testOtpNotice}</span>
                </div>
              )}

              <div className="space-y-1.5 text-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">کد ۵ رقمی را وارد نمایید</label>
                <input
                  type="text"
                  dir="ltr"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="۱۲۳۴۵"
                  className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center font-black text-xl tracking-[0.5em] focus:bg-white dark:focus:bg-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 text-sm font-black shadow-lg shadow-purple-500/25 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={loading}
              >
                {loading ? 'در حال بررسی...' : 'تایید کد و ادامه'}
              </Button>

              <button
                type="button"
                onClick={() => setAuthStep('otp-request')}
                className="w-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-center py-1 transition-colors"
              >
                ویرایش شماره همراه
              </button>
            </form>
          )}

          {/* PASSWORD LOGIN */}
          {authStep === 'password-login' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  نام کاربری
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="نام کاربری"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  رمز عبور
                </label>
                <input
                  type="password"
                  dir="ltr"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 text-sm font-black shadow-lg shadow-purple-500/25 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={loading}
              >
                {loading ? 'در حال ورود...' : 'ورود به سامانه'}
              </Button>

              <button
                type="button"
                onClick={() => setAuthStep('otp-request')}
                className="w-full text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-center py-1 transition-colors"
              >
                بازگشت به ورود با شماره همراه
              </button>
            </form>
          )}

          {/* STEP 3: ROLE SELECTION (1- بازیکن 2- مربی 3- اولیا) */}
          {authStep === 'role-selection' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="text-center space-y-1 mb-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">نقش خود را انتخاب فرمایید</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">به عنوان کدام عنوان وارد برنامه می‌شوید؟</p>
              </div>

              <div className="space-y-3">
                {/* 1 - بازیکن */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('PLAYER')}
                  className="w-full p-4 rounded-xl border-2 border-purple-500 bg-purple-50/80 dark:bg-purple-950/40 hover:bg-purple-100/60 dark:hover:bg-purple-900/50 flex items-center justify-between text-right transition-all duration-200 group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                        ۱. بازیکن (شاگرد)
                        <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">ورود به برنامه</span>
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">دریافت تمرینات، ارزیابی لمس اول و ارتباط با مربی</p>
                    </div>
                  </div>
                  <ChevronLeft className="h-5 w-5 text-purple-600 dark:text-purple-400 group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* 2 - مربی */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('COACH')}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center justify-between text-right transition-all duration-200 group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black group-hover:scale-105 transition-transform">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">۲. مربی فوتبال</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">طراحی تخته تاکتیک، برنامه‌ریزی تمرینی و نظارت بر شاگردان</p>
                    </div>
                  </div>
                  <ChevronLeft className="h-5 w-5 text-slate-400" />
                </button>

                {/* 3 - اولیا */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('PARENT')}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center justify-between text-right transition-all duration-200 group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black group-hover:scale-105 transition-transform">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">۳. اولیای بازیکن</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">مشاهده روند رشد فیزیکی، گزارش مربی و اشتراک‌ها</p>
                    </div>
                  </div>
                  <ChevronLeft className="h-5 w-5 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Camera, Upload, Edit3, X, ChevronLeft, Info, Sparkles } from 'lucide-react';

interface ProfileData {
  fullName: string;
  nationalId: string;
  avatarUrl: string;
  age: string;
  username: string;
  password: string;
  height: string;
  weight: string;
  bicep: string;
  calf: string;
  chest: string;
  experienceYears: string;
}

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: ProfileData) => void;
}

export const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // All fields start EMPTY as explicitly requested!
  const [formData, setFormData] = useState<ProfileData>({
    fullName: '',
    nationalId: '',
    avatarUrl: '',
    age: '',
    username: '',
    password: '',
    height: '',
    weight: '',
    bicep: '',
    calf: '',
    chest: '',
    experienceYears: '',
  });

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('درحال شخصی‌سازی برنامه برای شما...');
  const [isFinished, setIsFinished] = useState(false);

  // Handle Real Image File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Transition animation when clicking Next
  const goToStep = (nextStep: 1 | 2 | 3 | 4, msg: string) => {
    setIsTransitioning(true);
    setTransitionMessage(msg);
    setTimeout(() => {
      setStep(nextStep);
      setIsTransitioning(false);
    }, 650);
  };

  // Smooth, gentle circular progress in Step 4
  useEffect(() => {
    if (step !== 4) return;

    setProgress(0);
    setIsFinished(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFinished(true);
          return 100;
        }

        const next = prev + 1; // Fills gently and smoothly 1 by 1

        if (next < 25) {
          setStatusText('بررسی شاخص‌های فیزیکی، قد و وزن...');
        } else if (next < 55) {
          setStatusText('تنظیم برنامه تخصصی تمرین لمس اول متناسب با فرم بدنی...');
        } else if (next < 85) {
          setStatusText('اتصال مستقیم حساب به کارتابل مربی...');
        } else {
          setStatusText('درحال شخصی‌سازی نهایی برنامه برای شما...');
        }

        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 dark:bg-black/70 overflow-y-auto select-none transition-all">
      <Card className="w-full max-w-xl border border-purple-200/90 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl shadow-purple-950/20 relative overflow-hidden my-6">
        {/* Step Progress Top Bar */}
        <div className="bg-purple-50/60 dark:bg-purple-950/30 p-4 border-b border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white font-black text-xs shadow-sm">
              {step}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {step === 1 && 'مرحله ۱ از ۳: مشخصات فردی'}
              {step === 2 && 'مرحله ۲ از ۳: اطلاعات بدنی و تمرینی'}
              {step === 3 && 'مرحله ۳ از ۳: پیش‌نمایش کارت مربی'}
              {step === 4 && 'شخصی‌سازی نهایی برنامه'}
            </span>
          </div>

          {step < 4 && !isTransitioning && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <CardContent className="p-6">
          {/* INTERMEDIATE TRANSITION ANIMATION (Something happening behind the scenes) */}
          {isTransitioning ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
                <Sparkles className="h-6 w-6 text-purple-600 absolute animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{transitionMessage}</p>
                <p className="text-xs text-slate-400">سامانه در حال تحلیل داده‌هاست...</p>
              </div>
            </div>
          ) : (
            <>
              {/* ================= STEP 1: PERSONAL DETAILS ================= */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="text-center space-y-1 mb-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">تکمیل مشخصات فردی بازیکن</h3>
                    <p className="text-xs text-slate-500">جهت ثبت در فهرست شاگردان مربی و صدور شناسه ورزشی</p>
                  </div>

                  {/* Real File Upload Zone */}
                  <div className="flex flex-col items-center gap-2 py-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative h-20 w-20 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                        formData.avatarUrl
                          ? 'border-purple-600 shadow-md ring-2 ring-purple-500/20'
                          : 'border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50'
                      }`}
                    >
                      {formData.avatarUrl ? (
                        <img
                          src={formData.avatarUrl}
                          alt="تصویر بارگذاری شده"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-purple-600">
                          <Camera className="h-6 w-6" />
                          <span className="text-[9px] font-bold mt-1">بارگذاری عکس</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {formData.avatarUrl ? 'تغییر تصویر چهره' : 'انتخاب تصویر چهره از دستگاه'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نام و نام خانوادگی</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                        placeholder="نام و نام خانوادگی خود را وارد کنید"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">کد ملی</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.nationalId}
                        onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-center"
                        placeholder="کد ملی ۱۰ رقمی"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سن (سال)</label>
                      <input
                        type="number"
                        dir="ltr"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-center"
                        placeholder="سن"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نام کاربری دلخواه</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                        placeholder="نام کاربری"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رمز عبور</label>
                      <input
                        type="password"
                        dir="ltr"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                        placeholder="حداقل ۶ نویسه"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <Button
                      variant="primary"
                      onClick={() => goToStep(2, 'در حال ثبت مشخصات فردی و آماده‌سازی بخش سنجش...')}
                      className="w-full h-11 text-sm font-black gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25"
                    >
                      مرحله بعد: اطلاعات تمرینی و بدنی
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: TRAINING & MEASUREMENTS ================= */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="text-center space-y-1 mb-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">اطلاعات تمرینی و سنجش بدنی</h3>
                    <p className="text-xs text-slate-500">این مشخصات به مربی در تنظیم صحیح تمرینات کمک می‌نماید</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-right">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">قد (سانتی‌متر)</label>
                      <input
                        type="number"
                        dir="ltr"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-center"
                        placeholder="قد"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">وزن (کیلوگرم)</label>
                      <input
                        type="number"
                        dir="ltr"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-center"
                        placeholder="وزن"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">دور بازو (سانتی‌متر)</label>
                      <input
                        type="number"
                        dir="ltr"
                        value={formData.bicep}
                        onChange={(e) => setFormData({ ...formData, bicep: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-center"
                        placeholder="دور بازو"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">دور ساق (سانتی‌متر)</label>
                      <input
                        type="number"
                        dir="ltr"
                        value={formData.calf}
                        onChange={(e) => setFormData({ ...formData, calf: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-center"
                        placeholder="دور ساق"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">دور سینه (سانتی‌متر)</label>
                      <input
                        type="number"
                        dir="ltr"
                        value={formData.chest}
                        onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-center"
                        placeholder="دور سینه"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سابقه تمرینی</label>
                      <input
                        type="text"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                        placeholder="سابقه تمرین یا باشگاه"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-300 text-center font-bold flex items-center justify-center gap-1.5">
                    <Info className="h-4 w-4 shrink-0" />
                    <span>تمامی این اطلاعات در آینده در بخش مشخصات قابل ویرایش هستند</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 text-xs">
                      بازگشت
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => goToStep(3, 'در حال محاسبه شاخص‌های تنی و ساخت کارت دیجیتال مربیگری...')}
                      className="flex-[2] h-11 text-sm font-black gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25"
                    >
                      مشاهده پیش‌نمایش کارت مربی
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: COACH VIEW PREVIEW ================= */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="text-center space-y-1 mb-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">پیش‌نمایش پروفایل (نمای مربی)</h3>
                    <p className="text-xs text-slate-500">کارت رسمی دیجیتال شما در کارتابل مربیان فرست تاچ</p>
                  </div>

                  {/* Official Player Card */}
                  <div className="rounded-2xl p-5 bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white shadow-2xl border-2 border-purple-400/40 relative overflow-hidden">
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] font-black text-purple-300 bg-black/50 px-2.5 py-1 rounded-full">
                      <img src="/logo.png" alt="فرست تاچ" className="h-4 w-4 object-contain" />
                      <span>شناسنامه ورزشی فرست تاچ</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      {formData.avatarUrl ? (
                        <img
                          src={formData.avatarUrl}
                          alt="تصویر بازیکن"
                          className="h-20 w-20 rounded-2xl border-2 border-purple-400 object-cover shadow-xl"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-2xl border-2 border-purple-400/50 bg-purple-800/40 flex items-center justify-center text-purple-300 font-black">
                          <User className="h-10 w-10" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xl font-black">{formData.fullName || 'نام ثبت نشده'}</h4>
                        <p className="text-xs text-purple-300 font-semibold mt-0.5">
                          سن: {formData.age || '—'} سال | کد ملی: {formData.nationalId || '—'}
                        </p>
                        <p className="text-xs text-white/70 mt-1 font-mono">
                          شناسه: {formData.username || '—'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-purple-950/60 border border-purple-400/20 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-white/60 block">قد</span>
                        <span className="font-bold text-sm text-purple-300">{formData.height || '—'} سانتی‌متر</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/60 block">وزن</span>
                        <span className="font-bold text-sm text-purple-300">{formData.weight || '—'} کیلوگرم</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/60 block">دور بازو</span>
                        <span className="font-bold text-sm text-purple-300">{formData.bicep || '—'} سانتی‌متر</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/60 block">دور ساق</span>
                        <span className="font-bold text-sm text-purple-300">{formData.calf || '—'} سانتی‌متر</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/60 block">دور سینه</span>
                        <span className="font-bold text-sm text-purple-300">{formData.chest || '—'} سانتی‌متر</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/60 block">سابقه</span>
                        <span className="font-bold text-[11px] text-purple-300 truncate block">{formData.experienceYears || '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-11 text-xs font-bold gap-1.5"
                    >
                      <Edit3 className="h-4 w-4" />
                      ویرایش اطلاعات
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => goToStep(4, 'در حال راه‌اندازی فرآیند شخصی‌سازی...')}
                      className="flex-[2] h-11 text-sm font-black gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30"
                    >
                      <Sparkles className="h-4 w-4" />
                      ثبت نهایی و شخصی‌سازی برنامه
                    </Button>
                  </div>
                </div>
              )}

              {/* ================= STEP 4: GENTLE CIRCLE ANIMATION WITHOUT HEAVY BACKGROUND ================= */}
              {step === 4 && (
                <div className="py-8 flex flex-col items-center justify-center text-center relative overflow-hidden bg-transparent">
                  {/* Circular SVG Progress Ring (Filling Gently & Smoothly) */}
                  <div className="relative h-44 w-44 flex items-center justify-center mb-6">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-slate-200 dark:stroke-slate-800"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * progress) / 100}
                        strokeLinecap="round"
                        className="text-purple-600 transition-all duration-75 ease-linear"
                        fill="transparent"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {progress}٪
                      </span>
                      <span className="text-[10px] font-bold text-purple-600 mt-0.5">
                        {progress < 100 ? 'در حال تکمیل' : 'تکمیل شد'}
                      </span>
                    </div>
                  </div>

                  {!isFinished ? (
                    <div className="space-y-2">
                      <h4 className="text-base font-black text-slate-800 dark:text-slate-200 transition-all">
                        {statusText}
                      </h4>
                      <p className="text-xs text-slate-400">
                        تنظیم شاخص‌ها و اتصال پرونده مربیگری در حال انجام است...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5 animate-in fade-in zoom-in duration-300 max-w-sm mx-auto">
                      <div className="space-y-1.5">
                        <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400">
                          تمام قابلیت‌ها برات فعال شد! برو حالشو ببر
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          پروفایل ورزشی شما با موفقیت ثبت شد و قفل تمامی بخش‌های تاکتیک و تمرینات برای شما باز شد.
                        </p>
                      </div>

                      {/* Entry Button with NO BACKGROUND as requested! */}
                      <button
                        type="button"
                        onClick={() => onComplete(formData)}
                        className="w-full h-12 text-sm font-black border-2 border-purple-600 text-purple-600 hover:bg-purple-600/10 active:scale-[0.98] rounded-xl transition-all shadow-sm"
                      >
                        ورود به برنامه فرست تاچ
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

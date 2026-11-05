import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Camera, Upload, Edit3, X, ChevronLeft, Info, Sparkles, AlertCircle } from 'lucide-react';

export interface ProfileData {
  fullName: string;
  nationalId: string;
  avatarUrl: string;
  age: string;
  username: string;
  password?: string;
  height: string;
  weight: string;
  bicep?: string;
  calf?: string;
  chest?: string;
  experienceYears?: string;
  preferredFoot?: 'راست' | 'چپ' | 'هر دو پا';
  favPosition?: string;
}

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: ProfileData) => void;
  initialData?: any;
}

export const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialData,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    preferredFoot: 'راست',
    favPosition: 'هافبک میانی / بازیساز',
  });

  // Pre-fill existing data if available (supports re-editing!)
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setValidationError(null);
      if (initialData) {
        setFormData((prev) => ({
          ...prev,
          fullName: initialData.fullName || prev.fullName,
          nationalId: initialData.nationalId || prev.nationalId,
          avatarUrl: initialData.avatarUrl || prev.avatarUrl,
          age: initialData.age ? String(initialData.age) : prev.age,
          username: initialData.username || initialData.phoneNumber || prev.username,
          height: initialData.height ? String(initialData.height) : prev.height,
          weight: initialData.weight ? String(initialData.weight) : prev.weight,
          bicep: initialData.bicep ? String(initialData.bicep) : prev.bicep,
          calf: initialData.calf ? String(initialData.calf) : prev.calf,
          chest: initialData.chest ? String(initialData.chest) : prev.chest,
          experienceYears: initialData.experienceYears || prev.experienceYears,
          preferredFoot: initialData.preferredFoot || prev.preferredFoot,
          favPosition: initialData.position || initialData.favPosition || prev.favPosition,
        }));
      }
    }
  }, [isOpen, initialData]);

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

  // Step 1 Validation: CANNOT BE EMPTY
  const handleStep1Submit = () => {
    setValidationError(null);
    const trimmedName = formData.fullName.trim();
    if (!trimmedName || trimmedName.length < 3) {
      setValidationError('نام و نام خانوادگی الزامی است (حداقل ۳ حرف وارد کنید).');
      return;
    }
    const ageNum = Number(formData.age);
    if (!formData.age.trim() || isNaN(ageNum) || ageNum < 6 || ageNum > 60) {
      setValidationError('لطفاً سن معتبر خود را به عدد وارد نمایید (بین ۶ تا ۶۰ سال).');
      return;
    }
    const trimmedId = formData.nationalId.trim();
    if (!trimmedId || trimmedId.length < 8) {
      setValidationError('کد ملی یا شناسه شناسنامه‌ای معتبر الزامی است (حداقل ۸ رقم).');
      return;
    }
    goToStep(2, 'در حال ثبت مشخصات فردی و آماده‌سازی بخش سنجش بدنی...');
  };

  // Step 2 Validation: CANNOT BE EMPTY
  const handleStep2Submit = () => {
    setValidationError(null);
    const heightNum = Number(formData.height);
    if (!formData.height.trim() || isNaN(heightNum) || heightNum < 90 || heightNum > 230) {
      setValidationError('لطفاً قد واقعی خود را بر حسب سانتی‌متر وارد نمایید (بین ۹۰ تا ۲۳۰).');
      return;
    }
    const weightNum = Number(formData.weight);
    if (!formData.weight.trim() || isNaN(weightNum) || weightNum < 20 || weightNum > 160) {
      setValidationError('لطفاً وزن واقعی خود را بر حسب کیلوگرم وارد نمایید (بین ۲۰ تا ۱۶۰).');
      return;
    }
    if (!formData.favPosition?.trim()) {
      setValidationError('لطفاً پست تخصصی بازی در زمین را انتخاب کنید.');
      return;
    }
    goToStep(3, 'در حال محاسبه شاخص‌های تنی و ساخت کارت دیجیتال مربیگری...');
  };

  // Smooth circular progress in Step 4
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

        const next = prev + 1;

        if (next < 25) {
          setStatusText('بررسی شاخص‌های فیزیکی، قد و وزن...');
        } else if (next < 55) {
          setStatusText('تنظیم برنامه تخصصی تمرین لمس اول متناسب با فرم بدنی...');
        } else if (next < 85) {
          setStatusText('اتصال مستقیم پرونده به کارتابل مربی...');
        } else {
          setStatusText('درحال شخصی‌سازی نهایی برنامه برای شما...');
        }

        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [step]);

  if (!isOpen) return null;

  const inputClass =
    'w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:bg-white dark:focus:bg-slate-800 focus:border-purple-600 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm overflow-y-auto select-none transition-all">
      <Card className="w-full max-w-xl border border-purple-200/90 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl shadow-purple-950/20 dark:shadow-black/70 relative overflow-hidden my-6">
        {/* Step Progress Top Bar */}
        <div className="bg-purple-50/80 dark:bg-purple-950/40 p-4 border-b border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-white font-black text-xs shadow-sm">
              {step}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {step === 1 && 'مرحله ۱ از ۳: مشخصات فردی (الزامی)'}
              {step === 2 && 'مرحله ۲ از ۳: اطلاعات بدنی و تمرینی (الزامی)'}
              {step === 3 && 'مرحله ۳ از ۳: پیش‌نمایش شناسنامه مربی'}
              {step === 4 && 'شخصی‌سازی نهایی برنامه'}
            </span>
          </div>

          {step < 4 && !isTransitioning && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <CardContent className="p-6">
          {/* INTERMEDIATE TRANSITION ANIMATION */}
          {isTransitioning ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="relative flex items-center justify-center">
                <div className="h-16 w-16 rounded-full border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 animate-spin" />
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400 absolute animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{transitionMessage}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">سامانه در حال تحلیل داده‌هاست...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Validation Error Alert */}
              {validationError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* ================= STEP 1: PERSONAL DETAILS ================= */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="text-center space-y-1 mb-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">مشخصات فردی بازیکن</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ثبت دقیق مشخصات جهت انتساب صحیح رده سنی و صدور برنامه تمرین
                    </p>
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
                          : 'border-purple-300 dark:border-purple-700/80 hover:border-purple-500 dark:hover:border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                      }`}
                    >
                      {formData.avatarUrl ? (
                        <img
                          src={formData.avatarUrl}
                          alt="تصویر بارگذاری شده"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-purple-600 dark:text-purple-400">
                          <Camera className="h-6 w-6" />
                          <span className="text-[9px] font-bold mt-1">بارگذاری عکس</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {formData.avatarUrl ? 'تغییر تصویر چهره' : 'انتخاب تصویر چهره از دستگاه'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        نام و نام خانوادگی <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={inputClass}
                        placeholder="نام و نام خانوادگی بازیکن"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        کد ملی یا شناسه هویتی <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        required
                        value={formData.nationalId}
                        onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                        className={`${inputClass} text-center`}
                        placeholder="کد ملی ۱۰ رقمی"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        سن بازیکن (سال) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={6}
                        max={60}
                        dir="ltr"
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className={`${inputClass} text-center`}
                        placeholder="مثال: ۱۴"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نام کاربری دلخواه</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className={inputClass}
                        placeholder="شناسه کاربری دلخواه"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <Button
                      variant="primary"
                      onClick={handleStep1Submit}
                      className="w-full h-11 text-sm font-black gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25 cursor-pointer"
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
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      این شاخص‌ها به مربیان در شخصی‌سازی جلسات کمک می‌نمایند
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-right">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        قد (سانتی‌متر) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={90}
                        max={230}
                        dir="ltr"
                        required
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        className={`${inputClass} text-center`}
                        placeholder="مثال: ۱۷۵"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        وزن (کیلوگرم) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={20}
                        max={160}
                        dir="ltr"
                        required
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className={`${inputClass} text-center`}
                        placeholder="مثال: ۶۸"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">پای تخصصی</label>
                      <select
                        value={formData.preferredFoot || 'راست'}
                        onChange={(e) => setFormData({ ...formData, preferredFoot: e.target.value as any })}
                        className={inputClass}
                      >
                        <option value="راست">راست‌پا</option>
                        <option value="چپ">چپ‌پا</option>
                        <option value="هر دو پا">هر دو پا (دوپا)</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        پست تخصصی در زمین <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.favPosition || 'هافبک میانی / بازیساز'}
                        onChange={(e) => setFormData({ ...formData, favPosition: e.target.value })}
                        className={inputClass}
                      >
                        <option value="مهاجم نوک / تمام‌کننده">مهاجم نوک / تمام‌کننده</option>
                        <option value="وینگر چپ / نفوذی">وینگر چپ / نفوذی</option>
                        <option value="وینگر راست / نفوذی">وینگر راست / نفوذی</option>
                        <option value="هافبک هجومی / پلی‌میکر">هافبک هجومی / پلی‌میکر</option>
                        <option value="هافبک میانی / بازیساز">هافبک میانی / بازیساز</option>
                        <option value="هافبک دفاعی / تخریبی">هافبک دفاعی / تخریبی</option>
                        <option value="مدافع میانی / سوئیپر">مدافع میانی / سوئیپر</option>
                        <option value="مدافع کناری (فول‌بک)">مدافع کناری (فول‌بک)</option>
                        <option value="دروازه‌بان (گلر)">دروازه‌بان (گلر)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سابقه بازی</label>
                      <input
                        type="text"
                        value={formData.experienceYears || ''}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                        className={inputClass}
                        placeholder="مثال: ۳ سال مدرسه فوتبال"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-300 text-center font-bold flex items-center justify-center gap-1.5">
                    <Info className="h-4 w-4 shrink-0" />
                    <span>تمامی این اطلاعات در هر زمان در بخش «حساب من» قابل ویرایش مجدد هستند</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-11 text-xs border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      بازگشت
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleStep2Submit}
                      className="flex-[2] h-11 text-sm font-black gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25 cursor-pointer"
                    >
                      مشاهده پیش‌نمایش شناسنامه
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
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      شناسنامه رسمی ورزشی شما در پنل مربیان فرست تاچ
                    </p>
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
                        <h4 className="text-xl font-black">{formData.fullName}</h4>
                        <p className="text-xs text-purple-300 font-semibold mt-0.5">
                          سن: {formData.age} سال | کد ملی: {formData.nationalId}
                        </p>
                        <p className="text-xs text-emerald-300 mt-1 font-bold">
                          پست: {formData.favPosition} • پای تخصصی: {formData.preferredFoot}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-purple-950/60 border border-purple-400/20 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-white/60 block">قد</span>
                        <span className="font-bold text-sm text-purple-300">{formData.height} سانتی‌متر</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/60 block">وزن</span>
                        <span className="font-bold text-sm text-purple-300">{formData.weight} کیلوگرم</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/60 block">پست تخصصی</span>
                        <span className="font-bold text-xs text-purple-300 truncate block">{formData.favPosition}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-11 text-xs font-bold gap-1.5 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4" />
                      ویرایش مجدد
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => goToStep(4, 'در حال راه‌اندازی فرآیند شخصی‌سازی و صدور برنامه...')}
                      className="flex-[2] h-11 text-sm font-black gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      تایید نهایی و فعال‌سازی امکانات
                    </Button>
                  </div>
                </div>
              )}

              {/* ================= STEP 4: GENTLE CIRCLE ANIMATION ================= */}
              {step === 4 && (
                <div className="py-8 flex flex-col items-center justify-center text-center relative overflow-hidden bg-transparent">
                  {/* Circular SVG Progress Ring */}
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
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                        {progress < 100 ? 'در حال تکمیل' : 'تکمیل شد'}
                      </span>
                    </div>
                  </div>

                  {!isFinished ? (
                    <div className="space-y-2">
                      <h4 className="text-base font-black text-slate-800 dark:text-slate-200 transition-all">
                        {statusText}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        تنظیم شاخص‌ها و اتصال پرونده مربیگری در حال انجام است...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5 animate-in fade-in zoom-in duration-300 max-w-sm mx-auto">
                      <div className="space-y-1.5">
                        <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400">
                          مشخصات با موفقیت ذخیره شد!
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          شناسنامه ورزشی شما ثبت گردید و برنامه‌های تمرینی بر اساس سن و مشخصات شما در دسترسی قرار گرفتند.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onComplete(formData)}
                        className="w-full h-12 text-sm font-black border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-600/10 active:scale-[0.98] rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        ورود به فرست تاچ
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

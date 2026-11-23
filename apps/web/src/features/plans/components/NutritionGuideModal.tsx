import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Apple,
  Droplets,
  Flame,
  Sparkles,
  Heart,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface NutritionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NutritionGuideModal: React.FC<NutritionGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [guide, setGuide] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('ft_custom_nutrition_guide');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      title: 'راهنمای جامع تغذیه و سوخت‌رسانی فوتبال',
      subtitle: 'اصول تخصصی تغذیه مسابقه، آب‌رسانی و بازسازی گلیکوژن برای فوتبالیست‌ها',
      summary: 'تغذیه مناسب تا ۴۰٪ در راندمان بدنی، استقامت ۹۰ دقیقه‌ای و جلوگیری از گرفتگی عضلات در نیمه دوم مؤثر است.',
      hydrationGuidelines: [
        'نوشیدن ۵۰۰ میلی‌لیتر آب یا نوشیدنی الکترولیت ۲ ساعت قبل از تمرین',
        'مصرف جرعه‌های کوچک (۱۵۰ تا ۲۰۰ میلی‌لیتر) هر ۱۵ تا ۲۰ دقیقه حین فعالیت',
        'جایگزینی وزن آب از دست رفته پس از مسابقه (به ازای هر کیلو افت وزن، ۱.۵ لیتر آب و املاح)',
      ],
      preMatchMeal: [
        'وعده اصلی ۳ تا ۴ ساعت قبل مسابقه (کربوهیدرات پیچیده با شاخص گلیسمی متوسط + پروتئین کم‌چرب)',
        'میان‌وعده سبک ۶۰ تا ۹۰ دقیقه قبل مسابقه (موز، نان تست با عسل طبیعی)',
        'پرهیز از غذاهای چرب، پرادویه و فیبر سنگین قبل از سوت آغاز بازی',
      ],
      postMatchRecovery: [
        'پنجره آنابولیک ۳۰ دقیقه اول: مصرف پروتئین باکیفیت (۲۰ تا ۳۰ گرم) به همراه کربوهیدرات ساده',
        'شیک اسموتی پروتئینی با شیر کم‌چرب، موز، پودر کاکائو یا وی',
        'وعده شام ریکاوری: ماهی سالمون یا سینه مرغ به همراه برنج قهوه‌ای و سبزیجات سبز',
      ],
      dailyTips: [
        'تقسیم کالری در ۵ الی ۶ وعده کوچک جهت جذب حداکثری و حفظ ثبات قند خون',
        'حداقل ۸ تا ۱۰ لیوان آب در روزهای استراحت و تمرین سبک',
        'خواب کافی (۸ الی ۹ ساعت) برای بازسازی بهینه فیبرهای عضلانی',
      ],
      supplementNotes: 'مصرف کراتین، منیزیم، ویتامین D3 و امگا ۳ تنها تحت نظارت پزشک تیم یا مربی مجرب توصیه می‌شود.',
    };
  });

  useEffect(() => {
    if (!isOpen) return;
    fetch(`${API_BASE_URL}/nutrition/guide`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.title) {
          setGuide(data);
          try {
            localStorage.setItem('ft_custom_nutrition_guide', JSON.stringify(data));
          } catch {}
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="w-full max-w-2xl rounded-3xl bg-slate-900 dark:bg-[#07160e] border border-emerald-500/30 p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white space-y-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 dark:border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Apple className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">{guide.title}</h3>
                <p className="text-[11px] text-emerald-400 font-semibold">{guide.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Summary Box */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>{guide.summary}</p>
          </div>

          {/* Section 1: Pre-Match */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2 text-xs font-black text-amber-400">
              <Clock className="h-4 w-4" />
              <span>تغذیه قبل از مسابقه و روز بازی</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 pr-4 list-disc">
              {guide.preMatchMeal?.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section 2: Post-Match Recovery */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400">
              <Flame className="h-4 w-4" />
              <span>ریکاوری و بازسازی عضلانی پس از سوت پایان</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 pr-4 list-disc">
              {guide.postMatchRecovery?.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section 3: Hydration */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2 text-xs font-black text-cyan-400">
              <Droplets className="h-4 w-4" />
              <span>پروتکل طلایی آب‌رسانی و الکترولیت</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 pr-4 list-disc">
              {guide.hydrationGuidelines?.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section 4: Daily Tips */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center gap-2 text-xs font-black text-rose-400">
              <Heart className="h-4 w-4" />
              <span>نکات طلایی روزمره و سبک زندگی ورزشی</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 pr-4 list-disc">
              {guide.dailyTips?.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section 5: Supplement Notes */}
          {guide.supplementNotes && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <p>{guide.supplementNotes}</p>
            </div>
          )}

          {/* Close CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle2 className="h-4 w-4" />
              متوجه شدم
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

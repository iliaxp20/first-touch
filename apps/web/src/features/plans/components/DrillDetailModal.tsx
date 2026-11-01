import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import {
  X,
  Heart,
  Clock,
  Dumbbell,
  Target,
  AlertTriangle,
  Lightbulb,
  Users,
  Play,
  Lock,
} from 'lucide-react';
import { AgilityDrill } from './AgilityDrillModal';

interface DrillDetailModalProps {
  drill: AgilityDrill | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSimilar?: (drillName: string) => void;
}

export const DrillDetailModal: React.FC<DrillDetailModalProps> = ({
  drill,
  isOpen,
  onClose,
  onSelectSimilar,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!drill) return;
    try {
      const favs = JSON.parse(localStorage.getItem('first_touch_favorite_drills') || '[]');
      setIsFavorite(favs.includes(drill.id));
    } catch {
      setIsFavorite(false);
    }
  }, [drill]);

  const toggleFavorite = () => {
    if (!drill) return;
    try {
      const favs = JSON.parse(localStorage.getItem('first_touch_favorite_drills') || '[]');
      let updated: string[];
      if (favs.includes(drill.id)) {
        updated = favs.filter((id: string) => id !== drill.id);
        setIsFavorite(false);
      } else {
        updated = [...favs, drill.id];
        setIsFavorite(true);
      }
      localStorage.setItem('first_touch_favorite_drills', JSON.stringify(updated));
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('has-modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('has-modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('has-modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !drill) return null;

  const setsAndReps = (drill as any).setsAndReps || '۳ ست ۱۰ تا ۱۲ تکرار';
  const durationMinutes = (drill as any).durationMinutes || 12;
  const targetAge = (drill as any).targetAge || 'تمامی رده‌های سنی (۱۰ سال به بالا)';
  const targetPosition = (drill as any).targetPosition || 'تمامی پست‌ها (مدافع، هافبک، مهاجم، دروازه‌بان)';
  const coachingTips =
    (drill as any).coachingTips ||
    'مرکز ثقل بدن را پایین نگه دارید، روی سینه پا حرکت کنید و سر را بالا نگه دارید تا دید محیطی زمین حفظ شود.';
  const commonMistakes =
    (drill as any).commonMistakes ||
    'بلند شدن بیش از حد از سطح زمین در حین گام‌برداری، نگاه مداوم به زیر پا، و شل کردن عضلات مرکزی شکم.';
  const similarDrills = (drill as any).similarDrills || ['شاتل کوتاه ۵-۱۰-۵', 'تغییر جهت ۹۰ درجه', 'برش‌های زاویه‌دار'];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/95 sm:bg-slate-950/98 backdrop-blur-xl overflow-y-auto select-none">
      <Card className="w-full max-w-2xl border border-purple-200/90 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl shadow-purple-950/25 relative overflow-hidden rounded-3xl my-4">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {drill.categoryTitle}
            </span>
            {(drill as any).isPremium && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                محتوای ویژه
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              title={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              className={`h-9 w-9 rounded-full flex items-center justify-center border transition-all ${
                isFavorite
                  ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-300'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <CardContent className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Media / Video Frame */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md group">
            {(drill as any).videoUrl ? (
              <video
                src={(drill as any).videoUrl}
                controls
                playsInline
                poster={drill.imageUrl || (drill as any).thumbnailUrl}
                className="w-full h-full object-cover"
              />
            ) : drill.imageUrl ? (
              <img
                src={drill.imageUrl}
                alt={drill.persianName || (drill as any).title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                <Play className="h-12 w-12 text-purple-400 opacity-60" />
                <span className="text-xs">ویدئوی آموزشی تمرین فوتبال</span>
              </div>
            )}
            <div className="absolute top-3 right-3 pointer-events-none">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5">
                <Play className="h-3 w-3 text-purple-400 fill-purple-400" />
                آموزش تصویری
              </span>
            </div>
          </div>

          {/* Key Quick Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-2.5 rounded-xl border border-purple-100 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-950/20">
              <Clock className="h-4 w-4 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">مدت تمرین</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{durationMinutes} دقیقه</span>
            </div>
            <div className="p-2.5 rounded-xl border border-purple-100 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-950/20">
              <Dumbbell className="h-4 w-4 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">تعداد و ست</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">{setsAndReps}</span>
            </div>
            <div className="p-2.5 rounded-xl border border-purple-100 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-950/20">
              <Target className="h-4 w-4 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">سطح سختی</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {drill.difficulty === 'BEGINNER'
                  ? 'مبتدی'
                  : drill.difficulty === 'INTERMEDIATE'
                  ? 'متوسط'
                  : drill.difficulty === 'ADVANCED'
                  ? 'پیشرفته'
                  : 'حرفه‌ای'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl border border-purple-100 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-950/20">
              <Users className="h-4 w-4 mx-auto text-purple-600 dark:text-purple-400 mb-1" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">تجهیزات</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">{drill.equipment}</span>
            </div>
          </div>

          {/* Goal & Description */}
          <div className="space-y-1.5 text-right">
            <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              هدف و شرح تمرین
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {drill.description}
            </p>
          </div>

          {/* Age & Position Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right text-xs">
            <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">رده سنی مناسب:</span>
              <span className="text-slate-500 dark:text-slate-400">{targetAge}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">پست‌های تخصصی:</span>
              <span className="text-slate-500 dark:text-slate-400">{targetPosition}</span>
            </div>
          </div>

          {/* Coaching Tips (نکات مربی) */}
          <div className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 text-right space-y-1">
            <h5 className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              نکات طلایی مربی
            </h5>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
              {coachingTips}
            </p>
          </div>

          {/* Common Mistakes (اشتباهات رایج) */}
          <div className="p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 text-right space-y-1">
            <h5 className="text-xs font-black text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              اشتباهات رایج بازیکنان
            </h5>
            <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed">
              {commonMistakes}
            </p>
          </div>

          {/* Similar Drills (تمرینات مشابه) */}
          {similarDrills.length > 0 && (
            <div className="space-y-2 text-right">
              <h5 className="text-xs font-black text-slate-800 dark:text-slate-200">تمرینات مرتبط و مشابه:</h5>
              <div className="flex flex-wrap gap-2">
                {similarDrills.map((s: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectSimilar && onSelectSimilar(s)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

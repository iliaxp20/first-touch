import React from 'react';
import { Lock, Sparkles } from 'lucide-react';

interface LockedFeatureViewProps {
  title: string;
  description: string;
  isUnlocked: boolean;
  onUnlockClick: () => void;
  children: React.ReactNode;
}

export const LockedFeatureView: React.FC<LockedFeatureViewProps> = ({
  title,
  description,
  isUnlocked,
  onUnlockClick,
  children,
}) => {
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

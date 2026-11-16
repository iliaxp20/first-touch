import React from 'react';
import { Apple } from 'lucide-react';
import { NutritionTracker } from './NutritionTracker';

export const NutritionView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Nutrition Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Apple className="h-6 w-6 text-emerald-500" />
            برنامه غذایی و کالری‌شمار
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            پیگیری هوشمند کالری روزانه، درشت‌مغذی‌ها، هیدراتاسیون و وعده‌های غذایی فوتبال
          </p>
        </div>
      </div>

      {/* Main Nutrition Tracker Component */}
      <NutritionTracker />
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';

export const DashboardView: React.FC = () => {
  return (
    <div className="min-h-[62vh] flex items-center justify-center p-4 select-none">
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-md w-full">
        {/* Animated Rocking & Pulsing Wrench */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{
              rotate: [0, -16, 16, -12, 12, 0],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-purple-600/30"
          >
            <Wrench className="h-12 w-12 stroke-[2.2]" />
          </motion.div>
        </div>

        {/* Clean Single Title */}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          بخش داشبورد در حال تعمیر و ارتقا می‌باشد
        </h1>

        {/* Sleek Infinite Loading / Filling Animation Bar */}
        <div className="w-56 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="h-full w-28 rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 shadow-sm shadow-purple-500/50"
          />
        </div>
      </div>
    </div>
  );
};

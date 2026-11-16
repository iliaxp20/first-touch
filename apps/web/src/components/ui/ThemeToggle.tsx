import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e)}
      aria-label={`تغییر به حالت ${isDark ? 'روشن' : 'تاریک'}`}
      title={`تغییر به حالت ${isDark ? 'روشن' : 'تاریک'}`}
      className="theme-toggle-btn relative flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/5 dark:bg-emerald-950/40 hover:bg-white/10 dark:hover:bg-emerald-900/50 backdrop-blur-xl border border-white/10 dark:border-emerald-500/25 shadow-[0_4px_15px_rgba(0,0,0,0.25)] transition-all duration-200 overflow-hidden outline-none focus:outline-none cursor-pointer"
      style={{
        viewTransitionName: 'theme-toggle-btn',
      }}
    >
      <div className="relative w-5 h-5 flex items-center justify-center pointer-events-none">
        {/* Moon Icon */}
        <Moon
          className={`absolute h-5 w-5 text-emerald-400 stroke-[2.2] transition-all duration-300 ease-out transform ${
            isDark
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-0 -rotate-90 opacity-0 pointer-events-none'
          }`}
        />

        {/* Sun Icon */}
        <Sun
          className={`absolute h-5 w-5 text-amber-500 stroke-[2.2] transition-all duration-300 ease-out transform ${
            !isDark
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-0 rotate-90 opacity-0 pointer-events-none'
          }`}
        />
      </div>
    </button>
  );
};

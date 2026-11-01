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
      className="theme-toggle-btn relative flex items-center justify-center h-10 w-10 rounded-full border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm hover:shadow transition-all duration-200 overflow-hidden outline-none focus:outline-none cursor-pointer"
      style={{
        viewTransitionName: 'theme-toggle-btn',
      }}
    >
      <div className="relative w-5 h-5 flex items-center justify-center pointer-events-none">
        {/* Moon Icon */}
        <Moon
          className={`absolute h-5 w-5 text-purple-400 stroke-[2.2] transition-all duration-300 ease-out transform ${
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

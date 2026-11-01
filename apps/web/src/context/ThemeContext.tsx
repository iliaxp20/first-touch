import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (event?: React.MouseEvent) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('first_touch_theme') as Theme;
    return saved === 'dark' ? 'dark' : 'light';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }

    localStorage.setItem('first_touch_theme', theme);
  }, [theme, isDark]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = (event?: React.MouseEvent) => {
    const nextTheme: Theme = isDark ? 'light' : 'dark';

    // Circular Paint Spreading Wave Transition from Click Coordinates
    const doc = document as any;
    if (event && doc.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = event.clientX || (rect.left + rect.width / 2);
      const y = event.clientY || (rect.top + rect.height / 2);

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = doc.startViewTransition(() => {
        setThemeState(nextTheme);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 650,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    } else {
      setThemeState(nextTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

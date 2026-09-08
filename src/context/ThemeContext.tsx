'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = 'santun_theme';
export const BRANDING_THEME_KEY = 'santun_dark_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      const brandingDefault = localStorage.getItem(BRANDING_THEME_KEY) as Theme | null;
      if (brandingDefault === 'dark' || brandingDefault === 'light') {
        return brandingDefault;
      }
      if (document.documentElement.classList.contains('dark')) {
        return 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const applyThemeToDom = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    if (newTheme === 'dark') {
      root.classList.add('dark');
      if (body) body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      if (body) body.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      applyThemeToDom(newTheme);
      window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: newTheme } }));
      window.dispatchEvent(new Event('branding-updated'));
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    // Initial sync with DOM and localStorage
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const currentTheme = saved || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    if (currentTheme !== theme) {
      setThemeState(currentTheme);
    }
    applyThemeToDom(currentTheme);

    // Cross-tab synchronization via storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
        applyThemeToDom(e.newValue);
      }
    };

    // Listen to custom theme-changed events
    const handleThemeChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme?: Theme }>;
      if (customEvent.detail?.theme) {
        setThemeState(customEvent.detail.theme);
        applyThemeToDom(customEvent.detail.theme);
      } else {
        const updated = (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'light';
        setThemeState(updated);
        applyThemeToDom(updated);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('theme-changed', handleThemeChanged);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('theme-changed', handleThemeChanged);
    };
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggleTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

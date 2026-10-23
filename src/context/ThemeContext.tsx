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
  const [theme, setThemeState] = useState<Theme>('light');

  const isPublicRoute = () => {
    if (typeof window === 'undefined') return false;
    const p = window.location.pathname;
    const h = window.location.hostname;
    return (
      p.startsWith('/travel-agency-03') ||
      p.startsWith('/properties') ||
      p.startsWith('/landing') ||
      h === 'inmosoft.pro' ||
      h.includes('inmobiliaria')
    );
  };

  const applyThemeToDom = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    if (isPublicRoute()) {
      root.classList.remove('dark');
      if (body) body.classList.remove('dark');
      return;
    }

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
    if (isPublicRoute()) {
      applyThemeToDom('light');
      setThemeState('light');
      return;
    }

    // Initial sync with DOM and localStorage after hydration completes
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const brandingDefault = localStorage.getItem(BRANDING_THEME_KEY) as Theme | null;
    let initialTheme: Theme = 'light';
    if (saved === 'dark' || saved === 'light') {
      initialTheme = saved;
    } else if (brandingDefault === 'dark' || brandingDefault === 'light') {
      initialTheme = brandingDefault;
    } else if (document.documentElement.classList.contains('dark')) {
      initialTheme = 'dark';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initialTheme = 'dark';
    }

    setThemeState(initialTheme);
    applyThemeToDom(initialTheme);

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

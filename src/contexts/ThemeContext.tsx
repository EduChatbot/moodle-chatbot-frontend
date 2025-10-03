"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);

      document.documentElement.classList.toggle('light', theme === 'light');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Only auto-change background color if it's currently white or black (default colors)
    const currentBgColor = localStorage.getItem('backgroundColor');
    if (currentBgColor === 'white' || currentBgColor === 'black' || !currentBgColor) {
      const targetColor = newTheme === 'light' ? 'white' : 'black';
      localStorage.setItem('backgroundColor', targetColor);
      
      // Dispatch event to notify AnimationContext only for default colors
      window.dispatchEvent(new CustomEvent('themeBackgroundChange', { 
        detail: { color: targetColor } 
      }));
    }
  };

  // Add a direct setTheme function for external control
  const setThemeDirectly = (newTheme: Theme) => {
    setTheme(newTheme);
  };


  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeDirectly }}>
      {children}
    </ThemeContext.Provider>
  );
}
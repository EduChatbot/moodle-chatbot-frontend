"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTheme } from './ThemeContext';

type BackgroundType = 'liquidether' | 'darkveil' | 'lightrays' | 'prism' | 'threads' | 'normal';
type BackgroundColor = 'black' | 'gray' | 'darkblue' | 'cream' | 'white';

interface AnimationContextType {
  animationsEnabled: boolean;
  toggleAnimations: () => void;
  backgroundType: BackgroundType;
  setBackgroundType: (type: BackgroundType) => void;
  backgroundColor: BackgroundColor;
  setBackgroundColor: (color: BackgroundColor) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [backgroundType, setBackgroundTypeState] = useState<BackgroundType>('liquidether');
  const [backgroundColor, setBackgroundColorState] = useState<BackgroundColor>('gray');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedAnimations = localStorage.getItem('animationsEnabled');
    if (savedAnimations !== null) {
      setAnimationsEnabled(JSON.parse(savedAnimations));
    }
    
    const savedBackground = localStorage.getItem('backgroundType');
    if (savedBackground) {
      setBackgroundTypeState(savedBackground as BackgroundType);
    }
    
    const savedColor = localStorage.getItem('backgroundColor');
    if (savedColor) {
      setBackgroundColorState(savedColor as BackgroundColor);
    }

    // Listen for theme background changes (only for default white/black colors)
    const handleThemeBackgroundChange = (event: CustomEvent) => {
      const newColor = event.detail.color as BackgroundColor;
      setBackgroundColorState(newColor);
    };

    window.addEventListener('themeBackgroundChange', handleThemeBackgroundChange as EventListener);
    
    return () => {
      window.removeEventListener('themeBackgroundChange', handleThemeBackgroundChange as EventListener);
    };
  }, []);

  // Add body class for cream background
  useEffect(() => {
    if (mounted) {
      if (backgroundColor === 'cream') {
        document.body.classList.add('cream-bg');
      } else {
        document.body.classList.remove('cream-bg');
      }
    }
  }, [backgroundColor, mounted]);

  const toggleAnimations = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    localStorage.setItem('animationsEnabled', JSON.stringify(newValue));
  };

  const setBackgroundType = (type: BackgroundType) => {
    setBackgroundTypeState(type);
    localStorage.setItem('backgroundType', type);
    
    // For DarkVeil, restrict to dark colors only and force dark theme
    if (type === 'darkveil') {
      const allowedColors: BackgroundColor[] = ['black', 'gray', 'darkblue'];
      if (!allowedColors.includes(backgroundColor)) {
        setBackgroundColorState('black');
        localStorage.setItem('backgroundColor', 'black');
      }
      // Force dark theme for DarkVeil
      if (theme === 'light') {
        setTheme('dark');
      }
    }
  };

  const setBackgroundColor = (color: BackgroundColor) => {
    // For DarkVeil, only allow dark colors
    if (backgroundType === 'darkveil') {
      const allowedColors: BackgroundColor[] = ['black', 'gray', 'darkblue'];
      if (!allowedColors.includes(color)) {
        return; // Don't allow light colors for DarkVeil
      }
    }
    
    setBackgroundColorState(color);
    localStorage.setItem('backgroundColor', color);
    
    // Auto switch theme based on color selection (but not for DarkVeil which stays dark)
    if (backgroundType !== 'darkveil') {
      const lightColors: BackgroundColor[] = ['cream', 'white'];
      const darkColors: BackgroundColor[] = ['black', 'gray', 'darkblue'];
      
      // Directly set the theme based on color - no toggling
      if (lightColors.includes(color)) {
        setTheme('light');
      } else if (darkColors.includes(color)) {
        setTheme('dark');
      }
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AnimationContext.Provider value={{ 
      animationsEnabled, 
      toggleAnimations, 
      backgroundType, 
      setBackgroundType,
      backgroundColor,
      setBackgroundColor
    }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {

    return {
      animationsEnabled: true,
      toggleAnimations: () => {},
      backgroundType: 'liquidether' as BackgroundType,
      setBackgroundType: () => {},
      backgroundColor: 'gray' as BackgroundColor,
      setBackgroundColor: () => {}
    };
  }
  return context;
}
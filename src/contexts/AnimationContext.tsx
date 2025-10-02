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
  const { theme, toggleTheme } = useTheme();
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
  }, []);

  const toggleAnimations = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    localStorage.setItem('animationsEnabled', JSON.stringify(newValue));
  };

  const setBackgroundType = (type: BackgroundType) => {
    setBackgroundTypeState(type);
    localStorage.setItem('backgroundType', type);
  };

  const setBackgroundColor = (color: BackgroundColor) => {
    setBackgroundColorState(color);
    localStorage.setItem('backgroundColor', color);
    

    const lightColors: BackgroundColor[] = ['cream', 'white'];
    const shouldBeLight = lightColors.includes(color);
    
    if (shouldBeLight && theme === 'dark') {
      toggleTheme();
    } else if (!shouldBeLight && theme === 'light' && color !== 'gray') {

      toggleTheme();
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
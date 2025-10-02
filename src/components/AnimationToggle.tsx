"use client";

import { useAnimation } from '@/contexts/AnimationContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function AnimationToggle() {
  const { animationsEnabled, toggleAnimations } = useAnimation();
  const { theme } = useTheme();

  return (
    <button
      onClick={toggleAnimations}
      className="animation-toggle"
      style={{
        position: 'fixed',
        top: 12,
        right: 80,
        zIndex: 50,
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '2px solid',
        borderColor: theme === 'dark' ? '#ffffff40' : '#00000020',
        backgroundColor: theme === 'dark' ? '#1a1a1a80' : '#ffffff80',
        color: theme === 'dark' ? '#ffffff' : '#000000',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        transition: 'all 0.3s ease',
        transform: 'scale(0.8)',
        transformOrigin: 'center'
      }}
      title={animationsEnabled ? 'Disable animations' : 'Enable animations'}
    >
      {animationsEnabled ? '🎬' : '⏸️'}
    </button>
  );
}
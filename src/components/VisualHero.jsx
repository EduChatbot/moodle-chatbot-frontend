"use client";

import { useEffect, useState } from "react";
import RotatingText from "./RotatingText";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";


const DarkVeil = ({ animationsEnabled = true }) => {
  const [Component, setComponent] = useState(null);
  useEffect(() => {
    import('./DarkVeil').then(mod => setComponent(() => mod.default)).catch(() => {});
  }, []);
  return Component ? (
    <Component 
      speed={animationsEnabled ? 0.5 : 0}
      hueShift={0}
      noiseIntensity={0}
      scanlineIntensity={0}
      scanlineFrequency={0}
      warpAmount={0}
      resolutionScale={1}
    />
  ) : null;
};

const LightRays = ({ animationsEnabled = true, backgroundColor, theme }) => {
  const [Component, setComponent] = useState(null);
  useEffect(() => {
    import('./LightRays').then(mod => setComponent(() => mod.default)).catch(() => {});
  }, []);
  
  const getRayColor = () => {
    if (backgroundColor === 'black' || backgroundColor === 'white') {
      return theme === 'light' ? '#8b5cf6' : '#a855f7';
    }
    switch (backgroundColor) {
      case 'gray': return '#57534e';
      case 'darkblue': return '#475569';
      case 'cream': return '#8B7355';
      default: return '#8b5cf6';
    }
  };
  
  return Component ? (
    <Component
      raysOrigin="top-center"
      raysColor={getRayColor()}
      raysSpeed={animationsEnabled ? 1.5 : 0}
      lightSpread={0.8}
      rayLength={1.2}
      followMouse={animationsEnabled}
      mouseInfluence={animationsEnabled ? 0.1 : 0}
      noiseAmount={animationsEnabled ? 0.1 : 0}
      distortion={animationsEnabled ? 0.05 : 0}
      className="custom-rays"
    />
  ) : null;
};

const Prism = ({ animationsEnabled = true }) => {
  const [Component, setComponent] = useState(null);
  useEffect(() => {
    import('./Prism').then(mod => setComponent(() => mod.default)).catch(() => {});
  }, []);
  return Component ? (
    <Component
      animationType={animationsEnabled ? "rotate" : "none"}
      timeScale={animationsEnabled ? 0.15 : 0.000001}
      height={3.5}
      baseWidth={5.5}
      scale={3.6}
      hueShift={0}
      colorFrequency={1}
      noise={0.5}
      glow={1}
    />
  ) : null;
};

const Threads = ({ animationsEnabled = true }) => {
  const [Component, setComponent] = useState(null);
  useEffect(() => {
    import('./Threads').then(mod => setComponent(() => mod.default)).catch(() => {});
  }, []);
  return Component ? (
    <Component
      amplitude={0.6}
      distance={0}
      enableMouseInteraction={animationsEnabled}
      animationsEnabled={animationsEnabled}
    />
  ) : null;
};

export default function VisualHero({ logoSrc = "/favicon.ico" }) {
  const [LiquidEther, setLiquidEther] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const { animationsEnabled, backgroundType, backgroundColor } = useAnimation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let componentMounted = true;

    import("./LiquidEther")
      .then((mod) => {
        if (componentMounted) setLiquidEther(() => mod.default || null);
      })
      .catch(() => {

      });
    return () => {
      componentMounted = false;
    };
  }, []);


  const getBackgroundColor = () => {
    if (!backgroundColor) {
      return theme === 'light' ? '#f8fafc' : '#0a0b0f';
    }
    const colorMap = {
      black: theme === 'light' ? '#ffffff' : '#0a0b0f',
      gray: theme === 'light' ? '#e7e5e4' : '#1c1917',
      darkblue: '#334155',
      cream: theme === 'light' ? '#FDF5E6' : '#8B7355',
      white: theme === 'light' ? '#FFFFFF' : '#1F2937'
    };
    return colorMap[backgroundColor] || (theme === 'light' ? '#f8fafc' : '#0a0b0f');
  };


  if (!mounted) {
    return (
      <div style={{ 
        position: "fixed", 
        inset: 0, 
        width: "100vw", 
        height: "100vh", 
        zIndex: 0, 
        background: theme === 'light' ? '#f8fafc' : '#0a0b0f'
      }} />
    );
  }

  return (
  <div style={{ position: "relative", overflow: "hidden" }}>

      {(() => {
        const backgroundStyle = {
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "auto"
        };

        if (backgroundType === 'normal') {
          return (
            <div style={{ 
              ...backgroundStyle,
              background: getBackgroundColor()
            }} />
          );
        }

        switch (backgroundType) {
          case 'liquidether':
            return LiquidEther ? (
              <div style={{ ...backgroundStyle, background: getBackgroundColor() }}>
                <LiquidEther
                  colors={backgroundColor === 'black'
                    ? (theme === 'light' 
                        ? ["#3b82f6", "#8b5cf6", "#06b6d4"]
                        : ["#5227FF", "#FF9FFC", "#B19EEF"]
                      )
                    : backgroundColor === 'white'
                    ? (theme === 'light'
                        ? ["#8b5cf6", "#a855f7", "#c084fc"]
                        : ["#6B5B73", "#8B7E8B", "#A855F7"]
                      )
                    : backgroundColor === 'cream'
                    ? (theme === 'light'
                        ? ["#8B7355", "#A0845C", "#B8956B"]
                        : ["#6B5B4A", "#8B7355", "#A0845C"]
                      )
                    : backgroundColor === 'gray'
                    ? ["#57534e", "#78716c", "#a8a29e"]
                    : backgroundColor === 'darkblue'
                    ? ["#475569", "#64748b", "#94a3b8"]
                    : (theme === 'light' 
                        ? ["#8b5cf6", "#a855f7", "#9333ea"]
                        : ["#5227FF", "#FF9FFC", "#B19EEF"]
                      )
                  }
                  mouseForce={animationsEnabled ? 25 : 0}
                  cursorSize={80}
                  isViscous={true}
                  viscous={40}
                  iterationsViscous={48}
                  iterationsPoisson={48}
                  resolution={0.3}
                  isBounce={false}
                  autoDemo={true}
                  autoSpeed={animationsEnabled ? 0.2 : 3}
                  autoIntensity={animationsEnabled ? 1.8 : 30}
                  takeoverDuration={0.8}
                  autoResumeDelay={animationsEnabled ? 4000 : 500}
                  autoRampDuration={1.2}
                />
              </div>
            ) : (
              <div style={{ 
                ...backgroundStyle, 
                background: theme === 'light' 
                  ? `linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #1F2937 100%)`
                  : `linear-gradient(135deg, #1F2937 0%, #4B5563 50%, #374151 100%)`
              }} />
            );
          
          case 'darkveil':
            return (
              <div style={{ ...backgroundStyle, background: getBackgroundColor() }}>
                <DarkVeil animationsEnabled={animationsEnabled} />
              </div>
            );
          
          case 'lightrays':
            return (
              <div style={{ ...backgroundStyle, background: getBackgroundColor() }}>
                <LightRays 
                  animationsEnabled={animationsEnabled} 
                  backgroundColor={backgroundColor}
                  theme={theme}
                />
              </div>
            );
          
          case 'prism':
            return (
              <div style={{ ...backgroundStyle, background: getBackgroundColor() }}>
                <Prism animationsEnabled={animationsEnabled} />
              </div>
            );
          
          case 'threads':
            return (
              <div style={{ ...backgroundStyle, background: getBackgroundColor() }}>
                <Threads animationsEnabled={animationsEnabled} />
              </div>
            );
          
          default:
            return null;
        }
      })()}


  <section style={{ position: "relative", zIndex: 10, pointerEvents: 'none' }} className="flex flex-col items-center justify-center py-20 text-center">
    <div className="flex items-center gap-3 mb-6" style={{ pointerEvents: 'auto' }}>
          <span className={`text-4xl md:text-5xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Ask</span>
          {animationsEnabled ? (
            <RotatingText
              texts={["anything!", "anytime!", "anywhere!"]}
              mainClassName="px-3 md:px-5 overflow-hidden py-1.5 md:py-2.5 justify-center rounded-lg text-4xl md:text-5xl font-bold"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.045}
              splitLevelClassName="overflow-hidden pb-1"
              transition={{ type: "spring", damping: 60, stiffness: 400, ease: "easeInOut" }}
              rotationInterval={3000}
              style={{ 
                background: (backgroundColor === 'black' || backgroundColor === 'white')
                  ? (theme === 'light' ? '#8b5cf6' : '#6e036eff')
                  : backgroundColor === 'cream'
                  ? (theme === 'light' ? '#8B7355' : '#6B5B4A')
                  : backgroundColor === 'gray'
                  ? '#57534e'
                  : backgroundColor === 'darkblue'
                  ? '#475569'
                  : (theme === 'light' ? '#8b5cf6' : '#6e036eff'),
                color: "white" 
              }}
            />
          ) : (
            <span className="px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg text-4xl md:text-5xl font-bold text-white"
              style={{ 
                background: (backgroundColor === 'black' || backgroundColor === 'white')
                  ? (theme === 'light' ? '#8b5cf6' : '#6e036eff')
                  : backgroundColor === 'cream'
                  ? (theme === 'light' ? '#8B7355' : '#6B5B4A')
                  : backgroundColor === 'gray'
                  ? '#57534e'
                  : backgroundColor === 'darkblue'
                  ? '#475569'
                  : (theme === 'light' ? '#8b5cf6' : '#6e036eff')
              }}
            >
              anything!
            </span>
          )}
        </div>
        <p className={`text-lg md:text-xl max-w-2xl ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Your AI-powered study assistant. Get answers, explanations and guidance whenever you need it.
        </p>
      </section>

    </div>
  );
}

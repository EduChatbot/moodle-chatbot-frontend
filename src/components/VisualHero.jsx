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
  return Component ? <Component animationsEnabled={animationsEnabled} /> : null;
};

const LightRays = ({ animationsEnabled = true }) => {
  const [Component, setComponent] = useState(null);
  useEffect(() => {
    import('./LightRays').then(mod => setComponent(() => mod.default)).catch(() => {});
  }, []);
  return Component ? (
    <Component
      raysOrigin="top-center"
      raysColor="#00ffff"
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
      timeScale={animationsEnabled ? 0.5 : 0.000001}
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
      amplitude={1}
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
      black: '#000000',
      gray: '#6B7280',
      darkblue: '#1E3A8A',
      cream: '#F5F5DC',
      white: '#FFFFFF'
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
                  colors={theme === 'light' 
                    ? ["#3b82f6", "#8b5cf6", "#06b6d4"]
                    : ["#5227FF", "#FF9FFC", "#B19EEF"]
                  }
                  mouseForce={animationsEnabled ? 10 : 0}
                  cursorSize={120}
                  isViscous={false}
                  viscous={30}
                  iterationsViscous={32}
                  iterationsPoisson={32}
                  resolution={0.5}
                  isBounce={false}
                  autoDemo={animationsEnabled}
                  autoSpeed={animationsEnabled ? 0.1 : 0}
                  autoIntensity={animationsEnabled ? 2.2 : 0}
                  takeoverDuration={0.25}
                  autoResumeDelay={3000}
                  autoRampDuration={0.6}
                />
              </div>
            ) : null;
          
          case 'darkveil':
            return (
              <div style={{ ...backgroundStyle, background: getBackgroundColor() }}>
                <DarkVeil animationsEnabled={animationsEnabled} />
              </div>
            );
          
          case 'lightrays':
            return (
              <div style={{ ...backgroundStyle, background: getBackgroundColor() }}>
                <LightRays animationsEnabled={animationsEnabled} />
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
                background: theme === 'light' 
                  ? '#8b5cf6' 
                  : '#6e036eff',
                color: "white" 
              }}
            />
          ) : (
            <span className="px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg text-4xl md:text-5xl font-bold text-white"
              style={{ 
                background: theme === 'light' 
                  ? '#8b5cf6' 
                  : '#6e036eff'
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

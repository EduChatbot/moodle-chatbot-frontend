"use client";

import { useEffect, useState } from "react";
import RotatingText from "./RotatingText";

export default function VisualHero({ logoSrc = "/favicon.ico" }) {
  const [LiquidEther, setLiquidEther] = useState(null);

  useEffect(() => {
    let mounted = true;
    // dynamic import so build won't fail if the module isn't present
    import("./LiquidEther")
      .then((mod) => {
        if (mounted) setLiquidEther(() => mod.default || null);
      })
      .catch(() => {
        // silent: if LiquidEther isn't available, we simply skip it
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
  <div style={{ position: "relative", overflow: "hidden" }}>
      {/* visual effect (optional) - full viewport background */}
      {LiquidEther ? (
        <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 0, pointerEvents: "auto", background: "#080912" }}>
          <LiquidEther
              colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
              mouseForce={10}
              cursorSize={120}
              isViscous={false}
              viscous={30}
              iterationsViscous={32}
              iterationsPoisson={32}
              resolution={0.5}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.1}
              autoIntensity={2.2}
              takeoverDuration={0.25}
              autoResumeDelay={3000}
              autoRampDuration={0.6}
            />
        </div>
      ) : null}

    {/* Hero content sits above the visual */}
  <section style={{ position: "relative", zIndex: 10, pointerEvents: 'none' }} className="flex flex-col items-center justify-center py-20 text-center">
    <div className="flex items-center gap-3 mb-6" style={{ pointerEvents: 'auto' }}>
          <span className="text-4xl md:text-5xl font-bold text-white">Ask</span>
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
            style={{ backgroundColor: "#6e036eff", color: "white" }}
          />
        </div>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
          Your AI-powered study assistant. Get answers, explanations and guidance whenever you need it.
        </p>
      </section>
    </div>
  );
}

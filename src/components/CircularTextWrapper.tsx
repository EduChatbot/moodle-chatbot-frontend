"use client";
import './CircularText.css';
import CircularText from "@/components/CircularText";
import { useAnimation } from "@/contexts/AnimationContext";

export default function CircularTextWrapper() {
  const { animationsEnabled } = useAnimation();

  if (!animationsEnabled) {
    const text = "ASK*EXPLORE*MASTER*";
    const letters = Array.from(text);
    
    return (
      <div style={{ position: 'fixed', right: 12, top: 12, pointerEvents: 'auto', zIndex: 40, transform: 'scale(0.7)', transformOrigin: 'top right' }}>
        <div className="circular-text static">
          {letters.map((letter, i) => {
            const rotationDeg = (360 / letters.length) * i;
            const factor = Math.PI / letters.length;
            const x = factor * i;
            const y = factor * i;
            const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

            return (
              <span key={i} style={{ transform, WebkitTransform: transform }}>
                {letter}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', right: 12, top: 12, pointerEvents: 'auto', zIndex: 40, transform: 'scale(0.7)', transformOrigin: 'top right' }}>
      <CircularText text="ASK*EXPLORE*MASTER*" spinDuration={90} className="string" />
    </div>
  );
}
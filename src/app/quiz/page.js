"use client";

import { Suspense } from "react";
import QuizList from "@/components/QuizList";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";

function QuizContent() {
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();

  const getPageBackground = () => {
    switch(backgroundColor) {
      case 'darkblue':
        return 'bg-gradient-to-br from-slate-950 via-slate-950 to-black';
      case 'cream':
        return theme === 'light' 
          ? 'bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100'
          : 'bg-gradient-to-br from-stone-900 via-stone-950 to-black';
      case 'white':
        return 'bg-white';
      case 'black':
        return 'bg-black';
      case 'gray':
        return theme === 'light'
          ? 'bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200'
          : 'bg-gradient-to-br from-stone-950 via-black to-stone-950';
      default:
        return 'bg-gradient-to-br from-gray-900 to-gray-950';
    }
  };

  return (
    <div className={`min-h-screen ${getPageBackground()}`}>
      <QuizList />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading quizzes...</div>}>
      <QuizContent />
    </Suspense>
  );
}

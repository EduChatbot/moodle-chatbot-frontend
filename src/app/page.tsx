"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import { useMoodle } from "@/contexts/MoodleContext";

function HomeContent() {
  const [backendError, setBackendError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const { setMoodleData } = useMoodle();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const courseId = searchParams.get('courseid');
    const courseName = searchParams.get('coursename');

    console.log('Token from URL:', token ? `${token.substring(0, 20)}...` : 'NOT PROVIDED');
    console.log('Course ID from URL:', courseId || 'NOT PROVIDED');
    console.log('Course Name from URL:', courseName || 'NOT PROVIDED');
    
    if (token || courseId || courseName) {
      setMoodleData(token, courseId, courseName);
      console.log('Saved to MoodleContext');
    } else {
      console.log('No Moodle parameters in URL');
    }
  }, [searchParams, setMoodleData]);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${apiUrl}/health`);
        if (!res.ok) throw new Error(`Backend returned status: ${res.status}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setBackendError(errorMessage);
      }
    };
    
    checkBackend();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section - Compact */}
      <section className="max-w-5xl mx-auto px-4 py-8 pb-4">
        <div className="text-center space-y-4">
          {/* Main Heading with animation */}
          <h1 className={`font-playfair text-4xl md:text-5xl lg:text-6xl font-bold animate-fade-in-down duration-slow ease-bounce ${
            theme === 'light'
              ? backgroundColor === 'cream'
                ? 'bg-gradient-to-r from-stone-700 via-stone-600 to-stone-700 bg-clip-text text-transparent'
                : 'gradient-text-light'
              : backgroundColor === 'gray'
              ? 'bg-gradient-to-r from-zinc-400 via-zinc-300 to-zinc-400 bg-clip-text text-transparent'
              : backgroundColor === 'darkblue'
              ? 'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent'
          }`}>
            Moodle Chatbot
          </h1>
          
          {/* Subheading with different font */}
          <p className={`font-montserrat text-base md:text-lg animate-fade-in-up delay-200 duration-medium ease-smooth max-w-2xl mx-auto ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-200'
          }`}>
            Your AI-Powered Learning Assistant for Smarter Education
          </p>

          {/* CTA Buttons with glassmorphism */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6 animate-scale-in delay-500 duration-slow ease-elastic">
            <Link 
              href="/chat" 
              className="glass-card px-6 py-2.5 font-space text-sm font-semibold
                       hover:scale-105 transition-all duration-300
                       animate-glow-slow group relative overflow-hidden"
              style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
            >
              <span className="relative z-10">Start Chatting</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              href="/about" 
              className="glass-card px-6 py-2.5 font-space text-sm font-semibold
                       hover:scale-105 transition-all duration-300
                       group relative overflow-hidden"
              style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
            >
              <span className="relative z-10">Learn More</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Backend Error Alert - Only shows if backend is down */}
      {backendError && (
        <section className="max-w-4xl mx-auto px-4 pb-6">
          <div className={`glass p-4 rounded-xl animate-fade-in-up duration-fast ease-bounce ${
            theme === 'light'
              ? 'border-2 border-red-300 bg-red-100/80'
              : 'border border-red-400/50 bg-red-500/20'
          }`}>
            <p className={`font-inter text-center ${
              theme === 'light' ? 'text-red-800' : 'text-red-200'
            }`}>
              ⚠️ <strong>Backend Service Unavailable:</strong> {backendError}
            </p>
          </div>
        </section>
      )}

      {/* Quick Links Section */}
      <section className="max-w-6xl mx-auto px-4 py-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/chat" className="group">
            <div className="glass-card p-8 text-center animate-fade-in-left delay-300 duration-slower ease-elastic
                         hover:scale-105 transition-all duration-500">
              <div className="text-5xl mb-3 animate-float-fast">💬</div>
              <h3 className={`font-montserrat text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                AI Chat
              </h3>
              <p className={`font-inter text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Ask questions about your course
              </p>
            </div>
          </Link>

          <Link href="/courses" className="group">
            <div className="glass-card p-8 text-center animate-fade-in-left delay-350 duration-slower ease-elastic
                         hover:scale-105 transition-all duration-500">
              <div className="text-5xl mb-3 animate-float-slow">📚</div>
              <h3 className={`font-montserrat text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                Materials
              </h3>
              <p className={`font-inter text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Browse course resources
              </p>
            </div>
          </Link>

          <Link href="/quiz" className="group">
            <div className="glass-card p-8 text-center animate-fade-in-right delay-400 duration-slower ease-elastic
                         hover:scale-105 transition-all duration-500">
              <div className="text-5xl mb-3 animate-float-slow">📝</div>
              <h3 className={`font-montserrat text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                Quizzes
              </h3>
              <p className={`font-inter text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Test your knowledge
              </p>
            </div>
          </Link>

          <Link href="/dashboard" className="group">
            <div className="glass-card p-8 text-center animate-fade-in-right delay-450 duration-slowest ease-bounce
                         hover:scale-105 transition-all duration-500">
              <div className="text-5xl mb-3 animate-float-fast">📊</div>
              <h3 className={`font-montserrat text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                Dashboard
              </h3>
              <p className={`font-inter text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Track your progress
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

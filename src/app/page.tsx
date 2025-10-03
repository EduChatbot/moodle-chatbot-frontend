"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";

export default function Home() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();

  const fetchHealthCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/health");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthCheck();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section - Compact */}
      <section className="max-w-5xl mx-auto px-4 py-8 pb-4">
        <div className="text-center space-y-4">
          {/* Main Heading with animation */}
          <h1 className={`font-playfair text-4xl md:text-5xl lg:text-6xl font-bold animate-fade-in-down duration-slow ease-bounce ${
            theme === 'light'
              ? 'gradient-text-light'
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
              href="/login" 
              className="glass-card px-6 py-2.5 font-space text-sm font-semibold
                       hover:scale-105 transition-all duration-300
                       animate-glow-slow group relative overflow-hidden"
              style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
            >
              <span className="relative z-10">Get Started</span>
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

      {/* Quick Links Section - Moved Right After Hero */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/courses" className="group">
            <div className="glass-card p-8 text-center animate-fade-in-left delay-300 duration-slower ease-elastic
                         hover:scale-105 transition-all duration-500">
              <div className="text-5xl mb-3 animate-float-slow">📖</div>
              <h3 className={`font-montserrat text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                Browse Courses
              </h3>
              <p className={`font-inter text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Explore all available courses and start learning today
              </p>
            </div>
          </Link>

          <Link href="/chat" className="group">
            <div className="glass-card p-8 text-center animate-fade-in-right delay-400 duration-slowest ease-bounce
                         hover:scale-105 transition-all duration-500">
              <div className="text-5xl mb-3 animate-float-fast">
                💬
              </div>
              <h3 className={`font-montserrat text-xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                Start Chatting
              </h3>
              <p className={`font-inter text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Get instant answers to your questions with our AI assistant
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Backend Health Check Section */}
      <section className="max-w-4xl mx-auto px-4 py-6 pb-12">
        <div className="glass-strong rounded-3xl p-6 shadow-2xl animate-scale-in delay-500 duration-dramatic ease-elastic">
          <h2 className={`font-playfair text-2xl font-bold mb-4 text-center animate-pulse-slow ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            Backend Health Check
          </h2>

          <div className="flex justify-center mb-6">
            <button
              onClick={fetchHealthCheck}
              disabled={loading}
              className={`glass-card px-8 py-3 font-montserrat font-semibold rounded-xl
                       transition-all duration-300 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 animate-glow-fast"
              }`}
              style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
            >
              {loading ? "Loading..." : "Check Health API"}
            </button>
          </div>

          {error && (
            <div className={`glass p-4 rounded-xl animate-fade-in-up duration-fast ease-bounce ${
              theme === 'light'
                ? 'border-2 border-red-300 bg-red-100/80'
                : 'border border-red-400/50 bg-red-500/20'
            }`}>
              <p className={`font-inter text-center ${
                theme === 'light' ? 'text-red-800' : 'text-red-200'
              }`}>
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {healthData && (
            <div className={`glass p-6 rounded-xl animate-fade-in-up duration-medium ease-smooth ${
              theme === 'light'
                ? 'border-2 border-emerald-300 bg-emerald-100/80'
                : 'border border-emerald-400/50 bg-emerald-500/20'
            }`}>
              <p className={`font-space mb-3 text-center font-semibold ${
                theme === 'light' ? 'text-emerald-800' : 'text-emerald-200'
              }`}>
                ✓ API Response
              </p>
              <pre className={`font-mono text-sm whitespace-pre-wrap overflow-x-auto p-4 rounded-lg ${
                theme === 'light'
                  ? 'bg-gray-100 text-gray-800 border border-gray-300'
                  : 'bg-black/30 text-emerald-100'
              }`}>
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

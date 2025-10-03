"use client";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const loginFormRef = useRef(null);
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const router = useRouter();

  useEffect(() => {
    if (error) setShowToast(true);
  }, [error]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, [showToast]);

  // Auto-scroll to login form on mount
  useEffect(() => {
    if (loginFormRef.current) {
      loginFormRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    }
  }, []);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const username = usernameInputRef.current?.value || "";
      const password = passwordInputRef.current?.value || "";
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message = (body && (body.detail || body.error || body.message)) || "Login failed";
        throw new Error(message);
      }

      const status = (body && (body.status || body.Status || body.statusCode || body.result)) || null;
      const okStatus = typeof status === 'string' ? status.toLowerCase() === 'success' : status === true;

      if (!okStatus) {
        const message = (body && (body.detail || body.error || body.message || body.msg)) || "Wrong username or password";
        throw new Error(message);
      }

      console.log("Login successful:", body);
      try { localStorage.setItem("user", JSON.stringify(body)); } catch (e) { }
      window.location.href = "/courses";
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <button 
        onClick={() => router.push('/')}
        className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold hover:scale-105 transition-all duration-300 animate-fade-in-left duration-fast ease-smooth"
        style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
      >
         ← Home
      </button>

      <div ref={loginFormRef} className="w-full max-w-md glass-strong rounded-3xl p-10 shadow-2xl animate-scale-in duration-dramatic ease-elastic">
        <h1 className={`font-playfair text-4xl font-bold mb-2 text-center animate-fade-in-down duration-slow ease-bounce ${
          theme === 'light'
            ? 'gradient-text-light'
            : 'bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent'
        }`}>
          Welcome Back
        </h1>
        
        <p className={`font-inter text-center mb-8 animate-fade-in-up delay-150 duration-medium ease-smooth ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          Sign in to continue your learning journey
        </p>

        <div className="mb-6 animate-fade-in-left delay-250 duration-slower ease-smooth">
          <label className={`font-montserrat text-sm font-semibold mb-2 block ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-200'
          }`}>
            Username
          </label>
          <input
            ref={usernameInputRef}
            type="text"
            placeholder="Enter your username"
            className={`w-full px-4 py-3 rounded-xl glass border font-inter placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
              theme === 'light'
                ? 'border-gray-300 text-gray-900 focus:ring-blue-500/50'
                : 'border-white/30 text-white focus:ring-blue-400/50'
            }`}
          />
        </div>

        <div className="mb-8 animate-fade-in-right delay-350 duration-slower ease-smooth">
          <label className={`font-montserrat text-sm font-semibold mb-2 block ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-200'
          }`}>
            Password
          </label>
          <div className="relative">
            <input
              ref={passwordInputRef}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 rounded-xl glass border font-inter placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                theme === 'light'
                  ? 'border-gray-300 text-gray-900 focus:ring-blue-500/50'
                  : 'border-white/30 text-white focus:ring-blue-400/50'
              }`}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              onMouseEnter={() => setShowPassword(true)}
              onMouseLeave={() => setShowPassword(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:scale-110 transition-transform duration-200"
            >
              {showPassword ? "🫣" : "🙈"}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full glass-card px-8 py-4 font-space text-lg font-semibold rounded-xl transition-all duration-300 animate-scale-in delay-500 duration-slow ease-elastic ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 animate-glow-fast"} relative overflow-hidden group`}
          style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
        >
          <span className="relative z-10">
            {loading ? "Logging in..." : "Login"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {showToast && error && (
          <div className={`mt-6 glass p-4 rounded-xl animate-fade-in-up duration-fast ease-bounce relative ${
            theme === 'light' 
              ? 'border-red-600/50 bg-red-100/80'
              : 'border-red-400/50 bg-red-500/20'
          }`}>
            <button
              onClick={() => setShowToast(false)}
              className={`absolute top-2 right-2 hover:scale-110 transition-all duration-200 text-xl ${
                theme === 'light' ? 'text-red-700 hover:text-red-900' : 'text-red-200 hover:text-white'
              }`}
            >
              ✕
            </button>
            <p className={`font-inter text-sm pr-6 ${
              theme === 'light' ? 'text-red-800' : 'text-red-200'
            }`}>
              {error}
            </p>
          </div>
        )}

        <p className={`font-inter text-center text-sm mt-6 animate-fade-in-up delay-600 duration-medium ease-smooth ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Don't have an account? Contact your administrator.
        </p>
      </div>
    </div>
  );
}

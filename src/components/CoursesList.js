"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import RotatingText from "@/components/RotatingText";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";

function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const router = useRouter();

  useEffect(() => {
    import('ldrs')
      .then((mod) => {
        if (mod && mod.newtonsCradle && typeof mod.newtonsCradle.register === 'function') {
          try { mod.newtonsCradle.register(); } catch (e) { console.warn('ldrs registration failed', e); }
        }
      })
      .catch(() => {
      });

    fetch("http://localhost:8000/courses", {credentials: 'include'})
      .then((res) => res.json())
      .then((data) => {
        try { console.log("Backend response (courses):", JSON.parse(JSON.stringify(data))); } catch (e) { console.log("Backend response (courses, raw):", data); }
        const coursesArray = Array.isArray(data) ? data : data.courses || [];
        setCourses(coursesArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen text-lg gap-4">
      <span className={theme === 'light' ? 'text-gray-700 font-montserrat' : 'text-gray-300 font-montserrat'}>
        Loading courses...
      </span>
      <l-newtons-cradle size="58" speed="1.4" color={theme === 'light' ? '#374151' : 'white'}></l-newtons-cradle>
    </div>
  );

  if (error) return (
    <div className="relative min-h-screen py-16 px-4">
      <button 
        onClick={() => router.push('/')}
        className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold
                   hover:scale-105 transition-all duration-300 animate-fade-in-left duration-fast"
        style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
      >
        ← Home
      </button>
      <div className="max-w-2xl mx-auto text-center pt-20">
        <div className="glass-strong p-8 rounded-3xl animate-scale-in">
          <p className="text-red-500 text-xl font-montserrat font-semibold">
            ⚠️ Connection to backend failed
          </p>
          <p className={`mt-4 font-inter ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Please make sure the backend server is running and try again.
          </p>
        </div>
      </div>
    </div>
  );

  if (!courses || courses.length === 0) return (
    <div className="relative min-h-screen py-16 px-4">
      <button 
        onClick={() => router.push('/')}
        className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold
                   hover:scale-105 transition-all duration-300 animate-fade-in-left duration-fast"
        style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
      >
        ← Home
      </button>
      <div className="max-w-2xl mx-auto text-center pt-20">
        <div className="glass-strong p-8 rounded-3xl animate-scale-in">
          <p className={`text-xl font-montserrat ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            📚 No available courses at this time.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen py-16 px-4">
      <button 
        onClick={() => router.push('/')}
        className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold
                   hover:scale-105 transition-all duration-300 animate-fade-in-left duration-fast"
        style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
      >
        ← Home
      </button>
      
      <section className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down duration-slow ease-bounce">
          <h1 className={`font-playfair text-5xl md:text-6xl font-bold mb-4 ${
            theme === 'light' 
              ? backgroundColor === 'cream'
                ? 'bg-gradient-to-r from-amber-700 via-yellow-800 to-amber-800 bg-clip-text text-transparent'
                : 'gradient-text-light'
              : backgroundColor === 'gray'
              ? 'bg-gradient-to-r from-zinc-400 via-zinc-300 to-zinc-400 bg-clip-text text-transparent'
              : backgroundColor === 'darkblue'
              ? 'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent'
          }`}>
            Available Courses
          </h1>
          <p className={`font-inter text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Select a course to start chatting with your AI assistant
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {courses.map((course, index) => (
            <div
              key={course.id || index}
              onClick={() => setSelectedCourse(course)}
              className={`glass-card p-8 cursor-pointer group animate-fade-in-up
                       transition-all duration-300 hover:scale-105
                       ${index % 2 === 0 ? 'delay-200' : 'delay-350'} duration-slower ease-bounce`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl animate-float-slow">📚</div>
                <div className="flex-1">
                  <h3 className={`font-montserrat text-xl font-bold mb-2 ${
                    theme === 'light' ? 'text-gray-800' : 'text-white'
                  }`}>
                    {typeof course === "string"
                      ? course
                      : course.name || course.title || "Unnamed Course"}
                  </h3>
                  <p className={`font-inter text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Click to open course chat
                  </p>
                </div>
                <div className={`text-2xl transition-transform group-hover:translate-x-2 duration-300 ${
                  theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Course Chat */}
        {selectedCourse && (
          <div className="mt-12 animate-fade-in-up duration-medium ease-smooth">
            <div className="glass-strong p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`font-playfair text-3xl font-bold ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  💬 Chat: {typeof selectedCourse === "string" 
                    ? selectedCourse 
                    : selectedCourse.name || selectedCourse.title || "Course"}
                </h2>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className={`glass-card px-4 py-2 font-montserrat font-semibold rounded-lg
                           hover:scale-105 transition-all duration-300 ${
                    theme === 'light' ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  ✕ Close
                </button>
              </div>
              <ChatWindow course={selectedCourse} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default CoursesList;

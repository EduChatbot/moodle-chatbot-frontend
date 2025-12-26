"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import { useMoodle } from "@/contexts/MoodleContext";

/**
 * CoursesList component - Displays course materials with navigation.
 * Shows all materials from the current course with clickable links to open resources.
 */
function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const { moodleToken, courseId } = useMoodle();
  const router = useRouter();

  useEffect(() => {
    import('ldrs')
      .then((mod) => {
        if (mod?.newtonsCradle?.register) {
          try { mod.newtonsCradle.register(); } catch (e) {}
        }
      })
      .catch(() => {});

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const headers = {};
    if (moodleToken) {
      headers['Authorization'] = `Bearer ${moodleToken}`;
    }

    const url = new URL(`${apiUrl}/course/materials`);
    if (courseId) {
      url.searchParams.append('courseId', courseId);
    }
    
    fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: headers
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        const coursesArray = Array.isArray(data) ? data : data.materials || data.resources || [];
        setCourses(coursesArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching course materials:", err);
        setError(err);
        setLoading(false);
      });
  }, [moodleToken, courseId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen text-lg gap-4">
      <span className={theme === 'light' ? 'text-gray-700 font-montserrat' : 'text-gray-300 font-montserrat'}>
        Loading resources...
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
            Connection to backend failed
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
            No course materials available at this time.
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
            Course Materials
          </h1>
          <p className={`font-inter text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Browse course resources and ask questions about specific materials
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {courses.map((course, index) => {
            const materialUrl = typeof course === "string" 
              ? "#" 
              : course.url || course.link || "#";
            
            const handleClick = () => {
              if (materialUrl && materialUrl !== "#") {
                window.open(materialUrl, '_blank', 'noopener,noreferrer');
              } else {
                console.error('[MATERIAL CLICK] No valid URL found');
                alert('This material does not have a direct link available.');
              }
            };

            return (
              <div
                key={course.id || index}
                onClick={handleClick}
                className={`glass-card p-8 cursor-pointer group animate-fade-in-up
                         transition-all duration-300 hover:scale-105
                         ${index % 2 === 0 ? 'delay-200' : 'delay-350'} duration-slower ease-bounce`}
              >
                <div className="flex items-start gap-4">
                  <img src="/file.svg" alt="Material" className="w-12 h-12 mx-auto animate-float-slow logo-adaptive" />
                  <div className="flex-1">
                    <h3 className={`font-montserrat text-xl font-bold mb-2 ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      {typeof course === "string"
                        ? course
                        : course.name || course.title || "Unnamed Material"}
                    </h3>
                    <p className={`font-inter text-sm ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Click to open material
                    </p>
                  </div>
                  <div className={`text-2xl transition-transform group-hover:translate-x-2 duration-300 ${
                    theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                  }`}>
                    ↗
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default CoursesList;

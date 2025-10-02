"use client";

import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";
import RotatingText from "@/components/RotatingText";
import { useTheme } from "@/contexts/ThemeContext";



function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    import('ldrs')
      .then((mod) => {
        if (mod && mod.newtonsCradle && typeof mod.newtonsCradle.register === 'function') {
          try { mod.newtonsCradle.register(); } catch (e) { console.warn('ldrs registration failed', e); }
        }
      })
      .catch(() => {
        // optional: ignore if the library isn't available in some environments
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

  if (loading) return (<>
    <div className={`flex justify-center items-center min-h-screen text-lg gap-2 mt-15 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
      Loading courses...
      <l-newtons-cradle size="58" speed="1.4" color={theme === 'light' ? '#374151' : 'white'}></l-newtons-cradle>
    </div></>
  );

  if (error) return <><p className="text-red-500 text-lg text-center mt-20">Error: connection to backend failed</p></>;
  if (!courses || courses.length === 0) return <><p className={`text-lg text-center mt-20 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>No available courses.</p></>;

  return (
    <>
      {/* Courses Section */}
      <section className="max-w-xl mx-auto">
        <h3 className={`text-2xl font-serif font-semibold mb-6 text-center ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
          Available Courses
        </h3>
        <ul className="space-y-4">
          {courses.map((course, index) => (
            <li
              key={course.id || index}
              onClick={() => setSelectedCourse(course)}
              className={`
                p-4 rounded-2xl shadow cursor-pointer transition text-lg font-sans
                ${theme === 'light' 
                  ? 'bg-white/80 border border-gray-200 hover:bg-white hover:shadow-lg text-gray-800 backdrop-blur-sm' 
                  : 'bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:shadow-md text-gray-100'
                }
              `}
            >
              {typeof course === "string"
                ? course
                : course.name || course.title || "Unnamed Course"}
            </li>
          ))}
        </ul>

        {selectedCourse && (
          <div className="mt-8">
            <ChatWindow course={selectedCourse} />
          </div>
        )}
      </section>
    </>
  );
}

export default CoursesList;

"use client";

import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";
import RotatingText from "@/components/RotatingText";



function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

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

    fetch("http://localhost:8000/courses")
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response:", data); 
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
    <div className="flex justify-center items-center min-h-screen text-gray-300 text-lg gap-2">
      Loading courses...
      <l-newtons-cradle size="58" speed="1.4" color="white"></l-newtons-cradle>
    </div>
  );

  if (error) return <p className="text-red-500 text-lg text-center mt-20">Error: connection to backend failed</p>;
  if (!courses || courses.length === 0) return <p className="text-gray-400 text-lg text-center mt-20">No available courses.</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans py-12 px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mb-12">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="text-5xl md:text-6xl font-bold text-white">
            Ask
          </span>
          <RotatingText
            texts={["anything!", "anytime!", "anywhere!"]}
            mainClassName="px-4 md:px-6 py-2 rounded-lg text-4xl md:text-5xl font-bold overflow-hidden justify-center"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.045}
            splitLevelClassName="overflow-hidden pb-1"
            transition={{ type: "spring", damping: 60, stiffness: 400, ease: "easeInOut" }}
            rotationInterval={3000}
            style={{ backgroundColor: "oklch(29.1% 0.149 302.717)", color: "white" }}
          />
        </div>
      </section>

      {/* Courses Section */}
      <section className="max-w-xl mx-auto">
        <h3 className="text-2xl font-serif font-semibold mb-6 text-gray-200 text-center">
          Available Courses
        </h3>
        <ul className="space-y-4">
          {courses.map((course, index) => (
            <li
              key={course.id || index}
              onClick={() => setSelectedCourse(course)}
              className="
                p-4 rounded-2xl shadow 
                bg-gray-800 border border-gray-700 
                hover:bg-gray-700 hover:shadow-md 
                cursor-pointer transition 
                text-lg font-sans text-gray-100
              "
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
    </div>
  );
}

export default CoursesList;

"use client";

import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";

function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
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

  if (loading) return <p className="text-gray-600 text-lg">Loading courses...</p>;
  if (error) return <p className="text-red-600 text-lg">Error: connection to backend failed</p>;
  if (!courses || courses.length === 0) return <p className="text-gray-600 text-lg">No available courses.</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Available Courses</h3>
      <ul className="space-y-3">
        {courses.map((course, index) => (
          <li
            key={course.id || index}
            onClick={() => setSelectedCourse(course)}
            className="
              p-4 rounded-2xl shadow 
              bg-white border border-gray-200 
              hover:bg-blue-50 hover:shadow-md 
              cursor-pointer transition
              text-lg text-gray-800
            "
          >
            {typeof course === "string"
              ? course
              : course.name || course.title || "Unnamed Course"}
          </li>
        ))}
      </ul>
        {selectedCourse && <ChatWindow course={selectedCourse} />}
    </div>
  );
}

export default CoursesList;

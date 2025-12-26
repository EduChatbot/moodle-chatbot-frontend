"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MoodleContextType {
  moodleToken: string | null;
  courseId: string | null;
  courseName: string | null;
  setMoodleData: (token: string | null, courseId: string | null, courseName: string | null) => void;
}

const MoodleContext = createContext<MoodleContextType | undefined>(undefined);

/**
 * Moodle authentication context provider
 * Manages Moodle token, course ID, and course name with localStorage persistence
 */
export function MoodleProvider({ children }: { children: ReactNode }) {
  const [moodleToken, setMoodleToken] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseName, setCourseName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('moodle_token');
      const savedCourseId = localStorage.getItem('moodle_courseid');
      const savedCourseName = localStorage.getItem('moodle_coursename');
      
      if (savedToken) setMoodleToken(savedToken);
      if (savedCourseId) setCourseId(savedCourseId);
      if (savedCourseName) setCourseName(savedCourseName);
    }
  }, []);

  /**
   * Updates Moodle authentication data and persists to localStorage
   */
  const setMoodleData = (token: string | null, courseId: string | null, courseName: string | null) => {
    setMoodleToken(token);
    setCourseId(courseId);
    setCourseName(courseName);

    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('moodle_token', token);
      } else {
        localStorage.removeItem('moodle_token');
      }

      if (courseId) {
        localStorage.setItem('moodle_courseid', courseId);
      } else {
        localStorage.removeItem('moodle_courseid');
      }

      if (courseName) {
        localStorage.setItem('moodle_coursename', courseName);
      } else {
        localStorage.removeItem('moodle_coursename');
      }
    }
  };

  return (
    <MoodleContext.Provider value={{ moodleToken, courseId, courseName, setMoodleData }}>
      {children}
    </MoodleContext.Provider>
  );
}

export function useMoodle() {
  const context = useContext(MoodleContext);
  if (context === undefined) {
    throw new Error('useMoodle must be used within a MoodleProvider');
  }
  
  return context;
}

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";
import { useAnimation } from "@/contexts/AnimationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useMoodle } from "@/contexts/MoodleContext";

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { backgroundColor } = useAnimation();
  const { theme } = useTheme();
  const { setMoodleData } = useMoodle();
  
  // Extract Moodle parameters from URL and save to global context
  const moodleToken = searchParams.get('token');
  const courseId = searchParams.get('courseid');
  const courseName = searchParams.get('coursename') || searchParams.get('course') || 'Default Course';

  // Debug info
  useEffect(() => {
    console.log('Token:', moodleToken ? `${moodleToken.substring(0, 20)}...` : 'NOT PROVIDED');
    console.log('Course ID:', courseId || 'NOT PROVIDED');
    console.log('Course Name:', courseName);
    console.log('Full URL:', window.location.href);
  }, []);

  useEffect(() => {
    if (moodleToken || courseId || courseName) {
      setMoodleData(moodleToken, courseId, courseName);
      console.log('✅ Moodle data saved to global context');
    } else {
      console.warn('⚠️ No Moodle parameters found in URL - user may not have access to authenticated features');
    }
  }, [moodleToken, courseId, courseName, setMoodleData]);

  const handleClose = () => {
    router.push('/courses');
  };

  // Define page background based on background color
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

  const getHeaderStyles = () => {
    switch(backgroundColor) {
      case 'darkblue':
        return 'bg-slate-900/30 border-slate-700/30';
      case 'cream':
        return theme === 'light'
          ? 'bg-stone-200/40 border-stone-400/30'
          : 'bg-stone-800/40 border-stone-600/30';
      case 'white':
        return 'bg-gray-100 border-gray-300';
      case 'black':
        return 'bg-gray-900/80 border-purple-500/30';
      case 'gray':
        return theme === 'light'
          ? 'bg-stone-100/40 border-stone-300/30'
          : 'bg-stone-900/30 border-stone-700/20';
      default:
        return 'bg-white/10 border-white/20';
    }
  };

  return (
    <div className={`min-h-screen p-5 ${getPageBackground()}`}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        {/* Header with close button */}
        <div className={`flex justify-between items-center p-4 rounded-xl backdrop-blur-md border-2 ${getHeaderStyles()}`}>
          <h1 style={{ 
            margin: 0, 
            fontSize: "24px", 
            fontWeight: "600"
          }} className={`font-montserrat ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            💬 Chat: {courseName}
          </h1>
          <button
            onClick={handleClose}
            style={{
              padding: "10px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "background-color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#4b5563"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#6b7280"}
            title="Close and return to courses"
          >
            ← Back to Courses
          </button>
        </div>

        {/* Full-size ChatWindow */}
        <div style={{ flex: 1 }}>
          <ChatWindow 
            course={{ name: courseName }}
            isExpanded={true}
          />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}

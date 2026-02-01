"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import { useMoodle } from "@/contexts/MoodleContext";
import Message from "@/components/Message";
import MessageInput from "@/components/MessageInput";

/**
 * ChatWindow component - Interactive AI chat interface for course materials.
 * Handles conversation with AI assistant and displays responses with source materials.
 */
export default function ChatWindow({ 
  course = { name: "Default Course" }, 
  isExpanded = false 
}) {
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const { moodleToken, courseId } = useMoodle();
  const router = useRouter()
  
  // Stany dla trybów
  const [mode, setMode] = useState('quick'); // Styl rozmowy (Quick/Deep/Coach)
  const [domainMode, setDomainMode] = useState('humanities'); // Knowledge profile (Humanities/Science)
  const [judgeEnabled, setJudgeEnabled] = useState(false);

  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return "session-" + Math.random().toString(36).substr(2, 9);
  });

  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you with your learning journey?", fromUser: false, conversationId: null }
  ]);
  const [loading, setLoading] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    if (!tokenChecked) {
      if (!moodleToken) {
        setMessages([
          { 
            text: "Note: You're not authenticated via Moodle. To access personalized content, please open this chat from within Moodle.\n\nI'll try to answer your questions, but backend may require authentication.", 
            fromUser: false,
            conversationId: null
          }
        ]);
      }
      setTokenChecked(true);
    }
  }, [moodleToken, courseId, tokenChecked]);

  const getHistory = () => {
    // Exclude the initial welcome message and the current user message
    return messages.slice(1).map(msg => ({
      role: msg.fromUser ? "user" : "assistant",
      content: msg.text
    }));
  };

  const handleSend = async (text) => {

    const userMessage = { text, fromUser: true, conversationId: null };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    
    try {
      const history = getHistory();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Fallback to localhost if env missing
      const headers = { 
        "Content-Type": "application/json"
      };
      if (moodleToken) {
        headers["Authorization"] = `Bearer ${moodleToken}`;
      }
      
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ 
          message: text,
          history: history,
          courseId: courseId ? courseId.toString() : null,
          sessionId: sessionId,
          mode: mode,          // Quick/Deep/Coach
          domain_mode: domainMode, // humanist/scientific
          judgeEnabled: judgeEnabled,
        })
      });

      if (!response.ok) {
        let errorDetail = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
        } catch (e) {
          errorDetail = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorDetail);
      }

      const data = await response.json();

      let botText = "No server response";
      let sources = null;
      let conversationId = null;
      
      if (typeof data === "string") {
        botText = data;
      } else if (Array.isArray(data)) {
        botText = data.map(item => typeof item === 'string' ? item : JSON.stringify(item)).join(" \n");
      } else if (data && typeof data === 'object') {
        botText = data.response || data.message || data.text || JSON.stringify(data);
        sources = data.sources || null;
        conversationId = data.conversationId || data.conversation_id || null;
      }

      const botMessage = { 
        text: botText,
        fromUser: false,
        sources: sources,
        conversationId: conversationId
      };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error("Error communicating with backend:", error);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const errorMessage = { 
        text: `Error: ${error.message}. Check if backend is running on ${apiUrl}`, 
        fromUser: false,
        conversationId: null
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = () => {
    const courseName = course.name || course.title || "Default Course";
    router.push(`/chat?course=${encodeURIComponent(courseName)}`);
  };

  // Define container styles based on background color
  const getContainerStyles = () => {
    switch(backgroundColor) {
      case 'darkblue':
        return 'glass-strong border-2 border-slate-600/20 shadow-slate-700/20';
      case 'cream':
        return 'glass-strong border-2 border-amber-600/25 shadow-amber-700/15 bg-amber-50/10';
      case 'white':
        return 'bg-white/90 border-2 border-gray-200 shadow-xl';
      case 'black':
        return 'glass-strong border-2 border-purple-400/20 shadow-purple-500/20';
      case 'gray':
        return theme === 'light' 
          ? 'glass-strong border-2 border-stone-300/30 shadow-stone-500/20'
          : 'glass-strong border-2 border-stone-700/10 shadow-stone-800/10';
      default:
        return 'glass-strong';
    }
  };

  const getChatAreaStyles = () => {
    switch(backgroundColor) {
      case 'darkblue':
        return 'glass border border-slate-600/20 bg-slate-950/30';
      case 'cream':
        return 'glass border border-amber-600/20 bg-amber-50/20';
      case 'white':
        return 'bg-gray-50 border border-gray-200';
      case 'black':
        return 'glass border border-purple-400/20 bg-purple-950/30';
      case 'gray':
        return theme === 'light'
          ? 'glass border border-stone-200 bg-stone-50/30'
          : 'glass border border-stone-700/10 bg-black/30';
      default:
        return 'glass';
    }
  };

  return (
    <div className={`${isExpanded ? 'w-full h-full' : 'max-w-4xl w-full mx-auto my-5'} 
                      ${getContainerStyles()} rounded-2xl p-6 shadow-2xl animate-fade-in-up duration-slow`}>

      {/* --- SUBJECT SELECTION --- */}
      <div className="mb-1 text-center">
        <span className="font-semibold text-base text-gray-700 dark:text-gray-200">Subject:</span>
      </div>
      <div className="flex gap-3 mb-3 justify-center pb-3 border-b border-gray-200/20">
        <button
          onClick={() => setDomainMode('humanities')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            domainMode === 'humanities'
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-300 shadow-sm ring-1 ring-indigo-300'
              : 'bg-white/50 text-gray-500 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          Humanities
        </button>
        <button
          onClick={() => setDomainMode('science')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            domainMode === 'science'
              ? 'bg-teal-100 text-teal-700 border border-teal-300 shadow-sm ring-1 ring-teal-300'
              : 'bg-white/50 text-gray-500 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          Science
        </button>
      </div>

      {/* --- MODE SELECTION --- */}
      <div className="mb-1 text-center">
        <span className="font-semibold text-base text-gray-700 dark:text-gray-200">Mode:</span>
      </div>
      <div className="flex gap-2 mb-4 justify-center">
        {/* Quick Answer Mode */}
        <button
          className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 ${mode === 'quick' ? 'bg-blue-600 text-white border-blue-700 shadow' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-blue-100'} `}
          onClick={() => setMode('quick')}
          disabled={mode === 'quick'}
          title="Quick Answer: For students who want a precise, fact-based answer to a specific question."
        >
          Quick Answer
        </button>
        {/* Deep Understanding Mode */}
        <button
          className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 ${mode === 'deep' ? 'bg-green-600 text-white border-green-700 shadow' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-green-100'} `}
          onClick={() => setMode('deep')}
          disabled={mode === 'deep'}
          title="Deep Understanding: Socratic tutor mode."
        >
          Deep Understanding
        </button>
        {/* Exam Coach Mode */}
        <button
          className={`px-4 py-2 rounded-lg font-semibold border transition-all duration-200 ${mode === 'coach' ? 'bg-purple-600 text-white border-purple-700 shadow' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-purple-100'} `}
          onClick={() => setMode('coach')}
          disabled={mode === 'coach'}
          title="Exam Coach: Focuses on what matters for passing exams."
        >
          Exam Coach
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={judgeEnabled}
            onChange={(e) => setJudgeEnabled(e.target.checked)}
          />
          Enhanced performance (experimental)
        </label>
      </div>


      {!isExpanded && (
        <div className="flex justify-between items-center mb-4 animate-fade-in-down delay-200">
          <h2 className={`font-montserrat text-2xl font-bold ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            Chat - {course.name || course.title || "Unnamed Course"}
          </h2>
          <button
            onClick={handleExpand}
            className={`glass-card px-4 py-2 font-space font-semibold rounded-lg 
                        hover:scale-105 transition-all duration-300 flex items-center gap-2 ${
              theme === 'light' ? 'text-gray-800 hover:shadow-lg' : 'text-white hover:shadow-xl'
            }`}
            title="Expand to full chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Expand
          </button>
        </div>
      )}
      <div className={`${isExpanded ? 'h-[calc(100vh-200px)]' : 'h-[400px]'} 
                      mb-4 p-4 rounded-xl overflow-y-auto ${getChatAreaStyles()}
                      animate-scale-in delay-300 duration-slower ease-smooth`}>
        {messages.map((msg, i) => (
          <Message 
            key={i} 
            text={msg.text} 
            fromUser={msg.fromUser} 
            sources={msg.sources}
            conversationId={msg.conversationId}
            moodleToken={moodleToken}
          />
        ))}
        {loading && (
          <div className={`p-3 italic text-center rounded-lg my-2 glass-card animate-pulse ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Typing...
          </div>
        )}
      </div>
      <div className="animate-fade-in-up delay-400 duration-medium">
        <MessageInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import Message from "@/components/Message";
import MessageInput from "@/components/MessageInput";

export default function ChatWindow({ 
  course = { name: "Default Course" }, 
  moodleData = {},
  isExpanded = false 
}) {
  const [messages, setMessages] = useState([
    { text: "Hello! What can I help you with today?", fromUser: false }
  ]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const router = useRouter();
  
  // Extract Moodle data
  const { moodleToken, courseId } = moodleData;

  // Convert messages to history format for backend
  const getHistory = () => {
    // Exclude the initial welcome message and the current user message
    return messages.slice(1).map(msg => ({
      role: msg.fromUser ? "user" : "assistant",
      content: msg.text
    }));
  };

  const handleSend = async (text) => {

    const userMessage = { text, fromUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    
    try {
  console.log("Sending message to backend:", text);
      
      // Get conversation history (excluding the welcome message)
      const history = getHistory();
      console.log("Sending history:", history);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(moodleToken && { "Authorization": `Bearer ${moodleToken}` })
        },
        body: JSON.stringify({ 
          message: text,
          history: history,
          courseId: courseId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      try { console.log("Backend response (parsed):", JSON.parse(JSON.stringify(data))); } catch { console.log("Backend response (raw):", data); }


      let botText = "No server response";
      if (typeof data === "string") {
        botText = data;
      } else if (Array.isArray(data)) {

        botText = data.map(item => (typeof item === 'string' ? item : JSON.stringify(item))).join(" \n");
      } else if (data && typeof data === 'object') {
        botText = data.response || data.message || data.text || JSON.stringify(data);
      }


      const botMessage = { 
        text: botText,
        fromUser: false 
      };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error("Error communicating with backend:", error);


      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const errorMessage = { 
        text: `Error: ${error.message}. Check if backend is running on ${apiUrl}`, 
        fromUser: false 
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
      {!isExpanded && (
        <div className="flex justify-between items-center mb-4 animate-fade-in-down delay-200">
          <h2 className={`font-montserrat text-2xl font-bold ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            💬 Chat - {course.name || course.title || "Unnamed Course"}
          </h2>
          <button
            onClick={handleExpand}
            className={`glass-card px-4 py-2 font-space font-semibold rounded-lg 
                       hover:scale-105 transition-all duration-300 flex items-center gap-2 ${
              theme === 'light' ? 'text-gray-800 hover:shadow-lg' : 'text-white hover:shadow-xl'
            }`}
            title="Expand to full chat"
          >
            <span>⛶</span>
            Expand
          </button>
        </div>
      )}
      <div className={`${isExpanded ? 'h-[calc(100vh-200px)]' : 'h-[400px]'} 
                      mb-4 p-4 rounded-xl overflow-y-auto ${getChatAreaStyles()}
                      animate-scale-in delay-300 duration-slower ease-smooth`}>
        {messages.map((msg, i) => (
          <Message key={i} text={msg.text} fromUser={msg.fromUser} />
        ))}
        {loading && (
          <div className={`p-3 italic text-center rounded-lg my-2 glass-card animate-pulse ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            🤖 Bot is typing...
          </div>
        )}
      </div>
      <div className="animate-fade-in-up delay-400 duration-medium">
        <MessageInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}

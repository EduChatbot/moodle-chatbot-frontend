"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import Message from "@/components/Message";
import MessageInput from "@/components/MessageInput";

export default function ChatWindow({ course = { name: "Default Course" }, isExpanded = false }) {
  const [messages, setMessages] = useState([
    { text: "Hello! I am your chatbot.", fromUser: false }
  ]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const router = useRouter();

  const handleSend = async (text) => {

    const userMessage = { text, fromUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    
    try {
  console.log("Sending message to backend:", text);
      
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      try { console.log("Backend response (parsed):", JSON.parse(JSON.stringify(data))); } catch (e) { console.log("Backend response (raw):", data); }


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


      const errorMessage = { 
        text: `Error: ${error.message}. Check if backend is running on http://127.0.0.1:8000`, 
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

  const containerStyle = isExpanded ? {
    width: "100%",
    height: "100%",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
  } : {
    maxWidth: "900px",
    width: "100%",
    margin: "20px auto",
    border: backgroundColor === 'cream' && theme === 'light' 
      ? "1px solid rgba(210, 180, 140, 0.3)" 
      : theme === 'light' ? "1px solid #ddd" : "1px solid #374151",
    borderRadius: "8px",
    padding: "20px",
    backgroundColor: backgroundColor === 'cream' && theme === 'light'
      ? "rgba(253, 245, 230, 0.8)"
      : theme === 'light' ? "rgba(255, 255, 255, 0.9)" : "rgba(55, 65, 81, 0.8)",
    backdropFilter: "blur(10px)",
    boxShadow: backgroundColor === 'cream' && theme === 'light'
      ? "0 4px 20px rgba(210, 180, 140, 0.2)"
      : theme === 'light' ? "0 2px 10px rgba(0,0,0,0.1)" : "0 4px 20px rgba(0,0,0,0.3)"
  };

  const chatAreaStyle = isExpanded ? {
    height: "calc(100vh - 200px)",
    marginBottom: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "20px",
    borderRadius: "12px",
    overflowY: "auto",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(5px)"
  } : {
    height: "400px",
    marginBottom: "15px",
    backgroundColor: backgroundColor === 'cream' && theme === 'light'
      ? "rgba(253, 245, 230, 0.5)"
      : theme === 'light' ? "#f9f9f9" : "#1f2937",
    padding: "15px",
    borderRadius: "8px",
    overflowY: "auto",
    border: backgroundColor === 'cream' && theme === 'light'
      ? "1px solid rgba(210, 180, 140, 0.2)"
      : theme === 'light' ? "1px solid #e0e0e0" : "1px solid #374151"
  };

  return (
    <div style={containerStyle}>
      {!isExpanded && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2>Chat Window - {course.name || course.title || "Unnamed Course"}</h2>
          <button
            onClick={handleExpand}
            style={{
              padding: "8px 12px",
              backgroundColor: backgroundColor === 'cream' && theme === 'light' ? "#D2B48C" : "#8b5cf6",
              color: backgroundColor === 'cream' && theme === 'light' ? "#422919" : "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              transition: "background-color 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = backgroundColor === 'cream' && theme === 'light' ? "#CD853F" : "#7c3aed"}
            onMouseOut={(e) => e.target.style.backgroundColor = backgroundColor === 'cream' && theme === 'light' ? "#D2B48C" : "#8b5cf6"}
            title="Expand to full chat"
          >
            <span>⛶</span>
            Expand
          </button>
        </div>
      )}
      <div style={chatAreaStyle}>
        {messages.map((msg, i) => (
          <Message key={i} text={msg.text} fromUser={msg.fromUser} />
        ))}
        {loading && (
          <div style={{ 
            padding: "10px", 
            fontStyle: "italic", 
            color: "#666",
            textAlign: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
            margin: "5px 0"
          }}>
            Bot is typing...
          </div>
        )}
      </div>
      <MessageInput onSend={handleSend} disabled={loading} />
    </div>
  );
}

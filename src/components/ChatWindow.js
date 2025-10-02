"use client";

import { useState } from "react";
import Message from "@/components/Message";
import MessageInput from "@/components/MessageInput";

export default function ChatWindow({ course = { name: "Default Course" } }) {
  const [messages, setMessages] = useState([
    { text: "Hello! I am your chatbot.", fromUser: false }
  ]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ maxWidth: "900px", width: "100%", margin: "20px auto", border: "1px solid #ddd", borderRadius: "8px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2>Chat Window - {course.name || course.title || "Unnamed Course"}</h2>
      <div style={{ height: "400px", marginBottom: "15px", backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "8px", overflowY: "auto", border: "1px solid #e0e0e0" }}>
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

"use client"; // potrzebne do użycia hooków w App Router

import { useState } from "react";
import Message from "@/components/Message";
import MessageInput from "@/components/MessageInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { text: "Hello! I’m your chatbot.", fromUser: false }
  ]);

  const handleSend = (text) => {
    setMessages([...messages, { text, fromUser: true }]);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
      <h2>Chat Window</h2>
      <div style={{ minHeight: "200px", marginBottom: "10px" }}>
        {messages.map((msg, i) => (
          <Message key={i} text={msg.text} fromUser={msg.fromUser} />
        ))}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
}

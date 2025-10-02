"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import ChatWindow from "@/components/ChatWindow";

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseName = searchParams.get('course') || 'Default Course';

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        {/* Header with close button */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "15px 20px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: "24px", 
            fontWeight: "600",
            color: "inherit"
          }}>
            Chat: {courseName}
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

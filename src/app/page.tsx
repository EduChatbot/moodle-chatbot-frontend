"use client";

import { useEffect, useState } from "react";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the health check API
  const fetchHealthCheck = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/health");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log(data); 
      setHealthData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error fetching data:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch data on component mount
  useEffect(() => {
    fetchHealthCheck();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Moodle Chatbot Frontend</h1>
      
      {/* ChatWindow */}
      <ChatWindow />
      
      <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h2>Backend Health Check</h2>
        
        <button 
          onClick={fetchHealthCheck}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Loading..." : "Check Health API"}
        </button>

        {error && (
          <div style={{ 
            marginTop: "10px", 
            padding: "10px", 
            backgroundColor: "#ffebee", 
            color: "#c62828",
            borderRadius: "5px"
          }}>
            Błąd: {error}
          </div>
        )}

        {healthData && (
          <div style={{ 
            marginTop: "10px", 
            padding: "10px", 
            backgroundColor: "#e8f5e8", 
            color: "#2e7d32",
            borderRadius: "5px"
          }}>
            <strong>Odpowiedź API:</strong>
            <pre style={{ marginTop: "5px" }}>
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ 
          marginTop: "15px", 
          padding: "10px", 
          backgroundColor: "#e3f2fd",
          borderRadius: "5px",
          fontSize: "14px"
        }}>
        </div>
      </div>
    </div>
  );
}
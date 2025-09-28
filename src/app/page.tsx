"use client";

import { useEffect, useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import RotatingText from "@/components/RotatingText";

export default function Home() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/health");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setHealthData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthCheck();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl md:text-5xl font-bold text-white">
            Ask
          </span>
          <RotatingText
            texts={["anything!", "anytime!", "anywhere!"]}
            mainClassName="px-3 md:px-5 overflow-hidden py-1.5 md:py-2.5 justify-center rounded-lg text-4xl md:text-5xl font-bold"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.045}
            splitLevelClassName="overflow-hidden pb-1"
            transition={{ type: "spring", damping: 60, stiffness: 400, ease: "easeInOut" }}
            rotationInterval={3000}
            // inline style for OKLCH background
            style={{ backgroundColor: "oklch(29.1% 0.149 302.717)", color: "white" }}
          />
        </div>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
          Your AI-powered study assistant. Get answers, explanations and
          guidance whenever you need it.
        </p>
      </section>

      {/* Chat Window */}
      <section className="max-w-4xl mx-auto px-4 py-8 -mt-25">
        <ChatWindow />
      </section>

      {/* Backend Health Check */}
      <section className="max-w-2xl mx-auto px-4 py-10 -mt-15">
        <div className="bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">
            Backend Health Check
          </h2>

          <button
            onClick={fetchHealthCheck}
            disabled={loading}
            className={`px-5 py-2 rounded-lg font-medium ${
              loading
                ? "bg-gray-600 cursor-not-allowed text-gray-200"
                : "bg-blue-600 hover:bg-blue-700 text-white transition"
            }`}
          >
            {loading ? "Loading..." : "Check Health API"}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-800 text-red-300 rounded-lg">
              Error: {error}
            </div>
          )}

          {healthData && (
            <div className="mt-4 p-3 bg-green-900 text-green-300 rounded-lg text-sm font-mono">
              <strong>API Response:</strong>
              <pre className="mt-2 whitespace-pre-wrap">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

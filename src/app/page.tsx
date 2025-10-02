"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

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
    <>
      <section className="max-w-2xl mx-auto px-4 py-10 -mt-12" style={{ textAlign: 'center' }}>
        <div className="mt-6" >
          <Link href="/login" className="button">
            Login
          </Link>
        </div>
        <div className="mt-6">
          <Link href="/about" className="button">
            About us
          </Link>
        </div>
      </section>


      <section className="max-w-2xl mx-auto px-4 py-10 -mt-15">
        <div className={`rounded-2xl shadow-md p-6 backdrop-blur-sm ${
          theme === 'light' 
            ? 'bg-white/80 border border-gray-200' 
            : 'bg-gray-800'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            theme === 'light' ? 'text-gray-800' : 'text-gray-100'
          }`}>
            Backend Health Check
          </h2>

          <button
            onClick={fetchHealthCheck}
            disabled={loading}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              loading
                ? theme === 'light'
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-gray-600 cursor-not-allowed text-gray-200"
                : theme === 'light'
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Loading..." : "Check Health API"}
          </button>

          {error && (
            <div className={`mt-4 p-3 rounded-lg ${
              theme === 'light'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-red-800 text-red-300'
            }`}>
              Error: {error}
            </div>
          )}

          {healthData && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-mono ${
              theme === 'light'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-green-900 text-green-300'
            }`}>
              <strong>API Response:</strong>
              <pre className="mt-2 whitespace-pre-wrap">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

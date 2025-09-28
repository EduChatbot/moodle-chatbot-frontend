"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CircularText from "@/components/CircularText";

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
    </>
  );
}

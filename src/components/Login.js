"use client";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const { theme } = useTheme();

  // Show toast whenever an error is set
  useEffect(() => {
    if (error) setShowToast(true);
  }, [error]);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, [showToast]);

  const styles = {
    wrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      width: "100vw",
      boxSizing: "border-box",
      overflowX: "hidden",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      background: theme === 'light' ? "rgba(255,255,255,0.9)" : "#1f2937",
      borderRadius: "16px",
      boxShadow: theme === 'light' 
        ? "0 12px 30px rgba(0,0,0,0.1)" 
        : "0 12px 30px rgba(0,0,0,0.6)",
      border: theme === 'light' 
        ? "1px solid rgba(0,0,0,0.1)" 
        : "1px solid rgba(255,255,255,0.08)",
      padding: "32px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      color: theme === 'light' ? "#1f2937" : "#f1f5f9",
      backdropFilter: "blur(10px)",
    },
    title: {
      margin: 0,
      textAlign: "center",
      fontSize: "28px",
      color: theme === 'light' ? "#111827" : "#f8fafc",
      fontWeight: 700,
      fontFamily: "'Merriweather', serif",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "10px",
      border: theme === 'light' 
        ? "1px solid rgba(0,0,0,0.2)" 
        : "1px solid rgba(255,255,255,0.2)",
      fontSize: "16px",
      outline: "none",
      boxSizing: "border-box",
      color: theme === 'light' ? "#111827" : "#f8fafc",
      background: theme === 'light' ? "rgba(255,255,255,0.8)" : "#111827",
      transition: "all 0.3s ease",
    },
    inputWithButtonWrap: {
      position: "relative",
      width: "100%",
    },
    showBtn: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "transparent",
      border: "none",
      color: theme === 'light' ? "#6b7280" : "#9ca3af",
      cursor: "pointer",
      padding: "8px",
      fontSize: "17px",
    },
    button: {
      padding: "14px 18px",
      borderRadius: "10px",
      border: "none",
      background: theme === 'light' 
        ? "linear-gradient(90deg, #3b82f6, #6366f1)" 
        : "linear-gradient(90deg, #3b82f6, #6366f1)",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: theme === 'light' 
        ? "0 8px 20px rgba(59,130,246,0.4)" 
        : "0 8px 20px rgba(99,102,241,0.3)",
      fontSize: "16px",
      transition: "all 0.3s ease",
    },
    meta: {
      marginTop: "8px",
      textAlign: "center",
      color: theme === 'light' ? "#64748b" : "#94a3b8",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card} className="auth-card">
        <h1 style={styles.title}>Welcome Back</h1>

  <input ref={usernameInputRef} type="text" placeholder="Username" style={styles.input} />

        <div style={styles.inputWithButtonWrap} className="password-wrap">
          <input
            ref={passwordInputRef}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            style={styles.input}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
            onMouseEnter={() => setShowPassword(true)}
            onMouseLeave={() => setShowPassword(false)}
            onFocus={() => setShowPassword(true)}
            onBlur={() => setShowPassword(false)}
            style={styles.showBtn}
          >
            {showPassword ?  "🫣" : "🙈"}
          </button>
        </div>

  <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
          <button
            style={styles.button}
            type="button"
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                const username = usernameInputRef.current?.value || "";
                const password = passwordInputRef.current?.value || "";
                const res = await fetch("http://127.0.0.1:8000/api/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ username, password }),
                });
                // Parse response body once
                const body = await res.json().catch(() => ({}));

                // If server returned non-2xx, use body info for the error message
                if (!res.ok) {
                  const message = (body && (body.detail || body.error || body.message)) || "Login failed";
                  throw new Error(message);
                }

                // Expect backend to return a status field (e.g., { status: "success" })
                const status = (body && (body.status || body.Status || body.statusCode || body.result)) || null;
                const okStatus = typeof status === 'string' ? status.toLowerCase() === 'success' : status === true;

                if (!okStatus) {
                  // Prefer human message from the body when available
                  const message = (body && (body.detail || body.error || body.message || body.msg)) || "Wrong username or password";
                  throw new Error(message);
                }

                console.log("Login successful:", body);
                // Store user data (if any token/user fields are returned)
                try { localStorage.setItem("user", JSON.stringify(body)); } catch (e) { /* ignore storage errors */ }
                // redirect to courses
                window.location.href = "/courses";
              } catch (err) {
                console.error(err);
                setError(err.message || "Login failed");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {/* inline fallback removed; use toast instead */}
          {/* toast is handled by effects above */}
        </div>

        <div style={styles.meta}>Need an account? Contact your administrator.</div>

        <style jsx>{`
          .auth-card input::placeholder { 
            color: ${theme === 'light' ? '#9ca3af' : '#6b7280'}; 
          }
          .auth-card input:focus {
            border-color: #3b82f6;
            box-shadow: 0 6px 18px rgba(59,130,246,0.4);
          }
          .auth-card button:hover {
            transform: translateY(-2px);
            box-shadow: ${theme === 'light' 
              ? '0 10px 25px rgba(59,130,246,0.5)' 
              : '0 10px 25px rgba(99,102,241,0.4)'};
          }
          @media (max-width: 480px) {
            .auth-card { padding: 20px; }
            .auth-card h1 { font-size: 24px; }
            .auth-card button { width: 100%; }
          }
        `}</style>
        {/* Toast */}
        <div
          aria-live="assertive"
          style={{
            position: 'fixed',
            right: 20,
            top: 20,
            zIndex: 9999,
            transition: 'transform 260ms ease, opacity 260ms ease',
            transform: showToast ? 'translateX(0)' : 'translateX(20px)',
            opacity: showToast ? 1 : 0,
            pointerEvents: showToast ? 'auto' : 'none',
          }}
        >
          <div style={{ 
            background: theme === 'light' ? '#fef2f2' : '#301212', 
            color: theme === 'light' ? '#dc2626' : '#ffdede', 
            padding: '12px 16px', 
            borderRadius: 8, 
            boxShadow: theme === 'light' 
              ? '0 10px 30px rgba(0,0,0,0.15)' 
              : '0 10px 30px rgba(0,0,0,0.4)', 
            minWidth: 260,
            border: theme === 'light' ? '1px solid #fecaca' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontWeight: 700 }}>Login error</div>
              <button 
                onClick={() => { setShowToast(false); setError(null); }} 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: theme === 'light' ? '#dc2626' : '#ffdede', 
                  cursor: 'pointer' 
                }}
              >✕</button>
            </div>
            <div style={{ 
              marginTop: 8, 
              color: theme === 'light' ? '#dc2626' : '#ffdede' 
            }}>{error}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

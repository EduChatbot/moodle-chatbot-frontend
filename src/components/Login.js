"use client";
import { useState } from "react";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const styles = {
    wrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
      boxSizing: "border-box",
      overflowX: "hidden",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      background: "#1f2937",
      borderRadius: "16px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
      border: "1px solid rgba(255,255,255,0.08)",
      padding: "32px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      color: "#f1f5f9",
    },
    title: {
      margin: 0,
      textAlign: "center",
      fontSize: "28px",
      color: "#f8fafc",
      fontWeight: 700,
      fontFamily: "'Merriweather', serif",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.2)",
      fontSize: "16px",
      outline: "none",
      boxSizing: "border-box",
      color: "#f8fafc",
      background: "#111827",
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
      color: "#9ca3af",
      cursor: "pointer",
      padding: "8px",
      fontSize: "17px",
    },
    button: {
      padding: "14px 18px",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(90deg, #3b82f6, #6366f1)",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 8px 20px rgba(99,102,241,0.3)",
      fontSize: "16px",
      transition: "all 0.3s ease",
    },
    meta: {
      marginTop: "8px",
      textAlign: "center",
      color: "#94a3b8",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card} className="auth-card">
        <h1 style={styles.title}>Welcome Back</h1>

        <input type="text" placeholder="Username" style={styles.input} />

        <div style={styles.inputWithButtonWrap} className="password-wrap">
          <input
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
          <button style={styles.button} type="button">Sign in</button>
        </div>

        <div style={styles.meta}>Need an account? Contact your administrator.</div>

        <style jsx>{`
          .auth-card input::placeholder { color: #6b7280; }
          .auth-card input:focus {
            border-color: #3b82f6;
            box-shadow: 0 6px 18px rgba(59,130,246,0.4);
          }
          .auth-card button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(99,102,241,0.4);
          }
          @media (max-width: 480px) {
            .auth-card { padding: 20px; }
            .auth-card h1 { font-size: 24px; }
            .auth-card button { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}

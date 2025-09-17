"use client";

export default function Login() {
  const styles = {
    wrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px",
      minHeight: "100vh", // fill full viewport height
      width: "100vw", // ensure full viewport width
      position: "relative",
      left: 0,
      top: 0,
      background: "linear-gradient(180deg, #f7fbff 0%, #ffffff 100%)",
      boxSizing: "border-box",
      overflowX: "hidden",
    },
    card: {
      width: "100%",
      maxWidth: "920px",
      background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,252,255,0.98))",
      borderRadius: "12px",
      boxShadow: "0 12px 30px rgba(16,24,40,0.08)",
      border: "1px solid rgba(16,24,40,0.04)",
      padding: "32px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    title: {
      margin: 0,
      textAlign: "center",
      fontSize: "24px",
      color: "#0f172a",
      fontWeight: 700,
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "8px",
      border: "1px solid rgba(15,23,42,0.1)",
      fontSize: "16px",
      outline: "none",
      boxSizing: "border-box",
      color: "#0f172a",
      background: "#ffffff",
    },
    button: {
      padding: "12px 18px",
      borderRadius: "8px",
      border: "none",
      background: "linear-gradient(90deg, #2563eb, #4f46e5)",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
      boxShadow: "0 8px 20px rgba(79,70,229,0.12)",
      fontSize: "15px",
    },
    meta: {
      marginTop: "6px",
      textAlign: "center",
      color: "#64748b",
      fontSize: "13px",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card} className="auth-card">
        <h1 style={styles.title}>Authentication</h1>

        <input type="text" placeholder="Username" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />

        <div style={{ display: "flex", justifyContent: "center", marginTop: "6px" }}>
          <button style={styles.button} type="button">Sign in</button>
        </div>

        <div style={styles.meta}>Need an account? Contact your administrator.</div>

        <style jsx>{`
          .auth-card input::placeholder { color: #7b8794; /* darker placeholder */ }
          .auth-card input { color: #0f172a; }
          .auth-card input:focus { box-shadow: 0 6px 18px rgba(37,99,235,0.12); border-color: rgba(37,99,235,0.6); }
          @media (max-width: 480px) {
            .auth-card { padding: 18px; }
            .auth-card h1 { font-size: 20px; }
            .auth-card button { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function Message({ text, fromUser = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: fromUser ? "flex-end" : "flex-start",
        margin: "8px 0"
      }}
    >
      <div
        style={{
          background: fromUser ? "#0070f3" : "#e8e8e8",
          color: fromUser ? "white" : "#333",
          padding: "12px 16px",
          borderRadius: "16px",
          maxWidth: "75%",
          fontSize: "15px",
          lineHeight: "1.4",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          wordWrap: "break-word"
        }}
      >
        {text}
      </div>
    </div>
  );
}

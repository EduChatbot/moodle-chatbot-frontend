export default function Message({ text, fromUser = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: fromUser ? "flex-end" : "flex-start",
        margin: "6px 0"
      }}
    >
      <div
        style={{
          background: fromUser ? "#0070f3" : "#e5e5ea",
          color: fromUser ? "white" : "black",
          padding: "8px 12px",
          borderRadius: "12px",
          maxWidth: "70%",
        }}
      >
        {text}
      </div>
    </div>
  );
}

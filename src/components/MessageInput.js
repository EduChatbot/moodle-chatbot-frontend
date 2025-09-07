export default function MessageInput({ onSend }) {
  let inputRef;

  const handleSend = () => {
    if (inputRef.value.trim() !== "") {
      onSend(inputRef.value);
      inputRef.value = "";
    }
  };

  return (
    <div style={{ display: "flex", marginTop: "10px" }}>
      <input
        ref={(el) => (inputRef = el)}
        type="text"
        placeholder="Write a message..."
        style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
      />
      <button
        onClick={handleSend}
        style={{
          marginLeft: "8px",
          padding: "8px 16px",
          border: "none",
          borderRadius: "6px",
          background: "#0070f3",
          color: "white",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}

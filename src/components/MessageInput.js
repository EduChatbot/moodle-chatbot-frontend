export default function MessageInput({ onSend, disabled = false }) {
  let inputRef;

  const handleSend = () => {
    if (!disabled && inputRef.value.trim() !== "") {
      onSend(inputRef.value);
      inputRef.value = "";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !disabled) {
      handleSend();
    }
  };

  return (
    <div style={{ display: "flex", marginTop: "15px", gap: "10px" }}>
      <input
        ref={(el) => (inputRef = el)}
        type="text"
        placeholder={disabled ? "Bot is typing..." : "Type a message..."}
        disabled={disabled}
        onKeyUp={handleKeyPress}
        style={{ 
          flex: 1, 
          padding: "12px 15px", 
          borderRadius: "8px", 
          border: "2px solid #ddd",
          backgroundColor: disabled ? "#f5f5f5" : "white",
          cursor: disabled ? "not-allowed" : "text",
          fontSize: "16px",
          color: "#333",
          fontFamily: "Arial, sans-serif",
          outline: "none",
          transition: "border-color 0.2s ease"
        }}
        onFocus={(e) => e.target.style.borderColor = "#0070f3"}
        onBlur={(e) => e.target.style.borderColor = "#ddd"}
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        style={{
          padding: "12px 20px",
          border: "none",
          borderRadius: "8px",
          background: disabled ? "#ccc" : "#0070f3",
          color: "white",
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "600",
          transition: "background-color 0.2s ease",
          minWidth: "80px"
        }}
        onMouseOver={(e) => !disabled && (e.target.style.backgroundColor = "#005bb5")}
        onMouseOut={(e) => !disabled && (e.target.style.backgroundColor = "#0070f3")}
      >
        {disabled ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

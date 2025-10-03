import { useTheme } from '@/contexts/ThemeContext';

export default function MessageInput({ onSend, disabled = false }) {
  const { theme } = useTheme();
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
    <div className="flex mt-4 gap-3">
      <input
        ref={(el) => (inputRef = el)}
        type="text"
        placeholder={disabled ? "Bot is typing..." : "Type a message..."}
        disabled={disabled}
        onKeyUp={handleKeyPress}
        className={`
          flex-1 px-4 py-3 rounded-xl font-inter text-base
          transition-all duration-300 outline-none
          ${theme === 'light'
            ? disabled
              ? 'glass-card text-gray-500 cursor-not-allowed'
              : 'glass-card text-gray-800 border-2 border-gray-300 focus:border-blue-500 focus:shadow-lg'
            : disabled
              ? 'glass text-gray-500 cursor-not-allowed'
              : 'glass text-white border-2 border-white/20 focus:border-blue-400 focus:shadow-xl focus:shadow-blue-500/20'
          }
        `}
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className={`
          px-6 py-3 rounded-xl font-space font-bold text-base min-w-[100px]
          transition-all duration-300 hover:scale-105 active:scale-95
          ${disabled
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : theme === 'light'
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl shadow-blue-200'
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl hover:shadow-2xl shadow-blue-900/50'
          }
        `}
      >
        {disabled ? "✨ Sending..." : "Send →"}
      </button>
    </div>
  );
}

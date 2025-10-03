import { useTheme } from '@/contexts/ThemeContext';
import { useAnimation } from '@/contexts/AnimationContext';

export default function MessageInput({ onSend, disabled = false }) {
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
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

  // Define button styles based on background color
  const getButtonStyles = () => {
    if (disabled) return 'bg-gray-400 text-gray-600 cursor-not-allowed';
    
    switch(backgroundColor) {
      case 'darkblue':
        return 'bg-slate-900 text-white hover:bg-black shadow-lg hover:shadow-xl shadow-slate-800/30';
      case 'cream':
        return 'bg-amber-800 text-white hover:bg-amber-900 shadow-lg hover:shadow-xl shadow-amber-700/30';
      case 'white':
        return 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl shadow-blue-400/40';
      case 'black':
        return 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl shadow-purple-500/30';
      case 'gray':
        return theme === 'light'
          ? 'bg-stone-900 text-white hover:bg-black shadow-lg hover:shadow-xl shadow-stone-800/40'
          : 'bg-stone-800 text-white hover:bg-stone-900 shadow-xl hover:shadow-2xl shadow-stone-700/30';
      default:
        return 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl shadow-blue-200';
    }
  };

  const getInputBorderColor = () => {
    switch(backgroundColor) {
      case 'darkblue':
        return 'border-slate-600/30 focus:border-slate-700';
      case 'cream':
        return 'border-amber-600/30 focus:border-amber-700';
      case 'white':
        return 'border-gray-300 focus:border-blue-500';
      case 'black':
        return 'border-purple-400/30 focus:border-purple-400';
      case 'gray':
        return theme === 'light'
          ? 'border-stone-300 focus:border-stone-700'
          : 'border-stone-600/20 focus:border-stone-500';
      default:
        return 'border-gray-300 focus:border-blue-500';
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
          transition-all duration-300 outline-none border-2
          ${theme === 'light'
            ? disabled
              ? 'glass-card text-gray-500 cursor-not-allowed'
              : `glass-card text-gray-800 ${getInputBorderColor()} focus:shadow-lg`
            : disabled
              ? 'glass text-gray-500 cursor-not-allowed'
              : `glass text-white ${getInputBorderColor()} focus:shadow-xl`
          }
        `}
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className={`
          px-6 py-3 rounded-xl font-space font-bold text-base min-w-[100px]
          transition-all duration-300 hover:scale-105 active:scale-95
          ${getButtonStyles()}
        `}
      >
        {disabled ? "✨ Sending..." : "Send →"}
      </button>
    </div>
  );
}

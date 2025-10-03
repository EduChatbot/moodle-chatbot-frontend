import { useTheme } from '@/contexts/ThemeContext';

export default function Message({ text, fromUser = false }) {
  const { theme } = useTheme();
  
  return (
    <div className={`flex ${fromUser ? 'justify-end' : 'justify-start'} my-2 
                    animate-fade-in-up duration-fast`}>
      <div className={`
        px-4 py-3 rounded-2xl max-w-[75%] font-inter text-[15px] leading-relaxed
        shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]
        ${fromUser 
          ? theme === 'light'
            ? 'bg-blue-500 text-white shadow-blue-200'
            : 'bg-blue-600 text-white shadow-blue-900/50'
          : theme === 'light'
            ? 'glass-card text-gray-800 border border-gray-200'
            : 'glass-strong text-gray-100 border border-white/10'
        }
      `}>
        {text}
      </div>
    </div>
  );
}

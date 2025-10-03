import { useTheme } from '@/contexts/ThemeContext';
import { useAnimation } from '@/contexts/AnimationContext';

export default function Message({ text, fromUser = false }) {
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  
  // Define color schemes based on background color
  const getColorScheme = () => {
    switch(backgroundColor) {
      case 'darkblue':
        return {
          user: 'bg-slate-900 text-white shadow-slate-800/40',
          bot: 'glass-strong text-gray-100 border border-slate-700/25'
        };
      case 'cream':
        return {
          user: 'bg-amber-800 text-white shadow-amber-700/30',
          bot: 'glass-card text-gray-800 border border-amber-600/25 bg-amber-50/30'
        };
      case 'white':
        return {
          user: 'bg-blue-600 text-white shadow-blue-400/40',
          bot: 'bg-white/80 text-gray-800 border border-gray-200 shadow-sm'
        };
      case 'black':
        return {
          user: 'bg-purple-600 text-white shadow-purple-500/30',
          bot: 'glass-strong text-gray-100 border border-purple-400/20'
        };
      case 'gray':
        return {
          user: theme === 'light'
            ? 'bg-stone-900 text-white shadow-stone-800/40'
            : 'bg-stone-800 text-white shadow-stone-700/30',
          bot: theme === 'light'
            ? 'glass-card text-gray-800 border border-stone-300'
            : 'glass-strong text-gray-100 border border-stone-600/15'
        };
      default:
        return {
          user: 'bg-blue-600 text-white shadow-blue-300/40',
          bot: 'glass-card text-gray-800 border border-gray-200'
        };
    }
  };

  const colors = getColorScheme();
  
  return (
    <div className={`flex ${fromUser ? 'justify-end' : 'justify-start'} my-2 
                    animate-fade-in-up duration-fast`}>
      <div className={`
        px-4 py-3 rounded-2xl max-w-[75%] font-inter text-[15px] leading-relaxed
        shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]
        ${fromUser ? colors.user : colors.bot}
      `}>
        {text}
      </div>
    </div>
  );
}

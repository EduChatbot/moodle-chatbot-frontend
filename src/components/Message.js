import { useTheme } from '@/contexts/ThemeContext';
import { useAnimation } from '@/contexts/AnimationContext';

export default function Message({ text, fromUser = false }) {
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
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
          background: fromUser 
            ? (backgroundColor === 'cream' && theme === 'light' ? "#D2B48C" : "#0070f3")
            : (theme === 'light' ? "#f3f4f6" : "#374151"),
          color: fromUser 
            ? (backgroundColor === 'cream' && theme === 'light' ? "#422919" : "white")
            : (theme === 'light' ? "#1f2937" : "#e5e7eb"),
          padding: "12px 16px",
          borderRadius: "16px",
          maxWidth: "75%",
          fontSize: "15px",
          lineHeight: "1.4",
          boxShadow: backgroundColor === 'cream' && theme === 'light'
            ? "0 2px 8px rgba(210,180,140,0.15)"
            : "0 1px 3px rgba(0,0,0,0.1)",
          wordWrap: "break-word"
        }}
      >
        {text}
      </div>
    </div>
  );
}

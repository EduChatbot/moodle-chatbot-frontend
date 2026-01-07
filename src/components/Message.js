import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAnimation } from '@/contexts/AnimationContext';
import ReactMarkdown from 'react-markdown';

export default function Message({ text, fromUser = false, sources = null, conversationId = null, moodleToken = null }) {
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const [showSources, setShowSources] = useState(false);
  const [rating, setRating] = useState(null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  
  const handleRating = async (selectedRating) => {
    setRating(selectedRating);
    
    // Auto-submit rating
    await submitFeedback(selectedRating, feedbackText || null);
  };

  const handleFeedbackSubmit = async () => {
    if (!rating) {
      alert('Please select a rating first');
      return;
    }
    
    await submitFeedback(rating, feedbackText);
  };

  const submitFeedback = async (selectedRating, feedback) => {
    if (!conversationId || !moodleToken) {
      console.warn('Cannot submit feedback: missing conversationId or token');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    setSubmittingFeedback(true);
    
    try {
      const response = await fetch(`${apiUrl}/feedback/conversation/${conversationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${moodleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grade: selectedRating,
          feedback: feedback || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to submit feedback');
      }

      console.log('Conversation feedback submitted successfully');
      // Hide feedback input after successful submission
      setShowFeedbackInput(false);
    } catch (err) {
      console.error('Error submitting conversation feedback:', err);
      alert(`Failed to submit feedback: ${err.message}`);
    } finally {
      setSubmittingFeedback(false);
    }
  };
  
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
                    animate-fade-in-up duration-fast flex-col ${fromUser ? 'items-end' : 'items-start'}`}>
      <div 
        className={`
          px-4 py-3 rounded-2xl max-w-[75%] font-inter text-[15px] leading-relaxed
          shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]
          ${fromUser ? colors.user : colors.bot}
          prose prose-sm max-w-none
          prose-headings:mt-3 prose-headings:mb-2 prose-headings:font-bold
          prose-p:my-1
          prose-pre:bg-gray-900/80 prose-pre:rounded-lg prose-pre:p-3 prose-pre:border prose-pre:border-gray-700/50
          prose-code:before:content-[''] prose-code:after:content-['']
          prose-code:bg-gray-900/60 prose-code:text-emerald-400 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:font-semibold prose-code:border prose-code:border-gray-700/30
          prose-strong:font-bold prose-strong:text-inherit
          prose-em:italic prose-em:text-inherit
          prose-ul:my-2 prose-ol:my-2
          prose-li:my-0.5
        `}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
      
      {/* Sources section - only for bot messages */}
      {!fromUser && sources && sources.length > 0 && (
        <div className="max-w-[75%] mt-2">
          <button
            onClick={() => setShowSources(!showSources)}
            className={`glass-card px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {showSources ? 'Hide' : 'Show'} Sources ({sources.length})
            <span className="text-[10px]">{showSources ? '▲' : '▼'}</span>
          </button>
          
          {showSources && (
            <div className="mt-2 space-y-2 animate-fade-in-up">
              {sources.map((source, idx) => (
                <div
                  key={idx}
                  className={`glass-card p-3 rounded-lg text-xs border ${
                    theme === 'light' 
                      ? 'border-gray-300 text-gray-700' 
                      : 'border-gray-600/30 text-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-bold text-sm">
                      {source.fileName || source.material_name || 'Material'}
                    </span>
                    {(source.metadata?.page !== undefined) && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/50 text-blue-300'
                      }`}>
                        Page {source.metadata.page}
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-[11px] leading-relaxed mt-2 p-2 rounded ${
                    theme === 'light' ? 'bg-gray-50' : 'bg-black/30'
                  }`}>
                    {source.chunkText || source.chunk_text}
                  </p>
                  
                  {(source.chunkId || source.materialId) && (
                    <div className="mt-1 text-[10px] opacity-70">
                      Chunk #{source.chunkId} • Material #{source.materialId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rating and Feedback - only for bot messages */}
      {!fromUser && (
        <div className="max-w-[75%] mt-2">
          <div className={`glass-card p-3 rounded-lg border ${
            theme === 'light'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-amber-900/20 border-amber-800/30'
          }`}>
            <p className={`text-xs font-semibold mb-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Rate this response:
            </p>
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  disabled={submittingFeedback || !conversationId}
                  className="text-2xl hover:scale-110 transition-transform disabled:opacity-50"
                  title={!conversationId ? 'Rating not available for this message' : ''}
                >
                  {rating >= star ? '⭐' : '☆'}
                </button>
              ))}
              <span className={`text-xs ml-1 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {rating === 1 && '(Very Poor)'}
                {rating === 2 && '(Poor)'}
                {rating === 3 && '(Average)'}
                {rating === 4 && '(Good)'}
                {rating === 5 && '(Excellent)'}
              </span>
            </div>
            
            {!conversationId && (
              <p className={`text-xs italic ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Feedback not available for this message
              </p>
            )}
            
            {conversationId && !showFeedbackInput ? (
              <button
                onClick={() => setShowFeedbackInput(true)}
                className={`text-xs px-2 py-1 rounded transition-all ${
                  theme === 'light'
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                + Add feedback
              </button>
            ) : conversationId ? (
              <div className="space-y-2 animate-fade-in-up">
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={2}
                  className={`w-full p-2 rounded border text-xs ${
                    theme === 'light'
                      ? 'bg-white border-gray-300 text-gray-800'
                      : 'bg-gray-800 border-gray-600 text-gray-200'
                  }`}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={submittingFeedback}
                    className={`text-xs px-2 py-1 rounded font-semibold transition-all disabled:opacity-50 ${
                      theme === 'light'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    onClick={() => setShowFeedbackInput(false)}
                    className={`text-xs px-2 py-1 rounded transition-all ${
                      theme === 'light'
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

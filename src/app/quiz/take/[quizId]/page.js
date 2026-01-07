"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import { useMoodle } from "@/contexts/MoodleContext";

export default function TakeQuizPage() {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState([]);
  const [questionRatings, setQuestionRatings] = useState({});
  const [showFeedbackInput, setShowFeedbackInput] = useState({});
  const [feedbackTexts, setFeedbackTexts] = useState({});
  const [submittingFeedback, setSubmittingFeedback] = useState({});
  
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const { moodleToken } = useMoodle();
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId;

  useEffect(() => {
    if (!moodleToken) {
      alert("Authentication required");
      router.push('/quiz');
      return;
    }

    fetchQuiz();
  }, [quizId, moodleToken]);

  const fetchQuiz = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
      const response = await fetch(`${apiUrl}/quiz/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${moodleToken}`
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setQuiz(data);
      setAnswers(new Array(data.questions.length).fill(null));
    } catch (err) {
      console.error("Error fetching quiz:", err);
      alert(`Failed to load quiz: ${err.message}`);
      router.push('/quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting");
      return;
    }

    setSubmitting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    console.log('[TakeQuiz] Submitting quiz with token:', moodleToken ? `${moodleToken.substring(0, 20)}...` : 'NO TOKEN');
    console.log('[TakeQuiz] Submit URL:', `${apiUrl}/quiz/submit`);
    
    try {
      const response = await fetch(`${apiUrl}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${moodleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quizId: parseInt(quizId),
          answers: answers
        })
      });
      
      console.log('[TakeQuiz] Submit response status:', response.status);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setResult(data);
      
      // Fetch full attempt details to get explanation and source
      const attemptResponse = await fetch(`${apiUrl}/quiz/attempt/${data.attemptId}`, {
        headers: {
          'Authorization': `Bearer ${moodleToken}`
        }
      });
      
      if (attemptResponse.ok) {
        const attemptData = await attemptResponse.json();
        // Update quiz with full question details including explanation and source
        setQuiz({
          ...quiz,
          questions: attemptData.questions
        });
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert(`Failed to submit quiz: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuestionRating = async (questionIndex, questionId, rating) => {
    setQuestionRatings(prev => ({ ...prev, [questionIndex]: rating }));
    
    // Auto-submit rating
    await submitQuestionFeedback(questionIndex, questionId, rating, feedbackTexts[questionIndex] || null);
  };

  const handleFeedbackSubmit = async (questionIndex, questionId) => {
    const rating = questionRatings[questionIndex];
    const feedback = feedbackTexts[questionIndex];
    
    if (!rating) {
      alert('Please select a rating first');
      return;
    }
    
    await submitQuestionFeedback(questionIndex, questionId, rating, feedback);
  };

  const submitQuestionFeedback = async (questionIndex, questionId, rating, feedback) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    setSubmittingFeedback(prev => ({ ...prev, [questionIndex]: true }));
    
    try {
      const response = await fetch(`${apiUrl}/feedback/quiz-question`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${moodleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionId: questionId,
          grade: rating,
          feedback: feedback || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to submit feedback');
      }

      console.log('Feedback submitted successfully for question', questionId);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert(`Failed to submit feedback: ${err.message}`);
    } finally {
      setSubmittingFeedback(prev => ({ ...prev, [questionIndex]: false }));
    }
  };

  const getPageBackground = () => {
    switch(backgroundColor) {
      case 'darkblue':
        return 'bg-gradient-to-br from-slate-950 via-slate-950 to-black';
      case 'cream':
        return theme === 'light' 
          ? 'bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100'
          : 'bg-gradient-to-br from-stone-900 via-stone-950 to-black';
      case 'white':
        return 'bg-white';
      case 'black':
        return 'bg-black';
      case 'gray':
        return theme === 'light'
          ? 'bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200'
          : 'bg-gradient-to-br from-stone-950 via-black to-stone-950';
      default:
        return 'bg-gradient-to-br from-gray-900 to-gray-950';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${getPageBackground()} flex items-center justify-center`}>
        <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
          Loading quiz...
        </p>
      </div>
    );
  }

  if (result) {
    return (
      <div className={`min-h-screen ${getPageBackground()} py-16 px-4`}>
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 text-center">
            <h1 className={`font-playfair text-4xl font-bold mb-6 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              {result.passed ? 'Congratulations!' : 'Keep Learning!'}
            </h1>
            
            <div className={`text-6xl font-bold mb-4 ${
              result.percentage >= 60 
                ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
                : (theme === 'light' ? 'text-red-600' : 'text-red-400')
            }`}>
              {result.percentage}%
            </div>
            
            <p className={`text-xl mb-8 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              You scored {result.score} out of {result.totalQuestions}
            </p>

            {/* Show correct answers */}
            <div className="text-left mb-8">
              <h2 className={`font-montserrat text-xl font-bold mb-4 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                Review Your Answers
              </h2>
              {quiz.questions.map((q, idx) => (
                <div key={idx} className="mb-4 p-4 glass-card">
                  <p className={`font-semibold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    {idx + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, optIdx) => {
                      const isCorrect = result.correctAnswers[idx] === optIdx;
                      const isUserAnswer = answers[idx] === optIdx;
                      
                      return (
                        <div
                          key={optIdx}
                          className={`p-2 rounded ${
                            isCorrect 
                              ? 'bg-green-500/20 border border-green-500' 
                              : isUserAnswer 
                              ? 'bg-red-500/20 border border-red-500'
                              : 'opacity-50'
                          }`}
                        >
                          {isCorrect && '✓ '}
                          {isUserAnswer && !isCorrect && '✗ '}
                          {option}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Explanation - Collapsible */}
                  {(q.explanation || q.source) && (
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          const newExpanded = [...expandedExplanations];
                          newExpanded[idx] = !newExpanded[idx];
                          setExpandedExplanations(newExpanded);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                          theme === 'light' 
                            ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' 
                            : 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-300'
                        }`}
                      >
                        {expandedExplanations[idx] ? '▼' : '▶'} Show Explanation & Source
                      </button>
                      
                      {expandedExplanations[idx] && (
                        <div className="mt-2 space-y-2 animate-fade-in-up">
                          {q.explanation && (
                            <div className={`p-3 rounded-lg ${
                              theme === 'light' ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/20 border border-blue-700/30'
                            }`}>
                              <p className={`text-sm font-semibold mb-1 ${
                                theme === 'light' ? 'text-blue-800' : 'text-blue-300'
                              }`}>
                                Explanation:
                              </p>
                              <p className={`text-sm ${
                                theme === 'light' ? 'text-blue-700' : 'text-blue-200'
                              }`}>
                                {q.explanation}
                              </p>
                            </div>
                          )}
                          
                          {q.source && (
                            <div className={`p-3 rounded-lg ${
                              theme === 'light' ? 'bg-gray-50 border border-gray-200' : 'bg-gray-800/30 border border-gray-700/30'
                            }`}>
                              <p className={`text-sm font-semibold mb-1 ${
                                theme === 'light' ? 'text-gray-800' : 'text-gray-300'
                              }`}>
                                Source:
                              </p>
                              <p className={`text-xs font-mono mb-2 ${
                                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {q.source.fileName || q.source}
                              </p>
                              {q.source.chunkText && (
                                <p className={`text-sm ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                }`}>
                                  {q.source.chunkText}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rating and Feedback Section */}
                  <div className="mt-3">
                    <div className={`p-3 rounded-lg border ${
                      theme === 'light'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-amber-900/20 border-amber-800/30'
                    }`}>
                      <p className={`text-xs font-semibold mb-2 ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        Rate this question:
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleQuestionRating(idx, q.id, star)}
                            disabled={submittingFeedback[idx]}
                            className="text-2xl hover:scale-110 transition-transform disabled:opacity-50"
                          >
                            {questionRatings[idx] >= star ? '⭐' : '☆'}
                          </button>
                        ))}
                        <span className={`text-xs ml-1 ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {questionRatings[idx] === 1 && '(Poor)'}
                          {questionRatings[idx] === 2 && '(Average)'}
                          {questionRatings[idx] === 3 && '(Good)'}
                        </span>
                      </div>
                      
                      {!showFeedbackInput[idx] ? (
                        <button
                          onClick={() => setShowFeedbackInput(prev => ({ ...prev, [idx]: true }))}
                          className={`text-xs px-2 py-1 rounded transition-all ${
                            theme === 'light'
                              ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          }`}
                        >
                          + Add feedback
                        </button>
                      ) : (
                        <div className="space-y-2 animate-fade-in-up">
                          <textarea
                            value={feedbackTexts[idx] || ''}
                            onChange={(e) => setFeedbackTexts(prev => ({ ...prev, [idx]: e.target.value }))}
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
                              onClick={() => handleFeedbackSubmit(idx, q.id)}
                              disabled={submittingFeedback[idx]}
                              className={`text-xs px-2 py-1 rounded font-semibold transition-all disabled:opacity-50 ${
                                theme === 'light'
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              {submittingFeedback[idx] ? 'Submitting...' : 'Submit'}
                            </button>
                            <button
                              onClick={() => setShowFeedbackInput(prev => ({ ...prev, [idx]: false }))}
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
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/quiz')}
                className="glass-card px-8 py-3 font-montserrat font-semibold hover:scale-105 transition-all"
              >
                Back to Quizzes
              </button>
              <button
                onClick={() => {
                  if (!moodleToken) {
                    alert("Authentication required");
                    router.push('/quiz');
                    return;
                  }
                  setResult(null);
                  setAnswers(new Array(quiz.questions.length).fill(null));
                  setExpandedExplanations([]);
                }}
                className="glass-card px-8 py-3 font-montserrat font-semibold hover:scale-105 transition-all"
              >
                Retry Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getPageBackground()} py-16 px-4`}>
      <button 
        onClick={() => router.push('/quiz')}
        className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold hover:scale-105 transition-all"
        style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
      >
        ← Back
      </button>

      <div className="max-w-3xl mx-auto pt-8">
        <div className="glass-card p-8 mb-8">
          <h1 className={`font-playfair text-3xl font-bold mb-2 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            {quiz.quizTitle}
          </h1>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {quiz.questions.length} Questions
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, qIdx) => (
            <div key={qIdx} className="glass-card p-6">
              <p className={`font-montserrat font-bold text-lg mb-4 ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                {qIdx + 1}. {question.question}
              </p>
              
              <div className="space-y-3">
                {question.options.map((option, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleAnswerSelect(qIdx, oIdx)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      answers[qIdx] === oIdx
                        ? 'bg-blue-500/30 border-2 border-blue-500'
                        : 'glass-card hover:scale-105'
                    }`}
                  >
                    <span className={theme === 'light' ? 'text-gray-800' : 'text-gray-200'}>
                      {String.fromCharCode(65 + oIdx)}. {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting || answers.includes(null)}
            className="glass-card px-12 py-4 font-montserrat font-bold text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : '✓ Submit Quiz'}
          </button>
          {answers.includes(null) && (
            <p className={`mt-2 text-sm ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
              Please answer all questions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

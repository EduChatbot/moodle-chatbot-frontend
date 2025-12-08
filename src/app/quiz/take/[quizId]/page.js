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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiUrl}/api/v1/quiz/${quizId}`, {
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    try {
      const response = await fetch(`${apiUrl}/api/v1/quiz/submit`, {
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

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert(`Failed to submit quiz: ${err.message}`);
    } finally {
      setSubmitting(false);
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
                onClick={() => window.location.reload()}
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
        onClick={() => router.push('/')}
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

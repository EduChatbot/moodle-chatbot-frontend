"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import { useMoodle } from "@/contexts/MoodleContext";

export default function QuizResultsPage() {
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const { moodleToken } = useMoodle();
  const router = useRouter();
  const params = useParams();
  const attemptId = params.attemptId;

  useEffect(() => {
    if (!moodleToken) {
      alert("Authentication required");
      router.push('/quiz');
      return;
    }

    fetchAttemptDetails();
  }, [attemptId, moodleToken]);

  const fetchAttemptDetails = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    console.log('[QuizResults] Fetching attempt details with token:', moodleToken ? `${moodleToken.substring(0, 20)}...` : 'NO TOKEN');
    console.log('[QuizResults] URL:', `${apiUrl}/quiz/attempt/${attemptId}`);
    
    try {
      const response = await fetch(`${apiUrl}/quiz/attempt/${attemptId}`, {
        headers: {
          'Authorization': `Bearer ${moodleToken}`
        }
      });
      
      console.log('[QuizResults] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[QuizResults] Received data:', data);
      setAttempt(data);
    } catch (err) {
      console.error("Error fetching attempt details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPageBackground = () => {
    switch(backgroundColor) {
      case 'darkblue':
        return 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900';
      case 'cream':
        return 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100';
      case 'white':
        return 'bg-white';
      case 'black':
        return 'bg-gradient-to-br from-black via-purple-950 to-black';
      case 'gray':
        return theme === 'light'
          ? 'bg-gradient-to-br from-stone-100 via-gray-50 to-stone-200'
          : 'bg-gradient-to-br from-gray-950 via-stone-900 to-gray-950';
      default:
        return theme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${getPageBackground()} flex items-center justify-center`}>
        <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
          Loading results...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${getPageBackground()} py-16 px-4`}>
        <button 
          onClick={() => router.push('/quiz')}
          className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold hover:scale-105 transition-all"
          style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
        >
          ← Back
        </button>
        <div className="max-w-2xl mx-auto pt-24">
          <div className="glass-card p-8 text-center">
            <p className={`text-xl ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
              Error: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className={`min-h-screen ${getPageBackground()} py-16 px-4`}>
        <button 
          onClick={() => router.push('/quiz')}
          className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold hover:scale-105 transition-all"
          style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
        >
          ← Back
        </button>
        <div className="max-w-2xl mx-auto pt-24">
          <div className="glass-card p-8 text-center">
            <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
              No attempt data found
            </p>
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
        {/* Header */}
        <div className="glass-card p-8 mb-8">
          <h1 className={`font-playfair text-3xl font-bold mb-4 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            {attempt.quizTitle}
          </h1>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="glass p-4 rounded-lg">
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Score
              </p>
              <p className={`text-3xl font-bold ${
                attempt.percentage >= 60 
                  ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
                  : (theme === 'light' ? 'text-red-600' : 'text-red-400')
              }`}>
                {attempt.percentage}%
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {attempt.score}/{attempt.totalQuestions} correct
              </p>
            </div>
            
            <div className="glass p-4 rounded-lg">
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Completed
              </p>
              <p className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                {new Date(attempt.completedAt).toLocaleDateString()}
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {new Date(attempt.completedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className={`font-montserrat text-2xl font-bold mb-4 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            Questions Review
          </h2>
          
          {attempt.questions && attempt.questions.map((question, qIdx) => {
            const userAnswer = attempt.userAnswers[qIdx];
            const correctAnswer = question.correctAnswer;
            const isCorrect = userAnswer === correctAnswer;
            
            return (
              <div key={qIdx} className="glass-card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className={`text-2xl ${
                    isCorrect 
                      ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
                      : (theme === 'light' ? 'text-red-600' : 'text-red-400')
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <p className={`font-montserrat font-bold text-lg flex-1 ${
                    theme === 'light' ? 'text-gray-800' : 'text-white'
                  }`}>
                    {qIdx + 1}. {question.question}
                  </p>
                </div>

                <div className="space-y-2 ml-11">
                  {question.options.map((option, optIdx) => {
                    const isCorrectOption = optIdx === correctAnswer;
                    const isUserAnswer = optIdx === userAnswer;
                    
                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg border-2 ${
                          isCorrectOption 
                            ? 'bg-green-500/20 border-green-500' 
                            : isUserAnswer 
                            ? 'bg-red-500/20 border-red-500'
                            : theme === 'light'
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-gray-800/30 border-gray-700/30'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isCorrectOption && (
                            <span className="text-green-600 font-bold">✓ Correct:</span>
                          )}
                          {isUserAnswer && !isCorrectOption && (
                            <span className="text-red-600 font-bold">✗ Your answer:</span>
                          )}
                          <span className={
                            theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                          }>
                            {option}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center mt-8 mb-16">
          <button
            onClick={() => router.push('/quiz')}
            className="glass-card px-8 py-3 font-montserrat font-semibold hover:scale-105 transition-all"
          >
            Back to Quizzes
          </button>
          {attempt.quizId && (
            <button
              onClick={() => router.push(`/quiz/take/${attempt.quizId}`)}
              className="glass-card px-8 py-3 font-montserrat font-semibold hover:scale-105 transition-all"
            >
              Retake Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

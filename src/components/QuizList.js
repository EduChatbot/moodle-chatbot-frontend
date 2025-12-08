"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import { useMoodle } from "@/contexts/MoodleContext";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [quizMode, setQuizMode] = useState('all'); // 'all' | 'material' | 'topic'
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const { moodleToken, courseId } = useMoodle();
  const router = useRouter();

  useEffect(() => {
    if (!moodleToken || !courseId) {
      setError("No authentication token or course ID found");
      setLoading(false);
      return;
    }

    fetchQuizzes();
    fetchHistory();
    fetchMaterials();
  }, [moodleToken, courseId]);
  
  const fetchMaterials = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
      const response = await fetch(`${apiUrl}/course/materials?courseId=${courseId}`, {
        headers: {
          'Authorization': `Bearer ${moodleToken}`
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const materialsArray = data.materials || [];
      setMaterials(materialsArray);
    } catch (err) {
      console.error("Error fetching materials:", err);
    }
  };

  const fetchQuizzes = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    console.log('Fetching quizzes with token:', moodleToken ? `${moodleToken.substring(0, 20)}...` : 'NO TOKEN');
    console.log('URL:', `${apiUrl}/quiz/course/${courseId}/available`);
    
    try {
      const response = await fetch(`${apiUrl}/quiz/course/${courseId}/available`, {
        headers: {
          'Authorization': `Bearer ${moodleToken}`
        }
      });
      
      console.log('Response status:', response.status);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    console.log('Fetching history with token:', moodleToken ? `${moodleToken.substring(0, 20)}...` : 'NO TOKEN');
    
    try {
      const response = await fetch(`${apiUrl}/quiz/history?courseId=${courseId}`, {
        headers: {
          'Authorization': `Bearer ${moodleToken}`
        }
      });
      
      console.log('History response status:', response.status);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleGenerateQuiz = async (numQuestions = 5) => {
    // Validation
    if (quizMode === 'material' && !selectedMaterial) {
      alert('Please select a material');
      return;
    }
    if (quizMode === 'topic' && !topicInput.trim()) {
      alert('Please enter a topic');
      return;
    }
    
    setGeneratingQuiz(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    // Build URL based on mode
    let url = `${apiUrl}/quiz/generate/${courseId}?num_questions=${numQuestions}`;
    if (quizMode === 'material') {
      url += `&materialId=${selectedMaterial}`;
    } else if (quizMode === 'topic') {
      url += `&topic=${encodeURIComponent(topicInput.trim())}`;
    }
    
    console.log('Generating quiz with token:', moodleToken ? `${moodleToken.substring(0, 20)}...` : 'NO TOKEN');
    console.log('Generate URL:', url);
    console.log('Mode:', quizMode);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${moodleToken}`
        }
      });
      
      console.log('Generate response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      router.push(`/quiz/take/${data.quizId}`);
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert(`Failed to generate quiz: ${err.message}`);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleTakeQuiz = (quizId) => {
    router.push(`/quiz/take/${quizId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
          Loading quizzes...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-16 px-4">
      <button 
        onClick={() => router.push('/')}
        className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold
                   hover:scale-105 transition-all duration-300"
        style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
      >
        ← Back
      </button>

      <section className="max-w-5xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`font-playfair text-5xl md:text-6xl font-bold mb-4 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            📝 Quiz Center
          </h1>
          <p className={`font-inter text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Test your knowledge with AI-generated quizzes
          </p>
        </div>

        {/* Stats */}
        {history && (
          <div className="glass-card p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className={`text-3xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                {history.totalQuizzesTaken}
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Quizzes Taken
              </p>
            </div>
            <div className="text-center">
              <p className={`text-3xl font-bold ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                {history.averageScore}%
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Average Score
              </p>
            </div>
            <div className="text-center">
              <p className={`text-3xl font-bold ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>
                {history.attempts?.length || 0}
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Total Attempts
              </p>
            </div>
          </div>
        )}

        {/* Generate New Quiz */}
        <div className="glass-card p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`font-montserrat text-2xl font-bold ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              ✨ Generate New Quiz
            </h2>
            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className="glass-card px-4 py-2 font-montserrat text-sm font-semibold hover:scale-105 transition-all"
            >
              {showGenerator ? 'Hide Options' : 'Show Options'}
            </button>
          </div>
          
          {showGenerator && (
            <>
              <p className={`font-inter mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                Choose how to generate your quiz
              </p>
              
              {/* Quiz Mode Selection */}
              <div className="mb-4">
                <label className={`block font-montserrat font-semibold mb-2 ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                }`}>
                  Quiz Source:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setQuizMode('all');
                      setSelectedMaterial('');
                      setTopicInput('');
                    }}
                    className={`p-4 rounded-lg font-montserrat transition-all ${
                      quizMode === 'all'
                        ? 'bg-blue-500/30 border-2 border-blue-500'
                        : 'glass-card hover:scale-105'
                    }`}
                  >
                    <div className="text-2xl mb-2">📚</div>
                    <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Entire Course
                    </div>
                    <div className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      All materials
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setQuizMode('material');
                      setTopicInput('');
                    }}
                    className={`p-4 rounded-lg font-montserrat transition-all ${
                      quizMode === 'material'
                        ? 'bg-blue-500/30 border-2 border-blue-500'
                        : 'glass-card hover:scale-105'
                    }`}
                  >
                    <div className="text-2xl mb-2">📄</div>
                    <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Specific Material
                    </div>
                    <div className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      One file only
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setQuizMode('topic');
                      setSelectedMaterial('');
                    }}
                    className={`p-4 rounded-lg font-montserrat transition-all ${
                      quizMode === 'topic'
                        ? 'bg-blue-500/30 border-2 border-blue-500'
                        : 'glass-card hover:scale-105'
                    }`}
                  >
                    <div className="text-2xl mb-2">🔍</div>
                    <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Specific Topic
                    </div>
                    <div className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      AI search
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Material Selection */}
              {quizMode === 'material' && (
                <div className="mb-4">
                  <label className={`block font-montserrat font-semibold mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                  }`}>
                    Select Material:
                  </label>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className={`w-full p-3 rounded-lg font-inter ${
                      theme === 'light'
                        ? 'bg-white/80 text-gray-800 border border-gray-300'
                        : 'bg-gray-800/80 text-white border border-gray-600'
                    }`}
                  >
                    <option value="">Choose a material...</option>
                    {materials.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.name} {mat.section ? `(${mat.section})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Topic Input */}
              {quizMode === 'topic' && (
                <div className="mb-4">
                  <label className={`block font-montserrat font-semibold mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                  }`}>
                    Enter Topic:
                  </label>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g., machine learning, neural networks..."
                    className={`w-full p-3 rounded-lg font-inter ${
                      theme === 'light'
                        ? 'bg-white/80 text-gray-800 border border-gray-300 placeholder-gray-500'
                        : 'bg-gray-800/80 text-white border border-gray-600 placeholder-gray-400'
                    }`}
                  />
                </div>
              )}
            </>
          )}
          
          {/* Generate Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => handleGenerateQuiz(5)}
              disabled={generatingQuiz}
              className="glass-card px-6 py-3 font-montserrat font-semibold hover:scale-105 transition-all disabled:opacity-50"
            >
              {generatingQuiz ? '⏳ Generating...' : '5 Questions'}
            </button>
            <button
              onClick={() => handleGenerateQuiz(10)}
              disabled={generatingQuiz}
              className="glass-card px-6 py-3 font-montserrat font-semibold hover:scale-105 transition-all disabled:opacity-50"
            >
              10 Questions
            </button>
            <button
              onClick={() => handleGenerateQuiz(15)}
              disabled={generatingQuiz}
              className="glass-card px-6 py-3 font-montserrat font-semibold hover:scale-105 transition-all disabled:opacity-50"
            >
              15 Questions
            </button>
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="mb-12">
          <h2 className={`font-montserrat text-2xl font-bold mb-6 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            📚 Available Quizzes
          </h2>
          
          {quizzes.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                No quizzes available yet. Generate one above!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.quizId}
                  onClick={() => handleTakeQuiz(quiz.quizId)}
                  className="glass-card p-6 cursor-pointer hover:scale-105 transition-all"
                >
                  <h3 className={`font-montserrat text-xl font-bold mb-2 ${
                    theme === 'light' ? 'text-gray-800' : 'text-white'
                  }`}>
                    {quiz.title}
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                  {quiz.materialId && (
                    <p className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                      Material #{quiz.materialId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Attempts */}
        {history?.attempts && history.attempts.length > 0 && (
          <div>
            <h2 className={`font-montserrat text-2xl font-bold mb-6 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              📊 Recent Attempts
            </h2>
            <div className="space-y-4">
              {history.attempts.slice(0, 5).map((attempt) => (
                <div key={attempt.attemptId} className="glass-card p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-montserrat font-bold ${
                        theme === 'light' ? 'text-gray-800' : 'text-white'
                      }`}>
                        {attempt.quizTitle}
                      </h3>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {new Date(attempt.completedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        attempt.percentage >= 60 
                          ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
                          : (theme === 'light' ? 'text-red-600' : 'text-red-400')
                      }`}>
                        {attempt.percentage}%
                      </p>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {attempt.score}/{attempt.totalQuestions}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

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
  const [quizMode, setQuizMode] = useState('all');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
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
      console.log('[QuizList] Fetched materials:', materialsArray);
      console.log('[QuizList] First material structure:', materialsArray[0]);
      setMaterials(materialsArray);
    } catch (err) {
      console.error("Error fetching materials:", err);
    }
  };

  const fetchQuizzes = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
      const response = await fetch(`${apiUrl}/quiz/course/${courseId}/available`, {
        headers: {
          'Authorization': `Bearer ${moodleToken}`
        }
      });

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


  const groupQuizzesByTopic = (quizzes) => {
    const grouped = {};
    quizzes.forEach(quiz => {
      const topic = quiz.topic || quiz.materialId ? `Material #${quiz.materialId}` : 'General';
      if (!grouped[topic]) grouped[topic] = [];
      grouped[topic].push(quiz);
    });
    return grouped;
  };


  const groupAttemptsByQuiz = (attempts) => {
    const grouped = {};
    attempts.forEach(attempt => {
      if (!grouped[attempt.quizId]) {
        grouped[attempt.quizId] = {
          quizTitle: attempt.quizTitle,
          quizId: attempt.quizId,
          attempts: []
        };
      }
      grouped[attempt.quizId].attempts.push(attempt);
    });
    Object.values(grouped).forEach(group => {
      group.attempts.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    });
    return Object.values(grouped);
  };

  const calculateTopicStats = (attempts) => {
    if (!attempts || attempts.length === 0) return [];
    
    const topicMap = {};
    
    attempts.forEach(attempt => {
      const topic = attempt.topic || attempt.materialId ? `Material #${attempt.materialId}` : attempt.quizTitle.split('-')[0].trim() || 'General';
      
      if (!topicMap[topic]) {
        topicMap[topic] = {
          topic,
          totalAttempts: 0,
          totalScore: 0,
          totalQuestions: 0,
          correctAnswers: 0
        };
      }
      
      topicMap[topic].totalAttempts++;
      topicMap[topic].totalScore += attempt.percentage;
      topicMap[topic].correctAnswers += attempt.score;
      topicMap[topic].totalQuestions += attempt.totalQuestions;
    });

    return Object.values(topicMap).map(stat => ({
      topic: stat.topic,
      avgPercentage: Math.round(stat.totalScore / stat.totalAttempts),
      totalAttempts: stat.totalAttempts,
      correctAnswers: stat.correctAnswers,
      totalQuestions: stat.totalQuestions
    })).sort((a, b) => b.avgPercentage - a.avgPercentage);
  };

  const fetchHistory = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
      const response = await fetch(`${apiUrl}/quiz/history?courseId=${courseId}`, {
        headers: {
          'Authorization': `Bearer ${moodleToken}`
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleGenerateQuiz = async (numQuestions = 5) => {
    if (quizMode === 'material' && selectedMaterials.length === 0) {
      alert('Please select at least one material');
      return;
    }
    if (quizMode === 'topic' && !topicInput.trim()) {
      alert('Please enter a topic');
      return;
    }
    
    setGeneratingQuiz(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const url = `${apiUrl}/quiz/generate/${courseId}`;
    
    const body = {
      numQuestions: numQuestions,
      materialIds: null,
      topic: null
    };
    
    if (quizMode === 'material' && selectedMaterials.length > 0) {
      body.materialIds = selectedMaterials;
      console.log('[QuizList] Sending materialIds:', selectedMaterials);
      console.log('[QuizList] Selected materials details:', materials.filter(m => selectedMaterials.includes(m.id)));
    } else if (quizMode === 'topic') {
      body.topic = topicInput.trim();
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${moodleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
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
            Quiz Center
          </h1>
          <p className={`font-inter text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Test your knowledge with AI-generated quizzes
          </p>
        </div>

        {/* Stats */}
        {history && (
          <div className="glass-card p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className={`text-3xl font-bold ${
                history.totalQuizzesTaken >= 10
                  ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
                  : history.totalQuizzesTaken >= 5
                  ? (theme === 'light' ? 'text-orange-600' : 'text-orange-400')
                  : (theme === 'light' ? 'text-red-600' : 'text-red-400')
              }`}>
                {history.totalQuizzesTaken}
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Quizzes Taken
              </p>
            </div>
            <div className="text-center">
              <p className={`text-3xl font-bold ${
                history.averageScore >= 80
                  ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
                  : history.averageScore >= 60
                  ? (theme === 'light' ? 'text-orange-600' : 'text-orange-400')
                  : (theme === 'light' ? 'text-red-600' : 'text-red-400')
              }`}>
                {history.averageScore}%
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Average Score
              </p>
            </div>
            <div className="text-center">
              <p className={`text-3xl font-bold ${
                (history.attempts?.length || 0) >= 20
                  ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
                  : (history.attempts?.length || 0) >= 10
                  ? (theme === 'light' ? 'text-orange-600' : 'text-orange-400')
                  : (theme === 'light' ? 'text-red-600' : 'text-red-400')
              }`}>
                {history.attempts?.length || 0}
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Total Attempts
              </p>
            </div>
          </div>
        )}

        {/* Performance by Topic/Material */}
        {history?.attempts && history.attempts.length > 0 && calculateTopicStats(history.attempts).length > 0 && (
          <div className="glass-card p-6 mb-8">
            <h2 className={`font-montserrat text-xl font-bold mb-4 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              Performance by Topic
            </h2>
            <div className="space-y-3">
              {calculateTopicStats(history.attempts).map((stat, idx) => (
                <div key={idx} className="glass p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-semibold ${
                      theme === 'light' ? 'text-gray-800' : 'text-white'
                    }`}>
                      {stat.topic}
                    </span>
                    <span className={`text-lg font-bold ${
                      stat.avgPercentage >= 70
                        ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
                        : stat.avgPercentage >= 50
                        ? (theme === 'light' ? 'text-orange-600' : 'text-orange-400')
                        : (theme === 'light' ? 'text-red-600' : 'text-red-400')
                    }`}>
                      {stat.avgPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                    <div
                      className={`h-2.5 rounded-full ${
                        stat.avgPercentage >= 70 ? 'bg-green-500' :
                        stat.avgPercentage >= 50 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${stat.avgPercentage}%` }}
                    ></div>
                  </div>
                  <div className={`text-xs flex justify-between ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    <span>{stat.totalAttempts} attempt{stat.totalAttempts !== 1 ? 's' : ''}</span>
                    <span>{stat.correctAnswers}/{stat.totalQuestions} correct</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate New Quiz */}
        <div className="glass-card p-8 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`font-montserrat text-2xl font-bold ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              Generate New Quiz
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
                      setSelectedMaterials([]);
                      setTopicInput('');
                    }}
                    className={`p-4 rounded-lg font-montserrat transition-all ${
                      quizMode === 'all'
                        ? 'bg-blue-500/30 border-2 border-blue-500'
                        : 'glass-card hover:scale-105'
                    }`}
                  >
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
                    <div className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Select Materials
                    </div>
                    <div className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Choose one or more
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setQuizMode('topic');
                      setSelectedMaterials([]);
                    }}
                    className={`p-4 rounded-lg font-montserrat transition-all ${
                      quizMode === 'topic'
                        ? 'bg-blue-500/30 border-2 border-blue-500'
                        : 'glass-card hover:scale-105'
                    }`}
                  >
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
                    Select Materials ({selectedMaterials.length} selected):
                  </label>
                  <div className={`max-h-96 overflow-y-auto rounded-lg border p-4 ${
                    theme === 'light' ? 'bg-white/80 border-gray-300' : 'bg-gray-800/80 border-gray-600'
                  }`}>
                    {(() => {
                      const sections = {};
                      materials.forEach(mat => {
                        const section = mat.section || 'Other Materials';
                        if (!sections[section]) sections[section] = [];
                        sections[section].push(mat);
                      });
                      
                      return Object.entries(sections).map(([section, mats]) => (
                        <div key={section} className="mb-4 last:mb-0">
                          <div className={`font-montserrat font-bold mb-2 pb-1 border-b ${
                            theme === 'light' ? 'text-gray-700 border-gray-300' : 'text-gray-200 border-gray-600'
                          }`}>
                            {section}
                          </div>
                          <div className="space-y-2">
                            {mats.map(mat => (
                              <label
                                key={mat.id}
                                className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-all ${
                                  selectedMaterials.includes(mat.id)
                                    ? (theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30')
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/30'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedMaterials.includes(mat.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedMaterials([...selectedMaterials, mat.id]);
                                    } else {
                                      setSelectedMaterials(selectedMaterials.filter(id => id !== mat.id));
                                    }
                                  }}
                                  className="w-4 h-4 rounded border-gray-300"
                                />
                                <span className={`font-inter text-sm flex-1 ${
                                  theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                                }`}>
                                  {mat.name}
                                </span>
                                <span className={`font-mono text-xs ${
                                  theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                                }`}>
                                  ID: {mat.id}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
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

        {/* Available Quizzes - Grouped by Topic */}
        <div className="mb-12">
          <h2 className={`font-montserrat text-2xl font-bold mb-6 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            Available Quizzes
          </h2>
          
          {quizzes.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                No quizzes available yet. Generate one above!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupQuizzesByTopic(quizzes)).map(([topic, topicQuizzes]) => (
                <div key={topic}>
                  <h3 className={`font-montserrat text-lg font-bold mb-4 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                  }`}>
                    📂 {topic}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topicQuizzes.map((quiz) => (
                      <div
                        key={quiz.quizId}
                        onClick={() => handleTakeQuiz(quiz.quizId)}
                        className="glass-card p-6 cursor-pointer hover:scale-105 transition-all"
                      >
                        <h4 className={`font-montserrat text-xl font-bold mb-2 ${
                          theme === 'light' ? 'text-gray-800' : 'text-white'
                        }`}>
                          {quiz.quizTitle || quiz.title || `Quiz #${quiz.quizId}`}
                        </h4>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Created: {new Date(quiz.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Attempts - Grouped by Quiz */}
        {history?.attempts && history.attempts.length > 0 && (
          <div>
            <h2 className={`font-montserrat text-2xl font-bold mb-6 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              Quiz History
            </h2>
            <div className="space-y-6">
              {groupAttemptsByQuiz(history.attempts).map((quizGroup) => (
                <div key={quizGroup.quizId} className="glass-card p-6">
                  <h3 className={`font-montserrat text-xl font-bold mb-4 ${
                    theme === 'light' ? 'text-gray-800' : 'text-white'
                  }`}>
                    {quizGroup.quizTitle}
                  </h3>
                  
                  <div className="space-y-3">
                    {quizGroup.attempts.map((attempt, idx) => (
                      <div
                        key={attempt.attemptId}
                        className="glass p-4 rounded-lg cursor-pointer hover:scale-[1.02] transition-all duration-200"
                        onClick={() => router.push(`/quiz/results/${attempt.attemptId}`)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className={`font-bold ${
                              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              #{idx + 1}
                            </span>
                            <div>
                              <p className={`text-sm font-semibold ${
                                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                              }`}>
                                {new Date(attempt.completedAt).toLocaleDateString()} at {new Date(attempt.completedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className={`text-xl font-bold ${
                                attempt.percentage >= 60 
                                  ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
                                  : (theme === 'light' ? 'text-red-600' : 'text-red-400')
                              }`}>
                                {attempt.percentage}%
                              </p>
                              <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {attempt.score}/{attempt.totalQuestions}
                              </p>
                            </div>
                            <span className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {quizGroup.attempts.length > 1 && (
                    <div className={`mt-3 pt-3 border-t ${
                      theme === 'light' ? 'border-gray-200' : 'border-gray-700'
                    }`}>
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          Total attempts: {quizGroup.attempts.length}
                        </span>
                        <span className={`font-semibold ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          Best: {Math.max(...quizGroup.attempts.map(a => a.percentage))}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

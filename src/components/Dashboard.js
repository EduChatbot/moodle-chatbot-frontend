"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import { useMoodle } from "@/contexts/MoodleContext";

export default function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [activity, setActivity] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState('overview'); // 'overview' | 'course'
  
  const { theme } = useTheme();
  const { backgroundColor } = useAnimation();
  const { moodleToken, courseId, courseName } = useMoodle();
  const router = useRouter();

  useEffect(() => {
    if (!moodleToken) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    fetchAllData();
  }, [moodleToken, courseId]);

  const fetchAllData = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    try {
      // Fetch user progress
      const progressRes = await fetch(`${apiUrl}/dashboard/progress`, {
        headers: { 'Authorization': `Bearer ${moodleToken}` }
      });
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData);
      }

      // Fetch activity (last 30 days)
      const activityRes = await fetch(`${apiUrl}/dashboard/activity?days=30`, {
        headers: { 'Authorization': `Bearer ${moodleToken}` }
      });
      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setActivity(activityData);
      }

      // Fetch course-specific data if courseId available
      if (courseId) {
        const [statsRes, learningRes] = await Promise.all([
          fetch(`${apiUrl}/dashboard/course/${courseId}/stats`, {
            headers: { 'Authorization': `Bearer ${moodleToken}` }
          }),
          fetch(`${apiUrl}/dashboard/course/${courseId}/learning-progress`, {
            headers: { 'Authorization': `Bearer ${moodleToken}` }
          })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setCourseStats(statsData);
        }
        
        if (learningRes.ok) {
          const learningData = await learningRes.json();
          setLearningProgress(learningData);
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen py-16 px-4">
        <button 
          onClick={() => router.push('/')}
          className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold hover:scale-105 transition-all"
          style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
        >
          ← Home
        </button>
        <div className="max-w-2xl mx-auto text-center pt-20">
          <div className="glass-strong p-8 rounded-3xl">
            <p className="text-red-500 text-xl font-montserrat font-semibold">
              ⚠️ Failed to load dashboard
            </p>
            <p className={`mt-4 font-inter ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-16 px-4">
      <button 
        onClick={() => router.push('/')}
        className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold hover:scale-105 transition-all"
        style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
      >
        ← Home
      </button>

      <section className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`font-playfair text-5xl md:text-6xl font-bold mb-4 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            📊 My Dashboard
          </h1>
          <p className={`font-inter text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Track your learning progress and activity
          </p>
        </div>

        {/* User Info Card */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h2 className={`font-montserrat text-2xl font-bold ${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}>
                {progress.userName}
              </h2>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                User ID: {progress.userId}
              </p>
            </div>
          </div>
          {courseName && (
            <div className="mt-4 p-3 glass-card rounded-lg">
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Current Course
              </p>
              <p className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                📚 {courseName}
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Conversations */}
          <div className="glass-card p-6 hover:scale-105 transition-all">
            <div className="text-4xl mb-2">💬</div>
            <p className={`text-3xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
              {progress.totalConversations}
            </p>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Total Conversations
            </p>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6 hover:scale-105 transition-all">
            <div className="text-4xl mb-2">🔥</div>
            <p className={`text-3xl font-bold ${theme === 'light' ? 'text-orange-600' : 'text-orange-400'}`}>
              {progress.recentConversations}
            </p>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Recent Conversations
            </p>
          </div>

          {/* Courses Explored */}
          <div className="glass-card p-6 hover:scale-105 transition-all">
            <div className="text-4xl mb-2">📚</div>
            <p className={`text-3xl font-bold ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
              {progress.coursesExplored}
            </p>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Courses Explored
            </p>
          </div>

          {/* Quizzes Taken */}
          <div className="glass-card p-6 hover:scale-105 transition-all">
            <div className="text-4xl mb-2">📝</div>
            <p className={`text-3xl font-bold ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>
              {progress.totalQuizzesTaken || 0}
            </p>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Quizzes Taken
            </p>
          </div>
        </div>

        {/* Quiz Performance */}
        {progress.totalQuizzesTaken > 0 && (
          <div className="glass-card p-8 mb-8">
            <h2 className={`font-montserrat text-2xl font-bold mb-6 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              📊 Quiz Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Average Score
                </p>
                <div className="flex items-end gap-2">
                  <p className={`text-5xl font-bold ${
                    progress.averageQuizScore >= 60 
                      ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
                      : (theme === 'light' ? 'text-orange-600' : 'text-orange-400')
                  }`}>
                    {progress.averageQuizScore}%
                  </p>
                  <p className={`text-lg mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {progress.averageQuizScore >= 80 ? 'Excellent!' : 
                     progress.averageQuizScore >= 60 ? 'Good!' : 'Keep practicing!'}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div>
                <p className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Overall Progress
                </p>
                <div className="h-8 bg-gray-700/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 flex items-center justify-end pr-3"
                    style={{ width: `${progress.averageQuizScore}%` }}
                  >
                    <span className="text-white text-sm font-bold">
                      {progress.averageQuizScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Favorite Course */}
          <div className="glass-card p-6">
            <h3 className={`font-montserrat text-lg font-bold mb-4 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              ⭐ Favorite Course
            </h3>
            <p className={`text-xl ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              {progress.favoriteCourse || 'No favorite yet'}
            </p>
          </div>

          {/* Last Activity */}
          <div className="glass-card p-6">
            <h3 className={`font-montserrat text-lg font-bold mb-4 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              🕐 Last Activity
            </h3>
            <p className={`text-xl ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              {progress.lastActivity 
                ? new Date(progress.lastActivity).toLocaleString()
                : 'No activity yet'}
            </p>
          </div>
        </div>

        {/* Activity Chart (if available) */}
        {activity && activity.activityByDate && (
          <div className="glass-card p-8 mb-8">
            <h2 className={`font-montserrat text-2xl font-bold mb-6 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              📈 Activity Overview (Last 30 Days)
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {Object.entries(activity.activityByDate)
                .slice(-30)
                .map(([date, count]) => (
                  <div key={date} className="flex flex-col items-center">
                    <div 
                      className={`w-full h-24 rounded ${
                        count === 0 
                          ? 'bg-gray-700/20' 
                          : count < 3
                          ? 'bg-blue-500/30'
                          : count < 6
                          ? 'bg-blue-500/60'
                          : 'bg-blue-500/90'
                      } hover:scale-105 transition-all relative group`}
                      style={{ height: `${Math.max(count * 15, 20)}px` }}
                    >
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black/80 text-white px-2 py-1 rounded">
                        {count} chats
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {new Date(date).getDate()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Course-specific stats (if available) */}
        {courseStats && (
          <div className="glass-card p-8 mb-8">
            <h2 className={`font-montserrat text-2xl font-bold mb-6 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              📚 {courseStats.courseName} Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="glass-card p-4">
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Questions Asked
                </p>
                <p className={`text-3xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                  {courseStats.questionsCount}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Total Materials
                </p>
                <p className={`text-3xl font-bold ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
                  {courseStats.materialsCount}
                </p>
              </div>
            </div>
            
            {courseStats.topMaterials && courseStats.topMaterials.length > 0 && (
              <div>
                <h3 className={`font-montserrat text-lg font-bold mb-4 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  🔝 Top Materials
                </h3>
                <div className="space-y-2">
                  {courseStats.topMaterials.map((material, idx) => (
                    <div key={idx} className="glass-card p-3 flex justify-between items-center">
                      <span className={theme === 'light' ? 'text-gray-800' : 'text-white'}>
                        {material.name}
                      </span>
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {material.chunksCount} chunks
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Learning Progress (if available) */}
        {learningProgress && (
          <div className="glass-card p-8 mb-8">
            <h2 className={`font-montserrat text-2xl font-bold mb-6 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              🎯 Learning Progress: {learningProgress.courseName}
            </h2>
            
            {/* Overall Progress Circle */}
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <svg className="w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className={theme === 'light' ? 'text-gray-300' : 'text-gray-700'}
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - learningProgress.overallProgress / 100)}`}
                    transform="rotate(-90 64 64)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    {learningProgress.overallProgress}%
                  </span>
                </div>
              </div>
              <p className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Overall Course Progress
              </p>
            </div>

            {/* Recommended Topics */}
            {learningProgress.recommendedTopics && learningProgress.recommendedTopics.length > 0 && (
              <div className="mb-6">
                <h3 className={`font-montserrat text-lg font-bold mb-4 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  💡 What to Learn Next
                </h3>
                <div className="flex flex-wrap gap-2">
                  {learningProgress.recommendedTopics.map((topic, idx) => (
                    <span 
                      key={idx}
                      className="glass-card px-4 py-2 text-sm hover:scale-105 transition-all"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="glass-card p-8">
          <h2 className={`font-montserrat text-2xl font-bold mb-6 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}>
            🚀 Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/chat')}
              className="glass-card p-6 hover:scale-105 transition-all text-left"
            >
              <div className="text-3xl mb-2">💬</div>
              <p className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Start Chatting
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Ask questions about your course
              </p>
            </button>

            <button
              onClick={() => router.push('/quiz')}
              className="glass-card p-6 hover:scale-105 transition-all text-left"
            >
              <div className="text-3xl mb-2">📝</div>
              <p className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Take a Quiz
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Test your knowledge
              </p>
            </button>

            <button
              onClick={() => router.push('/')}
              className="glass-card p-6 hover:scale-105 transition-all text-left"
            >
              <div className="text-3xl mb-2">📚</div>
              <p className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Browse Materials
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                View course resources
              </p>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

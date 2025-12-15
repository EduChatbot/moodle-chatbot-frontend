"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimation } from "@/contexts/AnimationContext";
import { useMoodle } from "@/contexts/MoodleContext";

const SCORE_THRESHOLD = { EXCELLENT: 80, GOOD: 60 };

export default function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [activity, setActivity] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [learningProgress, setLearningProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('general');
  const [uniqueQuizCount, setUniqueQuizCount] = useState(0);
  const [courseQuizStats, setCourseQuizStats] = useState({ attempts: 0, unique: 0 });
  
  const { theme } = useTheme();
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
    const headers = { 'Authorization': `Bearer ${moodleToken}` };
    
    try {
      await fetchUserProgress(apiUrl, headers);
      await fetchUserActivity(apiUrl, headers);
      
      if (courseId) {
        await fetchCourseData(apiUrl, headers);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async (apiUrl, headers) => {
    const res = await fetch(`${apiUrl}/dashboard/progress`, { headers });
    if (res.ok) {
      const data = await res.json();
      setProgress(data);
      
      if (data.totalQuizzesTaken > 0) {
        fetchUniqueQuizCount(apiUrl, headers);
      }
    }
  };

  const fetchUniqueQuizCount = async (apiUrl, headers) => {
    try {
      const res = await fetch(`${apiUrl}/quiz/history`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.attempts && data.attempts.length > 0) {
          const uniqueQuizIds = new Set(data.attempts.map(a => a.quizId));
          setUniqueQuizCount(uniqueQuizIds.size);
        } else {
          setUniqueQuizCount(0);
        }
      }
    } catch (err) {
      console.warn("Could not fetch unique quiz count:", err);
      setUniqueQuizCount(0);
    }
  };

  const fetchUserActivity = async (apiUrl, headers) => {
    const res = await fetch(`${apiUrl}/dashboard/activity?days=30`, { headers });
    if (res.ok) setActivity(await res.json());
  };

  const fetchCourseData = async (apiUrl, headers) => {
    try {
      const statsRes = await fetch(`${apiUrl}/dashboard/course/${courseId}/stats`, { headers });
      if (statsRes.ok) {
        setCourseStats(await statsRes.json());
      }
    } catch (err) {
      console.warn("Course stats unavailable:", err);
    }

    try {
      const learningRes = await fetch(`${apiUrl}/dashboard/course/${courseId}/learning-progress`, { headers });
      if (learningRes.ok) {
        setLearningProgress(await learningRes.json());
      }
    } catch (err) {
      console.warn("Learning progress unavailable:", err);
    }

    try {
      const quizStatsRes = await fetch(`${apiUrl}/dashboard/course/${courseId}/quiz-stats`, { headers });
      if (quizStatsRes.ok) {
        const quizData = await quizStatsRes.json();
        setCourseQuizStats({
          attempts: quizData.totalAttempts || 0,
          unique: quizData.uniqueQuizzesTaken || 0
        });
      }
    } catch (err) {
      console.warn("Course quiz stats unavailable:", err);
      setCourseQuizStats({ attempts: 0, unique: 0 });
    }
  };

  const getScoreLabel = (score) => {
    if (score >= SCORE_THRESHOLD.EXCELLENT) return 'Excellent';
    if (score >= SCORE_THRESHOLD.GOOD) return 'Good';
    return 'Keep practicing';
  };

  const getScoreColor = (score) => {
    const isGood = score >= SCORE_THRESHOLD.GOOD;
    return isGood 
      ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
      : (theme === 'light' ? 'text-orange-600' : 'text-orange-400');
  };

  const textColor = theme === 'light' ? 'text-gray-800' : 'text-white';
  const subtextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const lightSubtextColor = theme === 'light' ? 'text-gray-500' : 'text-gray-500';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className={subtextColor}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen py-16 px-4">
        <BackButton router={router} theme={theme} />
        <div className="max-w-2xl mx-auto text-center pt-20">
          <div className="glass-strong p-8 rounded-3xl">
            <p className="text-red-500 text-xl font-montserrat font-semibold">
              ⚠️ Failed to load dashboard
            </p>
            <p className={`mt-4 font-inter ${subtextColor}`}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-16 px-4">
      <BackButton router={router} theme={theme} />

      <section className="max-w-6xl mx-auto pt-8">
        <Header theme={theme} subtextColor={subtextColor} />
        
        <ViewModeSelector 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          hasCourseData={!!courseId}
          theme={theme}
          textColor={textColor}
        />

        {viewMode === 'general' ? (
          <>
            <UserInfoCard 
              progress={progress} 
              courseName={courseName} 
              theme={theme} 
              textColor={textColor}
              subtextColor={subtextColor}
            />

            <StatsGrid progress={progress} theme={theme} subtextColor={subtextColor} uniqueQuizCount={uniqueQuizCount} />

            {progress.totalQuizzesTaken > 0 && (
              <QuizPerformance 
                progress={progress}
                learningProgress={learningProgress}
                theme={theme}
                textColor={textColor}
                subtextColor={subtextColor}
                getScoreLabel={getScoreLabel}
                getScoreColor={getScoreColor}
              />
            )}

            <ActivitySummary 
              progress={progress} 
              theme={theme} 
              textColor={textColor}
              subtextColor={subtextColor}
            />

            {activity?.activityByDate && (
              <ActivityChart 
                activity={activity} 
                theme={theme} 
                textColor={textColor}
                subtextColor={subtextColor}
              />
            )}

            <QuickActions router={router} theme={theme} textColor={textColor} subtextColor={subtextColor} />
          </>
        ) : (
          <>
            {courseId ? (
              <>
                {courseStats && (
                  <CourseStatsCard 
                    courseStats={courseStats}
                    learningProgress={learningProgress}
                    courseId={courseId}
                    theme={theme}
                    textColor={textColor}
                    subtextColor={subtextColor}
                    lightSubtextColor={lightSubtextColor}
                    courseQuizStats={courseQuizStats}
                  />
                )}

                {courseId && !courseStats && !learningProgress && (
                  <LoadingRecommendations theme={theme} textColor={textColor} subtextColor={subtextColor} />
                )}

                {learningProgress && (
                  <LearningProgressCard 
                    learningProgress={learningProgress}
                    theme={theme}
                    textColor={textColor}
                    subtextColor={subtextColor}
                    lightSubtextColor={lightSubtextColor}
                  />
                )}

                <QuickActions router={router} theme={theme} textColor={textColor} subtextColor={subtextColor} />
              </>
            ) : (
              <NoCourseSelected theme={theme} textColor={textColor} subtextColor={subtextColor} />
            )}
          </>
        )}
      </section>
    </div>
  );
}

function BackButton({ router, theme }) {
  return (
    <button 
      onClick={() => router.push('/')}
      className="glass-card fixed top-6 left-6 z-10 px-6 py-3 font-montserrat font-semibold hover:scale-105 transition-all"
      style={{ color: theme === 'light' ? '#1f2937' : 'white' }}
    >
      ← Home
    </button>
  );
}

function Header({ theme, subtextColor }) {
  return (
    <div className="text-center mb-8">
      <h1 className={`font-playfair text-5xl md:text-6xl font-bold mb-4 ${
        theme === 'light' ? 'text-gray-800' : 'text-white'
      }`}>
        Learning Progress
      </h1>
      <p className={`font-inter text-lg ${subtextColor}`}>
        Track your progress and activity
      </p>
    </div>
  );
}

function ViewModeSelector({ viewMode, setViewMode, hasCourseData, theme, textColor }) {
  return (
    <div className="glass-card p-2 mb-8 flex gap-2 max-w-md mx-auto">
      <button
        onClick={() => setViewMode('general')}
        className={`flex-1 px-6 py-3 rounded-lg font-montserrat font-semibold transition-all ${
          viewMode === 'general'
            ? theme === 'light'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : `${textColor} hover:bg-white/10`
        }`}
      >
        General Stats
      </button>
      <button
        onClick={() => setViewMode('course')}
        disabled={!hasCourseData}
        className={`flex-1 px-6 py-3 rounded-lg font-montserrat font-semibold transition-all ${
          viewMode === 'course'
            ? theme === 'light'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : hasCourseData
              ? `${textColor} hover:bg-white/10`
              : 'text-gray-500 cursor-not-allowed opacity-50'
        }`}
      >
        Course Stats
      </button>
    </div>
  );
}

function NoCourseSelected({ theme, textColor, subtextColor }) {
  return (
    <div className="glass-card p-12 text-center">
      <h2 className={`font-montserrat text-2xl font-bold mb-4 ${textColor}`}>
        No Course Selected
      </h2>
      <p className={`${subtextColor} mb-6`}>
        Please select a course to view detailed course statistics and recommendations.
      </p>
      <p className={`text-sm ${subtextColor}`}>
        You can select a course from the home page or courses page.
      </p>
    </div>
  );
}

function UserInfoCard({ progress, courseName, theme, textColor, subtextColor }) {
  return (
    <div className="glass-card p-8 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center p-2 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <img src="/chat_logo.png" alt="User" className="w-full h-full object-contain logo-adaptive" />
        </div>
        <div>
          <h2 className={`font-montserrat text-2xl font-bold ${textColor}`}>
            {progress.userName}
          </h2>
          <p className={subtextColor}>ID: {progress.userId}</p>
        </div>
      </div>
      {courseName && (
        <div className="mt-4 p-3 glass-card rounded-lg">
          <p className={`text-sm ${subtextColor}`}>Current Course</p>
          <p className={`font-semibold ${textColor}`}>{courseName}</p>
        </div>
      )}
    </div>
  );
}

function StatsGrid({ progress, theme, subtextColor, uniqueQuizCount }) {
  const getColor = (value, thresholds) => {
    if (value >= thresholds.high) return theme === 'light' ? 'text-green-600' : 'text-green-400';
    if (value >= thresholds.medium) return theme === 'light' ? 'text-orange-600' : 'text-orange-400';
    return theme === 'light' ? 'text-red-600' : 'text-red-400';
  };

  const stats = [
    { value: progress.totalConversations, label: 'Total Conversations', color: getColor(progress.totalConversations, {high: 50, medium: 20}) },
    { value: progress.recentConversations, label: 'Recent Activity', color: getColor(progress.recentConversations, {high: 10, medium: 5}) },
    { value: progress.coursesExplored, label: 'Courses Explored', color: getColor(progress.coursesExplored, {high: 3, medium: 1}) },
    { value: progress.totalQuizzesTaken || 0, label: 'Total Quiz Attempts', color: getColor(progress.totalQuizzesTaken || 0, {high: 20, medium: 10}) },
    { value: uniqueQuizCount || 0, label: 'Unique Quizzes', color: getColor(uniqueQuizCount || 0, {high: 10, medium: 5}) },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="glass-card p-4 hover:scale-105 transition-all">
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className={`text-xs mt-1 ${subtextColor}`}>{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function QuizPerformance({ progress, learningProgress, theme, textColor, subtextColor, getScoreLabel, getScoreColor }) {
  const score = learningProgress?.overallProgress || progress.averageQuizScore;

  return (
    <div className="glass-card p-8 mb-8">
      <h2 className={`font-montserrat text-2xl font-bold mb-6 ${textColor}`}>
        Quiz Performance
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className={`text-sm mb-2 ${subtextColor}`}>
            {learningProgress ? 'Overall Coverage' : 'Average Score'}
          </p>
          <div className="flex items-end gap-2">
            <p className={`text-5xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </p>
            <p className={`text-lg mb-2 ${subtextColor}`}>
              {getScoreLabel(score)}
            </p>
          </div>
        </div>
        
        <div>
          <p className={`text-sm mb-2 ${subtextColor}`}>Overall Progress</p>
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
  );
}

function ActivitySummary({ progress, theme, textColor, subtextColor }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="glass-card p-6">
        <h3 className={`font-montserrat text-lg font-bold mb-4 ${textColor}`}>
          Favorite Course
        </h3>
        <p className={`text-xl ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          {progress.favoriteCourse || 'No favorite yet'}
        </p>
      </div>

      <div className="glass-card p-6">
        <h3 className={`font-montserrat text-lg font-bold mb-4 ${textColor}`}>
          Last Activity
        </h3>
        <p className={`text-xl ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          {progress.lastActivity 
            ? new Date(progress.lastActivity).toLocaleString()
            : 'No activity yet'}
        </p>
      </div>
    </div>
  );
}

function ActivityChart({ activity, theme, textColor, subtextColor }) {
  return (
    <div className="glass-card p-8 mb-8">
      <h2 className={`font-montserrat text-2xl font-bold mb-6 ${textColor}`}>
        Activity Overview (Last 30 Days)
      </h2>
      <div className="grid grid-cols-7 gap-2">
        {Object.entries(activity.activityByDate)
          .slice(-30)
          .map(([date, count]) => {
            const intensity = count === 0 ? 'bg-gray-700/20' 
              : count < 3 ? 'bg-blue-500/30'
              : count < 6 ? 'bg-blue-500/60'
              : 'bg-blue-500/90';
            
            return (
              <div key={date} className="flex flex-col items-center">
                <div 
                  className={`w-full rounded ${intensity} hover:scale-105 transition-all relative group`}
                  style={{ height: `${Math.max(count * 15, 20)}px` }}
                >
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black/80 text-white px-2 py-1 rounded">
                    {count} chats
                  </span>
                </div>
                <p className={`text-xs mt-1 ${subtextColor}`}>
                  {new Date(date).getDate()}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function CourseStatsCard({ courseStats, learningProgress, courseId, theme, textColor, subtextColor, lightSubtextColor, courseQuizStats }) {
  return (
    <div className="glass-card p-8 mb-8">
      <h2 className={`font-montserrat text-2xl font-bold mb-6 ${textColor}`}>
        {courseStats.courseName}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className={`text-sm ${subtextColor}`}>Questions Asked</p>
          <p className={`text-3xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
            {courseStats.questionsCount}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className={`text-sm ${subtextColor}`}>Total Materials</p>
          <p className={`text-3xl font-bold ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
            {courseStats.materialsCount}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className={`text-sm ${subtextColor}`}>Quiz Attempts</p>
          <p className={`text-3xl font-bold ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>
            {courseQuizStats.attempts}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className={`text-sm ${subtextColor}`}>Unique Quizzes</p>
          <p className={`text-3xl font-bold ${theme === 'light' ? 'text-orange-600' : 'text-orange-400'}`}>
            {courseQuizStats.unique}
          </p>
        </div>
      </div>
      
      <MaterialsRecommendations 
        learningProgress={learningProgress}
        courseId={courseId}
        theme={theme}
        textColor={textColor}
        subtextColor={subtextColor}
        lightSubtextColor={lightSubtextColor}
      />
    </div>
  );
}

function MaterialsRecommendations({ learningProgress, courseId, theme, textColor, subtextColor, lightSubtextColor }) {
  const hasMaterials = learningProgress?.materialsProgress?.length > 0;

  return (
    <div className="mt-6">
      <h3 className={`font-montserrat text-lg font-bold mb-4 ${textColor}`}>
        Recommended Materials
      </h3>
      {hasMaterials ? (
        <div className="space-y-2">
          {learningProgress.materialsProgress
            .sort((a, b) => (a.coveragePercentage || 0) - (b.coveragePercentage || 0))
            .slice(0, 5)
            .map((material, idx) => (
              <MaterialCard 
                key={idx} 
                material={material} 
                theme={theme}
                textColor={textColor}
                lightSubtextColor={lightSubtextColor}
              />
            ))}
        </div>
      ) : (
        <div className="glass-card p-6 text-center">
          <p className={subtextColor}>
            No recommendations available yet.
            {!courseId && " Please select a course to see personalized recommendations."}
          </p>
        </div>
      )}
    </div>
  );
}

function MaterialCard({ material, theme, textColor, lightSubtextColor }) {
  const hasQuestions = (material.questionsCount || 0) > 0;
  const coverage = hasQuestions ? (material.coveragePercentage || 0) : 0;
  
  const colorClass = coverage >= 70
    ? (theme === 'light' ? 'text-green-600' : 'text-green-400')
    : coverage >= 40
    ? (theme === 'light' ? 'text-orange-600' : 'text-orange-400')
    : (theme === 'light' ? 'text-red-600' : 'text-red-400');
  
  const bgClass = coverage >= 70 ? 'bg-green-500' : coverage >= 40 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <div className="glass-card p-3">
      <div className="flex justify-between items-center mb-2">
        <span className={`font-semibold ${textColor}`}>
          {material.materialName}
        </span>
        <span className={`text-sm font-bold ${colorClass}`}>
          {coverage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${bgClass}`}
          style={{ width: `${coverage}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1">
        <span className={`text-xs ${lightSubtextColor}`}>
          {material.status || 'Not started'}
        </span>
        <span className={`text-xs ${lightSubtextColor}`}>
          {material.questionsCount || 0} questions
        </span>
      </div>
    </div>
  );
}

function LoadingRecommendations({ theme, textColor, subtextColor }) {
  return (
    <div className="glass-card p-8 mb-8">
      <h2 className={`font-montserrat text-2xl font-bold mb-6 ${textColor}`}>
        Learning Recommendations
      </h2>
      <div className="text-center p-6">
        <p className={subtextColor}>
          Loading personalized recommendations...
        </p>
        <p className={`text-sm mt-2 ${subtextColor}`}>
          Start asking questions to get customized study suggestions
        </p>
      </div>
    </div>
  );
}

function LearningProgressCard({ learningProgress, theme, textColor, subtextColor, lightSubtextColor }) {
  const progress = learningProgress.overallProgress;

  return (
    <div className="glass-card p-8 mb-8">
      <h2 className={`font-montserrat text-2xl font-bold mb-6 ${textColor}`}>
        Learning Progress: {learningProgress.courseName}
      </h2>
      
      <div className="text-center mb-8">
        <div className="inline-block relative">
          <svg className="w-32 h-32">
            <circle
              cx="64" cy="64" r="56"
              fill="none" stroke="currentColor" strokeWidth="12"
              className={theme === 'light' ? 'text-gray-300' : 'text-gray-700'}
            />
            <circle
              cx="64" cy="64" r="56"
              fill="none" stroke="url(#gradient)" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
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
            <span className={`text-2xl font-bold ${textColor}`}>{progress}%</span>
          </div>
        </div>
        <p className={`mt-2 ${subtextColor}`}>Overall Course Progress</p>
      </div>

      {learningProgress.recommendedTopics?.length > 0 && (
        <div className="mb-6">
          <h3 className={`font-montserrat text-lg font-bold mb-4 ${textColor}`}>
            What to Learn Next
          </h3>
          <div className="flex flex-wrap gap-2">
            {learningProgress.recommendedTopics.map((topic, idx) => (
              <span key={idx} className="glass-card px-4 py-2 text-sm hover:scale-105 transition-all">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {learningProgress.materialsProgress?.length > 0 && (
        <div className="mt-6">
          <h3 className={`font-montserrat text-lg font-bold mb-4 ${textColor}`}>
            Materials to Focus On
          </h3>
          <div className="space-y-2">
            {learningProgress.materialsProgress
              .sort((a, b) => (a.coveragePercentage || 0) - (b.coveragePercentage || 0))
              .slice(0, 5)
              .map((material, idx) => (
                <MaterialCard 
                  key={idx} 
                  material={material} 
                  theme={theme}
                  textColor={textColor}
                  lightSubtextColor={lightSubtextColor}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickActions({ router, theme, textColor, subtextColor }) {
  const actions = [
    { icon: '/chat_logo.png', 
      title: 'Start Chatting', desc: 'Ask questions about your course', path: '/chat' },
    { icon: '/quiz.png',
      title: 'Take a Quiz', desc: 'Test your knowledge', path: '/quiz' },]

  return (
    <div className="glass-card p-8">
      <h2 className={`font-montserrat text-2xl font-bold mb-6 ${textColor}`}>
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => router.push(action.path)}
            className="glass-card p-6 hover:scale-105 transition-all text-left"
          >
            <img src={action.icon} alt={action.title} className="w-8 h-8 mb-2 mx-auto logo-adaptive" />
            <p className={`font-semibold ${textColor}`}>{action.title}</p>
            <p className={`text-sm ${subtextColor}`}>{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

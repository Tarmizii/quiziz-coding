import React from 'react';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award, 
  BookOpen,
  Calendar,
  Star
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockQuizzes } from '../../data/mockData';

export function UserDashboard() {
  const { state } = useApp();
  const user = state.user!;

  const stats = [
    {
      icon: Trophy,
      label: 'Total Score',
      value: user.totalScore.toLocaleString(),
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      icon: Target,
      label: 'Quizzes Completed',
      value: user.completedQuizzes,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      icon: Clock,
      label: 'Learning Streak',
      value: `${user.streak} days`,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    },
    {
      icon: Award,
      label: 'Badges Earned',
      value: user.badges.length,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  const recentActivity = [
    { quiz: 'JavaScript Fundamentals', score: 85, date: '2 hours ago', status: 'passed' },
    { quiz: 'React Essentials', score: 92, date: '1 day ago', status: 'passed' },
    { quiz: 'CSS Advanced', score: 78, date: '3 days ago', status: 'passed' },
    { quiz: 'Python Basics', score: 65, date: '5 days ago', status: 'failed' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">
              Ready to continue your learning journey?
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'passed' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{activity.quiz}</h3>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        activity.status === 'passed' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {activity.score}%
                      </div>
                      <div className={`text-xs uppercase tracking-wide ${
                        activity.status === 'passed' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {activity.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Badges and Achievements */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Badges</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {user.badges.map((badge, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold text-gray-900 text-sm">{badge.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Quizzes */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recommended</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockQuizzes.slice(0, 2).map((quiz, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <BookOpen className="w-8 h-8 text-blue-500" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{quiz.title}</h3>
                      <p className="text-xs text-gray-600">{quiz.questions.length} questions</p>
                    </div>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
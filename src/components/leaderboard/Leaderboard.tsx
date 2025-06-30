import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users } from 'lucide-react';
import { mockLeaderboard } from '../../data/mockData';

export function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');

  const filters = [
    { key: 'weekly', label: 'This Week' },
    { key: 'monthly', label: 'This Month' },
    { key: 'all-time', label: 'All Time' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-600">{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        </div>
        <p className="text-xl text-gray-600">
          See how you rank against other developers
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
          <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">50,247</div>
          <div className="text-gray-600">Total Players</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
          <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">1,250</div>
          <div className="text-gray-600">Your Rank</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 mb-1">15,890</div>
          <div className="text-gray-600">Your Score</div>
        </div>
      </div>

      {/* Time Filter */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setTimeFilter(filter.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeFilter === filter.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="p-6">
          <div className="space-y-4">
            {mockLeaderboard.map((entry, index) => (
              <div
                key={entry.user.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${getRankBg(entry.rank)} transition-all hover:shadow-md`}
              >
                <div className="flex-shrink-0">
                  {getRankIcon(entry.rank)}
                </div>
                
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">
                    {entry.user.name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{entry.user.name}</h3>
                  <p className="text-sm text-gray-600">
                    {entry.user.completedQuizzes} quizzes completed • {entry.recentActivity}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {entry.totalScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">points</div>
                </div>

                <div className="flex space-x-1">
                  {entry.user.badges.slice(0, 3).map((badge, badgeIndex) => (
                    <div
                      key={badgeIndex}
                      className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs"
                      title={badge.name}
                    >
                      {badge.icon}
                    </div>
                  ))}
                  {entry.user.badges.length > 3 && (
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">
                      +{entry.user.badges.length - 3}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Showcase */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-8 text-center">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Climb the Ranks!
        </h2>
        <p className="text-gray-600 mb-6">
          Complete more quizzes to improve your ranking and earn exclusive badges
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Take a Quiz Now
        </button>
      </div>
    </div>
  );
}
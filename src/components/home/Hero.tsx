import React from 'react';
import { ArrowRight, Play, Code2, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export function Hero() {
  const stats = [
    { icon: Users, label: 'Active Learners', value: '50K+' },
    { icon: Code2, label: 'Code Challenges', value: '1000+' },
    { icon: Trophy, label: 'Certificates Earned', value: '25K+' }
  ];

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-emerald-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Programming with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              Interactive Quizzes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Challenge yourself with our comprehensive programming quizzes. From HTML and CSS to React and Node.js, 
            enhance your coding skills with immediate feedback and detailed explanations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/quizzes">
              <Button size="lg" icon={ArrowRight} iconPosition="right">
                Start Learning Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" icon={Play}>
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4 group-hover:shadow-xl transition-shadow">
                    <Icon className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Code Elements */}
      <div className="absolute top-20 left-10 opacity-10 rotate-12 hidden lg:block">
        <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm">
          <div>{'const quiz = () => {'}</div>
          <div>{'  return \'awesome!\';'}</div>
          <div>{'};'}</div>
        </div>
      </div>
      <div className="absolute bottom-20 right-10 opacity-10 -rotate-12 hidden lg:block">
        <div className="bg-gray-800 text-blue-400 p-4 rounded-lg font-mono text-sm">
          <div>{'<Quiz />'}</div>
        </div>
      </div>
    </div>
  );
}
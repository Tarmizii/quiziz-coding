import React from 'react';
import { 
  Code, 
  Clock, 
  Trophy, 
  Users, 
  BarChart3, 
  Zap,
  CheckCircle,
  BookOpen
} from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Code,
      title: 'Interactive Code Challenges',
      description: 'Practice with real code snippets and get instant feedback on your programming knowledge.',
      color: 'bg-blue-500'
    },
    {
      icon: Clock,
      title: 'Timed Quizzes',
      description: 'Challenge yourself with time-limited quizzes that simulate real coding interview conditions.',
      color: 'bg-emerald-500'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Earn badges and climb the leaderboard as you progress through different difficulty levels.',
      color: 'bg-yellow-500'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and performance insights.',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Join thousands of developers and learn together in our supportive community.',
      color: 'bg-pink-500'
    },
    {
      icon: Zap,
      title: 'Instant Feedback',
      description: 'Get immediate explanations for correct and incorrect answers to accelerate your learning.',
      color: 'bg-orange-500'
    },
    {
      icon: CheckCircle,
      title: 'Multiple Categories',
      description: 'Choose from HTML, CSS, JavaScript, Python, React, Node.js and many more technologies.',
      color: 'bg-indigo-500'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Resources',
      description: 'Access detailed explanations, documentation links, and learning resources for each topic.',
      color: 'bg-teal-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines interactive learning with comprehensive tracking to give you 
            the best programming education experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
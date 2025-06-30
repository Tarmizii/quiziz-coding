import React from 'react';
import { useInView } from 'react-intersection-observer';
import { BookOpen, Users, Grid3X3 } from 'lucide-react';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

export function StatsSection() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const questionsCount = useAnimatedCounter(50000, 2000, inView);
  const usersCount = useAnimatedCounter(25000, 2000, inView);
  const categoriesCount = useAnimatedCounter(30, 2000, inView);

  const stats = [
    {
      icon: BookOpen,
      count: questionsCount,
      suffix: '+',
      label: 'Questions Available',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      count: usersCount,
      suffix: '',
      label: 'Active Users',
      color: 'text-emerald-600'
    },
    {
      icon: Grid3X3,
      count: categoriesCount,
      suffix: '',
      label: 'Subject Categories',
      color: 'text-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.color} bg-white rounded-full shadow-lg mb-6`}>
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.count.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-lg text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
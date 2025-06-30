import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { UserPlus, BookOpen, PenTool, TrendingUp } from 'lucide-react';

export function HowItWorksSection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const steps = [
    {
      number: 1,
      title: 'Create Account',
      description: 'Sign up for free and set up your personalized learning profile',
      icon: UserPlus,
      color: 'bg-blue-500'
    },
    {
      number: 2,
      title: 'Choose Subject',
      description: 'Browse and select from 30+ subject categories',
      icon: BookOpen,
      color: 'bg-emerald-500'
    },
    {
      number: 3,
      title: 'Answer Questions',
      description: 'Practice with thousands of verified questions',
      icon: PenTool,
      color: 'bg-purple-500'
    },
    {
      number: 4,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with QuestionBank in just four simple steps
          </p>
        </div>

        <div ref={ref} className="relative">
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="text-center"
                  >
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-700">{step.number}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Connecting Lines */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-emerald-500 via-purple-500 to-orange-500 opacity-30"></div>
            </div>
          </div>

          {/* Mobile Layout - Vertical Timeline */}
          <div className="md:hidden space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -50 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 -z-10 last:hidden"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                        {step.number}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
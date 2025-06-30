import React from 'react';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '../common/Button';

export function HeroSection() {
  const handleStartPracticing = () => {
    window.location.href = '/login?return_url=' + encodeURIComponent('/student/dashboard');
  };

  const handleContributeQuestions = () => {
    window.location.href = '/login?return_url=' + encodeURIComponent('/educator/dashboard');
  };

  return (
    <section 
      id="home" 
      className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 h-[80vh] md:h-[80vh] sm:h-[60vh] flex items-center overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master Your Knowledge
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Through Practice
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Access 10,000+ verified questions across multiple subjects and accelerate your learning journey
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              icon={ArrowRight} 
              iconPosition="right"
              onClick={handleStartPracticing}
            >
              Start Practicing
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              icon={Users}
              onClick={handleContributeQuestions}
            >
              Contribute Questions
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Trusted by 25,000+ students</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>99.9% uptime guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Expert-verified content</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, Menu, X, User, Trophy, BookOpen, Settings } from 'lucide-react';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { state, dispatch } = useApp();

  const navigation = [
    { name: 'Home', href: '/', icon: BookOpen },
    { name: 'Quizzes', href: '/quizzes', icon: Code },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Dashboard', href: '/dashboard', icon: User }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-gray-900">CodeQuiz</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {state.isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {state.user?.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {state.user?.name}
                  </span>
                </div>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline">Login</Button>
                <Button>Sign Up</Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="border-t border-gray-200 pt-3 mt-3">
              {state.isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {state.user?.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {state.user?.name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  <Button variant="outline" className="w-full">Login</Button>
                  <Button className="w-full">Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
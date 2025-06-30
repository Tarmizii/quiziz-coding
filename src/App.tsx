import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/sections/HeroSection';
import { StatsSection } from './components/sections/StatsSection';
import { QuestionCatalog } from './components/sections/QuestionCatalog';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { FooterSection } from './components/sections/FooterSection';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoadingSpinner } from './components/common/LoadingSpinner';

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <QuestionCatalog />
        <HowItWorksSection />
        <TestimonialsSection />
      </main>
      <FooterSection />
    </div>
  );
}

function DashboardRouter() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // Route based on user role
  switch (profile.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'student':
    default:
      return <Navigate to="/student/dashboard" replace />;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Dashboard routing */}
          <Route path="/dashboard" element={<DashboardRouter />} />
          
          {/* Student routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
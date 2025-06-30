import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AlertTriangle, Lock, UserX } from 'lucide-react';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'admin';
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  requireAuth = true
}: ProtectedRouteProps) {
  const { user, profile, loading, signOut } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not logged in
  if (requireAuth && !user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?return_url=${returnUrl}`} replace />;
  }

  // Check role requirements
  if (requiredRole && profile?.role !== requiredRole) {
    const getAccessDeniedInfo = () => {
      if (!profile) {
        return {
          icon: Lock,
          title: 'Authentication Required',
          message: 'Please log in to access this resource.',
          color: 'text-red-500'
        };
      }

      switch (requiredRole) {
        case 'admin':
          return {
            icon: UserX,
            title: 'Admin Access Required',
            message: 'You need administrator privileges to access this resource.',
            color: 'text-red-500'
          };
        case 'student':
          return {
            icon: UserX,
            title: 'Student Access Required',
            message: 'This resource is only available to students.',
            color: 'text-red-500'
          };
        default:
          return {
            icon: Lock,
            title: 'Access Denied',
            message: 'You do not have permission to access this resource.',
            color: 'text-red-500'
          };
      }
    };

    const accessInfo = getAccessDeniedInfo();
    const Icon = accessInfo.icon;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <Icon className={`w-16 h-16 ${accessInfo.color} mx-auto mb-4`} />
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {accessInfo.title}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {accessInfo.message}
          </p>

          {profile && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Current Access Level:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Role: {profile.role}</div>
                <div>• Email: {profile.email}</div>
                <div>• Required: {requiredRole}</div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button 
              variant="ghost" 
              onClick={signOut}
              className="flex-1"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // User has access - render protected content
  return <>{children}</>;
}
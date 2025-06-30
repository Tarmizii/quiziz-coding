import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, Clock, Target, Play, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface Course {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Enrollment {
  id: string;
  progress: number;
  enrolled_at: string;
  courses: Course;
}

export function StudentDashboard() {
  const { user, profile, signOut } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load user enrollments
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          id,
          progress,
          enrolled_at,
          courses (
            id,
            title,
            description,
            created_at
          )
        `)
        .eq('student_id', user?.id);

      if (enrollmentsError) throw enrollmentsError;

      // Load available courses (not enrolled)
      const enrolledCourseIds = enrollmentsData?.map(e => e.courses?.id) || [];
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .not('id', 'in', `(${enrolledCourseIds.join(',')})`)
        .limit(6);

      if (coursesError) throw coursesError;

      setEnrollments(enrollmentsData || []);
      setAvailableCourses(coursesData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) return;

    setEnrolling(courseId);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: courseId,
          progress: 0
        });

      if (error) throw error;

      // Reload dashboard data
      await loadDashboardData();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(null);
    }
  };

  const stats = [
    {
      icon: BookOpen,
      label: 'Enrolled Courses',
      value: enrollments.length.toString(),
      color: 'bg-blue-500'
    },
    {
      icon: Trophy,
      label: 'Completed',
      value: enrollments.filter(e => e.progress === 100).length.toString(),
      color: 'bg-emerald-500'
    },
    {
      icon: Target,
      label: 'Average Progress',
      value: enrollments.length > 0 
        ? `${Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)}%`
        : '0%',
      color: 'bg-purple-500'
    },
    {
      icon: Clock,
      label: 'Study Streak',
      value: '7 days',
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">QuestionBank</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {profile?.full_name?.charAt(0) || 'S'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {profile?.full_name}
                </span>
              </div>
              <Button variant="ghost" onClick={signOut}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name}!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey
          </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Courses */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
              <p className="text-gray-600 mt-1">Continue where you left off</p>
            </div>
            <div className="p-6">
              {enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {enrollment.courses.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {enrollment.courses.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{enrollment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                        <Button size="sm" icon={Play}>
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No courses enrolled yet</p>
                  <p className="text-sm text-gray-400">Browse available courses to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Available Courses */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Available Courses</h2>
              <p className="text-gray-600 mt-1">Discover new learning opportunities</p>
            </div>
            <div className="p-6">
              {availableCourses.length > 0 ? (
                <div className="space-y-4">
                  {availableCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {course.description}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => handleEnroll(course.id)}
                            disabled={enrolling === course.id}
                            icon={Users}
                          >
                            {enrolling === course.id ? 'Enrolling...' : 'Enroll'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No courses available</p>
                  <p className="text-sm text-gray-400">Check back later for new courses</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface Course {
  id: string;
  title: string;
  description: string;
  created_at: string;
  enrollments?: { count: number }[];
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

export function AdminDashboard() {
  const { user, profile, signOut } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    averageProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load courses with enrollment counts
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          enrollments (count)
        `);

      if (coursesError) throw coursesError;

      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Load enrollment stats
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('progress');

      if (enrollmentsError) throw enrollmentsError;

      setCourses(coursesData || []);
      setUsers(usersData || []);
      
      const totalEnrollments = enrollmentsData?.length || 0;
      const averageProgress = totalEnrollments > 0 
        ? enrollmentsData.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments
        : 0;

      setStats({
        totalCourses: coursesData?.length || 0,
        totalStudents: usersData?.filter(u => u.role === 'student').length || 0,
        totalEnrollments,
        averageProgress: Math.round(averageProgress)
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim()) return;

    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          title: newCourse.title,
          description: newCourse.description,
          created_by: user?.id
        });

      if (error) throw error;

      setNewCourse({ title: '', description: '' });
      setShowCreateCourse(false);
      await loadDashboardData();
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const dashboardStats = [
    {
      icon: BookOpen,
      label: 'Total Courses',
      value: stats.totalCourses,
      color: 'bg-blue-500',
      change: '+2 this week'
    },
    {
      icon: Users,
      label: 'Total Students',
      value: stats.totalStudents,
      color: 'bg-emerald-500',
      change: '+12 this month'
    },
    {
      icon: TrendingUp,
      label: 'Total Enrollments',
      value: stats.totalEnrollments,
      color: 'bg-purple-500',
      change: '+25 this month'
    },
    {
      icon: Clock,
      label: 'Avg Progress',
      value: `${stats.averageProgress}%`,
      color: 'bg-orange-500',
      change: '+5% from last week'
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
              <span className="text-xl font-bold text-gray-900">QuestionBank Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {profile?.full_name?.charAt(0) || 'A'}
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage courses, users, and monitor platform activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{stat.change}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Management */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Course Management</h2>
                <Button 
                  size="sm" 
                  icon={Plus}
                  onClick={() => setShowCreateCourse(true)}
                >
                  Add Course
                </Button>
              </div>
            </div>
            <div className="p-6">
              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.slice(0, 5).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600">
                          {course.enrollments?.[0]?.count || 0} enrollments
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" icon={Eye}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" icon={Edit}>
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Trash2}
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No courses created yet</p>
                </div>
              )}
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                      }`}>
                        <span className="text-white font-medium">
                          {user.full_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Create Course Modal */}
        {showCreateCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Course</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter course description"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateCourse(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCourse}
                  className="flex-1"
                >
                  Create Course
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, Clock, Users, Star, Play, CheckCircle, Lock, 
  User, Calendar, ArrowRight, Brain, MessageCircle 
} from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';

interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content: string;
  order_index: number;
  duration_minutes: number;
  created_at: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  image_url: string;
  lesson_count: number;
  isEnrolled: boolean;
  lessons: Lesson[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/courses/${courseId}`, { headers });
      const data = await response.json();
      
      if (data.course) {
        setCourse(data.course);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setEnrolling(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: parseInt(courseId) }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update course enrollment status
        setCourse(prev => prev ? { ...prev, isEnrolled: true } : null);
      } else {
        alert(data.error || 'Enrollment failed');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalDuration = course?.lessons.reduce((sum, lesson) => sum + lesson.duration_minutes, 0) || 0;
  const durationText = totalDuration >= 60 
    ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`
    : `${totalDuration}m`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-primary-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
            <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
            <Link href="/courses" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li><ArrowRight className="h-4 w-4" /></li>
            <li><Link href="/courses" className="hover:text-primary-600">Courses</Link></li>
            <li><ArrowRight className="h-4 w-4" /></li>
            <li className="text-gray-900 font-medium truncate">{course.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    {course.isEnrolled && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Enrolled
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                  <p className="text-gray-600 text-lg leading-relaxed">{course.description}</p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{course.lesson_count}</div>
                  <div className="text-sm text-gray-600">Lessons</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{durationText}</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <User className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{course.instructor}</div>
                  <div className="text-sm text-gray-600">Instructor</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>

              {/* Enrollment Button */}
              {!course.isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center"
                >
                  {enrolling ? 'Enrolling...' : user ? 'Enroll in Course' : 'Login to Enroll'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              ) : (
                <Link
                  href={`/courses/${courseId}/lesson/${course.lessons[0]?.id}`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center"
                >
                  Continue Learning
                  <Play className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              
              {course.isEnrolled && (
                <div className="mb-6">
                  <ProgressBar progress={30} showLabel={true} />
                </div>
              )}

              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`border border-gray-200 rounded-lg p-4 ${
                      course.isEnrolled ? 'hover:bg-gray-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`p-2 rounded-full ${
                          course.isEnrolled ? 'bg-primary-100' : 'bg-gray-200'
                        }`}>
                          {course.isEnrolled ? (
                            <Play className={`h-4 w-4 ${
                              course.isEnrolled ? 'text-primary-600' : 'text-gray-400'
                            }`} />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${
                            course.isEnrolled ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {index + 1}. {lesson.title}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration_minutes}min
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {course.isEnrolled && (
                        <Link
                          href={`/courses/${courseId}/lesson/${lesson.id}`}
                          className="text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          Start
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/ai-tutor"
                  className="w-full bg-primary-100 hover:bg-primary-200 text-primary-700 py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Ask AI Tutor
                </Link>
                <Link
                  href={`/quiz/${courseId}`}
                  className="w-full bg-secondary-100 hover:bg-secondary-200 text-secondary-700 py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Take Quiz
                </Link>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-600 w-12 h-12 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{course.instructor}</div>
                  <div className="text-sm text-gray-600">Expert Instructor</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Experienced professional with extensive knowledge in the field. 
                Passionate about teaching and helping students succeed.
              </p>
            </div>

            {/* Course Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lessons:</span>
                  <span className="font-medium">{course.lesson_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{durationText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate:</span>
                  <span className="font-medium">Yes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
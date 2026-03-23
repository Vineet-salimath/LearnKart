'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, BookOpen, Clock, CheckCircle, 
  Brain, ChevronLeft, ChevronRight, MessageCircle 
} from 'lucide-react';
import AITutor from '@/components/AITutor';
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
  lessons: Lesson[];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchLessonAndCourse();
  }, [lessonId]);

  const fetchLessonAndCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Fetch lesson
      const lessonResponse = await fetch(`/api/lessons/${lessonId}`, { headers });
      const lessonData = await lessonResponse.json();
      
      // Fetch course
      const courseResponse = await fetch(`/api/courses/${courseId}`, { headers });
      const courseData = await courseResponse.json();
      
      if (lessonData.lesson && courseData.course) {
        setLesson(lessonData.lesson);
        setCourse(courseData.course);
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setCompleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        // Move to next lesson or course page
        const currentIndex = course?.lessons.findIndex(l => l.id === parseInt(lessonId));
        if (currentIndex !== undefined && currentIndex !== -1 && course) {
          const nextLesson = course.lessons[currentIndex + 1];
          if (nextLesson) {
            router.push(`/courses/${courseId}/lesson/${nextLesson.id}`);
          } else {
            router.push(`/courses/${courseId}`);
          }
        }
      } else {
        alert(data.error || 'Failed to mark lesson as complete');
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      alert('Failed to mark lesson as complete. Please try again.');
    } finally {
      setCompleting(false);
    }
  };

  const getCurrentLessonIndex = () => {
    if (!course || !lesson) return -1;
    return course.lessons.findIndex(l => l.id === lesson.id);
  };

  const getPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0 && course) {
      return course.lessons[currentIndex - 1];
    }
    return null;
  };

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex >= 0 && currentIndex < course!.lessons.length - 1 && course) {
      return course.lessons[currentIndex + 1];
    }
    return null;
  };

  const getProgress = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex >= 0 && course) {
      return ((currentIndex + 1) / course.lessons.length) * 100;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-primary-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h1>
            <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist.</p>
            <Link href={`/courses/${courseId}`} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg">
              Back to Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const previousLesson = getPreviousLesson();
  const nextLesson = getNextLesson();
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href={`/courses/${courseId}`}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Course
              </Link>
              <div className="hidden md:block text-gray-300">|</div>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                  {lesson.title}
                </h1>
                <p className="text-sm text-gray-600">{course.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{lesson.duration_minutes}min</span>
              </div>
              <button
                onClick={() => setShowAITutor(!showAITutor)}
                className="bg-primary-100 hover:bg-primary-200 text-primary-700 p-2 rounded-lg"
              >
                <Brain className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="pb-4">
            <ProgressBar 
              progress={progress} 
              showLabel={false} 
              size="sm"
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>Lesson {getCurrentLessonIndex() + 1} of {course.lessons.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Lesson Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{lesson.duration_minutes} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>Lesson {getCurrentLessonIndex() + 1}</span>
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="prose prose-lg max-w-none mb-8">
                {lesson.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    {previousLesson && (
                      <Link
                        href={`/courses/${courseId}/lesson/${previousLesson.id}`}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                      >
                        <ChevronLeft className="h-5 w-5 mr-1" />
                        Previous Lesson
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleCompleteLesson}
                      disabled={completing || !user}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center font-semibold"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {completing ? 'Completing...' : 'Mark Complete'}
                    </button>

                    {nextLesson ? (
                      <Link
                        href={`/courses/${courseId}/lesson/${nextLesson.id}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center font-semibold"
                      >
                        Next Lesson
                        <ChevronRight className="h-5 w-5 ml-2" />
                      </Link>
                    ) : (
                      <Link
                        href={`/courses/${courseId}`}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center font-semibold"
                      >
                        Course Complete
                        <CheckCircle className="h-5 w-5 ml-2" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h3>
              <ProgressBar progress={progress} showLabel={true} />
              <p className="text-sm text-gray-600 mt-2">
                {getCurrentLessonIndex() + 1} of {course.lessons.length} lessons completed
              </p>
            </div>

            {/* Lesson Navigation */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lessons</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {course.lessons.map((courseLesson, index) => (
                  <Link
                    key={courseLesson.id}
                    href={`/courses/${courseId}/lesson/${courseLesson.id}`}
                    className={`block p-3 rounded-lg text-sm ${
                      courseLesson.id === lesson.id
                        ? 'bg-primary-100 text-primary-800 border border-primary-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="font-medium truncate">
                      {index + 1}. {courseLesson.title}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {courseLesson.duration_minutes}min
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAITutor(true)}
                  className="w-full bg-primary-100 hover:bg-primary-200 text-primary-700 py-3 px-4 rounded-lg flex items-center justify-center"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Ask AI Tutor
                </button>
                <Link
                  href={`/quiz/${courseId}`}
                  className="w-full bg-secondary-100 hover:bg-secondary-200 text-secondary-700 py-3 px-4 rounded-lg flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Take Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tutor Modal */}
      {showAITutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">AI Tutor</h3>
              <button
                onClick={() => setShowAITutor(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="flex-1">
              <AITutor 
                courseContext={`Course: ${course.title}, Lesson: ${lesson.title}`}
                placeholder="Ask about this lesson..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
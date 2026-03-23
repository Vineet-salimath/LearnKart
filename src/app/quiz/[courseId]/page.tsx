'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, BookOpen, ArrowLeft, Trophy, Clock, Target } from 'lucide-react';
import QuizComponent from '@/components/QuizComponent';

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  instructor: string;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [finalScore, setFinalScore] = useState<{ score: number; total: number } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
      return;
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

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    setFinalScore({ score, total: totalQuestions });
    setQuizComplete(true);
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setQuizComplete(false);
    setFinalScore(null);
    setTimeout(() => setShowQuiz(true), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Brain className="h-12 w-12 text-primary-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Loading quiz...</p>
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
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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

  if (showQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowQuiz(false)}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <ArrowLeft className="h-5 w-5 mr-1" />
                  Back to Quiz Info
                </button>
                <div className="hidden md:block text-gray-300">|</div>
                <div className="hidden md:block">
                  <h1 className="text-lg font-semibold text-gray-900">
                    AI Quiz: {course.title}
                  </h1>
                  <p className="text-sm text-gray-600">Test your knowledge with AI-generated questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuizComponent 
            courseId={parseInt(courseId)} 
            onComplete={handleQuizComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>→</li>
            <li><Link href="/courses" className="hover:text-primary-600">Courses</Link></li>
            <li>→</li>
            <li><Link href={`/courses/${courseId}`} className="hover:text-primary-600">{course.title}</Link></li>
            <li>→</li>
            <li className="text-gray-900 font-medium">Quiz</li>
          </ol>
        </nav>

        {/* Quiz Introduction */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">AI-Generated Quiz</h1>
                <p className="text-primary-100">Test your knowledge with personalized questions</p>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{course.title}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{course.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <BookOpen className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">{course.level}</div>
                  <div className="text-sm text-gray-600">Difficulty Level</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">10-15 min</div>
                  <div className="text-sm text-gray-600">Estimated Time</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900">5 Questions</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
              </div>
            </div>

            {/* Quiz Features */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What to Expect</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Brain className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">AI-Generated Questions</h4>
                    <p className="text-gray-600 text-sm">
                      Questions are dynamically created based on the course content using advanced AI
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Adaptive Difficulty</h4>
                    <p className="text-gray-600 text-sm">
                      Questions are tailored to the course level and learning objectives
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Detailed Explanations</h4>
                    <p className="text-gray-600 text-sm">
                      Get comprehensive explanations for each answer to reinforce learning
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Trophy className="h-6 w-6 text-yellow-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Instant Results</h4>
                    <p className="text-gray-600 text-sm">
                      See your score and performance insights immediately after completion
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous Results */}
            {quizComplete && finalScore && (
              <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">Latest Quiz Result</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {finalScore.score}/{finalScore.total}
                    </div>
                    <div className="text-sm text-green-600">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {Math.round((finalScore.score / finalScore.total) * 100)}%
                    </div>
                    <div className="text-sm text-green-600">Percentage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-700">
                      {finalScore.score / finalScore.total >= 0.8 ? 'Excellent!' : 
                       finalScore.score / finalScore.total >= 0.6 ? 'Good Job!' : 'Keep Practicing!'}
                    </div>
                    <div className="text-sm text-green-600">Performance</div>
                  </div>
                </div>
                <button
                  onClick={resetQuiz}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Retake Quiz
                </button>
              </div>
            )}

            {/* Instructions */}
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Instructions</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Read each question carefully before selecting an answer</li>
                <li>• You can review and change your answers before submitting</li>
                <li>• Take your time - there's no strict time limit</li>
                <li>• Questions cover key concepts from the course material</li>
                <li>• You'll receive detailed explanations after completion</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowQuiz(true)}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center"
              >
                <Brain className="h-5 w-5 mr-2" />
                Start AI Quiz
              </button>
              <Link
                href={`/courses/${courseId}`}
                className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Course
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Brain, BookOpen, MessageCircle, Lightbulb, HelpCircle } from 'lucide-react';
import AITutor from '@/components/AITutor';

export default function AITutorPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const courses = [
    { id: '1', title: 'Introduction to Python Programming' },
    { id: '2', title: 'Web Development with React' },
    { id: '3', title: 'Machine Learning Fundamentals' },
    { id: '4', title: 'Data Science with Pandas' },
  ];

  const exampleQuestions = [
    {
      category: 'Python Programming',
      icon: BookOpen,
      questions: [
        'What is the difference between a list and a tuple in Python?',
        'How do I handle exceptions in Python?',
        'Explain Python decorators with an example',
        'What are lambda functions and when should I use them?'
      ]
    },
    {
      category: 'Web Development',
      icon: MessageCircle,
      questions: [
        'What is the virtual DOM in React?',
        'How do React hooks work?',
        'Explain the difference between props and state',
        'What is JSX and why do we use it?'
      ]
    },
    {
      category: 'Machine Learning',
      icon: Brain,
      questions: [
        'What is the difference between supervised and unsupervised learning?',
        'How do I choose the right algorithm for my problem?',
        'What is overfitting and how can I prevent it?',
        'Explain cross-validation in simple terms'
      ]
    },
    {
      category: 'Data Science',
      icon: Lightbulb,
      questions: [
        'How do I handle missing data in pandas?',
        'What is the difference between merge and join?',
        'How do I create effective data visualizations?',
        'Explain groupby operations with examples'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Learning Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant, personalized help with your learning. Ask questions, get explanations, 
            and receive guidance tailored to your current course and progress.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Tutor Chat */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Course Context Selector */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Context (Optional)</h3>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  <option value="">General Questions - No specific course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.title}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-600 mt-2">
                  Select a course to get context-specific answers and examples
                </p>
              </div>

              {/* AI Tutor Component */}
              <div className="h-[600px]">
                <AITutor 
                  courseContext={selectedCourse}
                  placeholder="Ask me anything about programming, web development, data science, or machine learning..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Features */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Tutor Features</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Brain className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Intelligent Explanations</h4>
                    <p className="text-sm text-gray-600">Get clear, step-by-step explanations tailored to your level</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Course-Aware</h4>
                    <p className="text-sm text-gray-600">Answers are customized based on your current course context</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Code Examples</h4>
                    <p className="text-sm text-gray-600">Get practical code examples and real-world applications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">24/7 Available</h4>
                    <p className="text-sm text-gray-600">Get help anytime, anywhere at your own pace</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Questions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Questions</h3>
              <div className="space-y-4">
                {exampleQuestions.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center space-x-2 mb-3">
                      <category.icon className="h-4 w-4 text-primary-600" />
                      <h4 className="font-medium text-gray-900 text-sm">{category.category}</h4>
                    </div>
                    <div className="space-y-2 pl-6">
                      {category.questions.map((question, qIndex) => (
                        <button
                          key={qIndex}
                          className="block text-left w-full text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 p-2 rounded transition-colors"
                          onClick={() => {
                            // This would trigger the AI tutor with the pre-filled question
                            // For now, it's just a visual example
                          }}
                        >
                          "{question}"
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Tips for Better Answers</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Be specific in your questions</li>
                <li>• Mention your experience level</li>
                <li>• Include relevant code if asking about debugging</li>
                <li>• Ask follow-up questions to dive deeper</li>
                <li>• Use the course context selector for better results</li>
              </ul>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions Asked Today</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Problems Solved</span>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Learning Streak</span>
                  <span className="font-semibold">7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Need More Personalized Help?
            </h3>
            <p className="text-primary-100 mb-6">
              Enroll in our courses to get AI-powered recommendations, progress tracking, 
              and course-specific tutoring that adapts to your learning style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/courses"
                className="bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Courses
              </a>
              <a
                href="/register"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
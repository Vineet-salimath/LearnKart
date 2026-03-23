import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, TrendingUp, Users, Star, CheckCircle } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { getAllCourses } from '@/lib/db';

export default async function HomePage() {
  const courses = getAllCourses();
  const featuredCourses = courses.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Learn Smarter with{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  AI-Powered
                </span>{' '}
                Education
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                Experience personalized learning with our advanced AI tutor, adaptive courses, 
                and intelligent progress tracking. Master new skills faster than ever before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/courses"
                  className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold flex items-center justify-center group transition-colors"
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/ai-tutor"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold flex items-center justify-center transition-colors"
                >
                  Try AI Tutor
                  <Brain className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI-Powered Tutoring</h3>
                      <p className="text-primary-100 text-sm">Get instant help and explanations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Adaptive Learning</h3>
                      <p className="text-primary-100 text-sm">Courses that adapt to your pace</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Expert Instructors</h3>
                      <p className="text-primary-100 text-sm">Learn from industry professionals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LearnKart?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with proven educational methods 
              to deliver an unparalleled learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Tutor",
                description: "24/7 intelligent tutoring that adapts to your learning style and provides instant feedback."
              },
              {
                icon: BookOpen,
                title: "Rich Content",
                description: "Comprehensive courses designed by experts with hands-on projects and real-world applications."
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description: "Detailed analytics and insights to track your learning journey and identify areas for improvement."
              },
              {
                icon: Users,
                title: "Community",
                description: "Connect with fellow learners, share knowledge, and collaborate on projects."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="bg-primary-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600">
              Start your learning journey with our most popular courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/courses"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold inline-flex items-center"
            >
              View All Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Active Learners" },
              { number: "50+", label: "Expert Courses" },
              { number: "95%", label: "Completion Rate" },
              { number: "4.9/5", label: "Average Rating" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Developer",
                content: "The AI tutor is incredible! It helped me understand complex React concepts that I was struggling with. The personalized explanations made all the difference.",
                rating: 5
              },
              {
                name: "Mike Chen",
                role: "Data Scientist",
                content: "LearnKart's machine learning course gave me the skills I needed to transition into data science. The hands-on projects were especially valuable.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Student",
                content: "I love how the platform adapts to my learning pace. The progress tracking helps me stay motivated and see how far I've come.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-600 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of learners who are advancing their careers with LearnKart's AI-powered education platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-primary-600 hover:bg-primary-50 px-8 py-4 rounded-lg font-semibold flex items-center justify-center"
            >
              Get Started Free
              <CheckCircle className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/courses"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
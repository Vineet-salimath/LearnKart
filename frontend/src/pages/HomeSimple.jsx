import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { coursesAPI } from '../api/index';
import { Loader } from '../components/common/Loader';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🚀 Home component mounted, fetching courses...');

    const fetchCourses = async () => {
      try {
        console.log('📡 Calling coursesAPI.getAll...');
        const response = await coursesAPI.getAll({ limit: 6 });
        console.log('✅ API Response:', response);

        const coursesData = response.data?.data?.courses || [];
        console.log('📚 Courses data:', coursesData);

        setCourses(coursesData);
      } catch (err) {
        console.error('❌ Failed to fetch courses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  console.log('🔄 Render state:', { loading, courses: courses.length, error });

  if (loading) {
    console.log('⏳ Showing loader...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading LearnKart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('⚠️ Showing error...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-2">Error Loading Content</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  console.log('✨ Rendering main content...');

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      {/* Simple Header Test */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            Welcome to LearnKart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8"
          >
            Learn Without Limits - Premium Online Learning Platform
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/courses"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Explore Courses
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600">50K+</div>
              <div className="text-gray-600 dark:text-gray-400">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">200+</div>
              <div className="text-gray-600 dark:text-gray-400">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">100+</div>
              <div className="text-gray-600 dark:text-gray-400">Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600">150+</div>
              <div className="text-gray-600 dark:text-gray-400">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Featured Courses</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Master in-demand skills with our premium video courses
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-br from-indigo-500 to-blue-600 relative">
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      ${course.discountPrice || course.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{course.category}</span>
                      <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded text-sm">
                        {course.totalLessons} lessons
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
                No courses found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Courses are being loaded... Please check console for details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-100 dark:bg-gray-800 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <details className="bg-white dark:bg-gray-900 rounded p-4">
            <summary className="cursor-pointer font-semibold">Debug Info (Click to expand)</summary>
            <div className="mt-4 text-sm">
              <p><strong>Loading:</strong> {loading.toString()}</p>
              <p><strong>Error:</strong> {error || 'None'}</p>
              <p><strong>Courses Count:</strong> {courses.length}</p>
              <p><strong>Theme:</strong> You can test dark mode toggle in navbar</p>
              <p><strong>API Status:</strong> Mock API integrated with YouTube videos</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Home;
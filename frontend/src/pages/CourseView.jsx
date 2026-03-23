import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

// Mock course data - same as in CourseListingNew
const ALL_COURSES = [
  { id: 1, title: 'React Full Course', author: 'Traversy Media', cat: 'React/Next/TS', lvl: 'Beginner', price: 199, rating: 4.8, students: '32K', ytId: 'bMknfKXIFA8' },
  { id: 2, title: 'Next.js Full Course', author: 'Vercel Team', cat: 'React/Next/TS', lvl: 'Intermediate', price: 299, rating: 4.7, students: '18K', ytId: 'wm5gMKuwSYk' },
  { id: 3, title: 'TypeScript Course', author: 'Matt Pocock', cat: 'React/Next/TS', lvl: 'Intermediate', price: 249, rating: 4.6, students: '14K', ytId: '30LWjhZzg50' },
  { id: 4, title: 'JavaScript Full Course', author: 'FreeCodeCamp', cat: 'JavaScript', lvl: 'Beginner', price: 0, rating: 4.9, students: '95K', ytId: 'PkZNo7MFNFg' },
  { id: 5, title: 'Advanced JavaScript', author: 'Akshay Saini', cat: 'JavaScript', lvl: 'Advanced', price: 349, rating: 4.9, students: '41K', ytId: 'KGkiIBTq0y0' },
  { id: 6, title: 'JS Crash Course', author: 'Traversy Media', cat: 'JavaScript', lvl: 'Beginner', price: 99, rating: 4.5, students: '28K', ytId: 'hdI2bqOjy3c' },
  { id: 7, title: 'Ethical Hacking Full Course', author: 'TCM Security', cat: 'Cybersecurity', lvl: 'Beginner', price: 399, rating: 4.8, students: '22K', ytId: '3Kq1MIfTWCE' },
  { id: 8, title: 'Web Security Fundamentals', author: 'TCM Security', cat: 'Cybersecurity', lvl: 'Intermediate', price: 299, rating: 4.6, students: '11K', ytId: '3Kq1MIfTWCE' },
  { id: 9, title: 'Bug Bounty Guide', author: 'InsiderPhD', cat: 'Cybersecurity', lvl: 'Intermediate', price: 449, rating: 4.7, students: '8K', ytId: 'Pu3gk9K5cZ8' },
  { id: 10, title: 'Practical Ethical Hacking', author: 'Heath Adams', cat: 'Cybersecurity', lvl: 'Advanced', price: 499, rating: 4.9, students: '19K', ytId: 'fNzpcB7ODxQ' },
  { id: 11, title: 'HackTheBox Walkthrough', author: 'IppSec', cat: 'Cybersecurity', lvl: 'Advanced', price: 349, rating: 4.8, students: '7K', ytId: '2eLe7uz-7CM' },
  { id: 12, title: 'Docker Full Course', author: 'TechWorld Nina', cat: 'DevOps', lvl: 'Beginner', price: 199, rating: 4.7, students: '33K', ytId: 'fqMOX6JJhGo' },
  { id: 13, title: 'Kubernetes Full Course', author: 'TechWorld Nina', cat: 'DevOps', lvl: 'Intermediate', price: 349, rating: 4.8, students: '25K', ytId: 'X48VuDVv0do' },
  { id: 14, title: 'Jenkins CI/CD', author: 'Simplilearn', cat: 'DevOps', lvl: 'Intermediate', price: 249, rating: 4.5, students: '12K', ytId: 'FX322RVNGj4' },
  { id: 15, title: 'DevOps Roadmap', author: 'TechWorld', cat: 'DevOps', lvl: 'Beginner', price: 0, rating: 4.6, students: '44K', ytId: '9pZ2xmsSDdo' },
  { id: 16, title: 'Linux for Beginners', author: 'DorianDotSlash', cat: 'DevOps', lvl: 'Beginner', price: 149, rating: 4.7, students: '38K', ytId: 'ivd3b6z2d4k' },
  { id: 17, title: 'Mobile App Security Android', author: 'STÖK', cat: 'Mobile Security', lvl: 'Intermediate', price: 399, rating: 4.6, students: '6K', ytId: 'HhF0X9cXH6E' },
  { id: 18, title: 'OWASP Top 10 AppSec', author: 'TCM Security', cat: 'Mobile Security', lvl: 'Advanced', price: 449, rating: 4.8, students: '9K', ytId: '3Kq1MIfTWCE' },
  { id: 19, title: 'System Design Basics', author: 'Gaurav Sen', cat: 'System Design', lvl: 'Intermediate', price: 299, rating: 4.9, students: '52K', ytId: 'UzLMhqg3_Wc' },
  { id: 20, title: 'Microservices Architecture', author: 'Tech Primers', cat: 'System Design', lvl: 'Advanced', price: 399, rating: 4.7, students: '16K', ytId: 'rv4LlmLmVWk' },
  { id: 21, title: 'Node.js Full Course', author: 'FreeCodeCamp', cat: 'Backend', lvl: 'Beginner', price: 0, rating: 4.8, students: '67K', ytId: 'Oe421EPjeBE' },
  { id: 22, title: 'SQL Full Course', author: 'FreeCodeCamp', cat: 'Database', lvl: 'Beginner', price: 0, rating: 4.9, students: '88K', ytId: 'HXV3zeQKqGY' },
  { id: 23, title: 'PostgreSQL Complete', author: 'Amigoscode', cat: 'Database', lvl: 'Intermediate', price: 249, rating: 4.7, students: '21K', ytId: 'qw--VYLpxG4' },
  { id: 24, title: 'MongoDB Full Course', author: 'FreeCodeCamp', cat: 'Database', lvl: 'Beginner', price: 149, rating: 4.6, students: '29K', ytId: 'ofme2o29ngU' },
  { id: 25, title: 'Python Full Course', author: 'FreeCodeCamp', cat: 'Python', lvl: 'Beginner', price: 0, rating: 4.9, students: '112K', ytId: 'rfscVS0vtbw' },
  { id: 26, title: 'Python OOP', author: 'Corey Schafer', cat: 'Python', lvl: 'Intermediate', price: 199, rating: 4.8, students: '34K', ytId: 'JeznW_7DlB0' },
  { id: 27, title: 'Python Projects', author: 'Tech With Tim', cat: 'Python', lvl: 'Intermediate', price: 249, rating: 4.7, students: '27K', ytId: '8ext9G7xspg' },
  { id: 28, title: 'Automation with Python', author: 'FreeCodeCamp', cat: 'Python', lvl: 'Advanced', price: 299, rating: 4.6, students: '19K', ytId: 'PXMJ6FS7llk' },
  { id: 29, title: 'CI/CD Advanced Pipeline', author: 'DevOps Directive', cat: 'Extra', lvl: 'Advanced', price: 349, rating: 4.7, students: '8K', ytId: 'scEDHsr3APg' },
  { id: 30, title: 'Advanced Web Dev Project', author: 'Traversy Media', cat: 'Extra', lvl: 'Advanced', price: 399, rating: 4.8, students: '11K', ytId: 'Ke90Tje7VS0' },
];

export default function CourseView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const saved = localStorage.getItem('enrolledCourses');
    return saved ? JSON.parse(saved) : [];
  });

  // Find course by ID
  const course = ALL_COURSES.find(c => c.id === parseInt(courseId));
  const isEnrolled = course && enrolledCourses.includes(course.id);
  const canWatch = isAuthenticated && isEnrolled;

  useEffect(() => {
    if (!course) {
      navigate('/courses');
    }
  }, [course, navigate]);

  if (!course) {
    return null;
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', paddingTop: '20px', paddingBottom: '40px' }}>
      <div className="mx-auto px-6 py-6" style={{ maxWidth: '900px' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Main Container - Centered with proper spacing */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'var(--surface)',
            border: `1px solid var(--border)`,
          }}
        >
          {/* Video Player Container - 16:9 aspect ratio */}
          <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            {canWatch ? (
              <iframe
                src={`https://www.youtube.com/embed/${course.ytId}?autoplay=1&rel=0&modestbranding=1`}
                title={course.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
              >
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold text-white mb-2 text-center px-4">
                  {!isAuthenticated ? 'Sign in to view this course' : 'Enroll to watch this course'}
                </h3>
                <p className="text-gray-300 text-center mb-6 px-6 max-w-md">
                  {!isAuthenticated
                    ? 'Log in to access this course'
                    : 'Purchase this course to start learning'}
                </p>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login');
                    } else {
                      navigate('/courses');
                    }
                  }}
                  className="px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {!isAuthenticated ? 'Sign In' : 'Enroll Now'}
                </button>
              </div>
            )}
          </div>

          {/* Course Details Section */}
          <div className="p-8 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                {course.title}
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                By {course.author}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
              {/* Rating */}
              <div className="flex items-center gap-2">
                <Star className="fill-yellow-400" size={18} style={{ color: '#fbbf24' }} />
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {course.rating}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>({course.students} students)</span>
              </div>

              {/* Level */}
              <span
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--bg2)',
                  color: 'var(--text-secondary)',
                }}
              >
                {course.lvl}
              </span>

              {/* Category */}
              <span
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: 'var(--bg2)',
                  color: 'var(--accent-primary)',
                }}
              >
                {course.cat}
              </span>

              {/* Price */}
              <span className="text-xl font-bold ml-auto" style={{ color: 'var(--accent-primary)' }}>
                {course.price === 0 ? 'FREE' : `₹${course.price}`}
              </span>
            </div>

            {/* Enroll CTA - Only show if authenticated but not enrolled */}
            {isAuthenticated && !isEnrolled && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => navigate('/courses')}
                  className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Enrol Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

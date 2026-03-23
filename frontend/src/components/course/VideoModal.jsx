import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const VideoModal = ({ course, isOpen, onClose, onEnrollClick }) => {
  const { isAuthenticated } = useAuthStore();
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const saved = localStorage.getItem('enrolledCourses');
    return saved ? JSON.parse(saved) : [];
  });

  const isEnrolled = course && enrolledCourses.includes(course.id);
  const canWatch = isAuthenticated && isEnrolled;

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!course) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[500] flex items-center justify-center"
          onClick={handleBackdropClick}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: 'var(--surface)',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <h2
                className="text-xl font-bold pr-8"
                style={{ color: 'var(--text-primary)' }}
              >
                {course.title}
              </h2>
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg2)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg2)';
                }}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Video Area */}
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              {canWatch ? (
                // CASE 1: Authenticated & Enrolled - Show Video
                <iframe
                  src={`https://www.youtube.com/embed/${course.ytId}?autoplay=1&rel=0&modestbranding=1`}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <>
                  <img
                    src={`https://img.youtube.com/vi/${course.ytId}/maxresdefault.jpg`}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                  >
                    <Lock className="w-16 h-16 text-white mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {!isAuthenticated
                        ? 'Sign in to preview'
                        : 'Enroll to watch this course'}
                    </h3>
                    <p className="text-gray-300 text-center mb-6 px-6">
                      {!isAuthenticated
                        ? 'Log in to preview and enroll in this course'
                        : 'Purchase this course to start learning from the beginning'}
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        if (!isAuthenticated) {
                          window.location.href = '/login';
                        } else {
                          onEnrollClick();
                        }
                      }}
                      className="px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
                      style={{
                        backgroundColor: 'var(--accent-primary)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {!isAuthenticated ? 'Sign In to Preview' : 'Enrol Now'}
                    </button>
                  </motion.div>
                </>
              )}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 flex items-center justify-between border-t"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  By {course.author}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--bg2)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {course.cat}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--bg2)',
                    color: 'var(--accent-primary)',
                  }}
                >
                  {course.lvl}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Star
                    className="fill-yellow-400"
                    size={18}
                    style={{ color: '#fbbf24' }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {course.rating}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {isEnrolled ? (
                    <div
                      className="px-4 py-2 rounded-lg text-sm font-bold"
                      style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        color: '#22c55e',
                      }}
                    >
                      ✓ Enrolled
                    </div>
                  ) : (
                    <span
                      className="text-2xl font-bold"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      {course.price === 0 ? 'FREE' : `₹${course.price}`}
                    </span>
                  )}

                  {isAuthenticated && !isEnrolled && (
                  <button
                    onClick={onEnrollClick}
                    className="px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Enrol Now
                  </button>
                )}
              </div>
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, Star, Play, Lock, ShoppingCart } from 'lucide-react';
import { VideoModal } from '../components/course/VideoModal';
import EnrollmentModal from '../components/enrollment/EnrollmentModal';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useToast } from '../components/ui/Toast';

// All 30 Courses Data
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

const CATEGORIES = ['All', 'React/Next/TS', 'JavaScript', 'Cybersecurity', 'DevOps', 'Mobile Security', 'System Design', 'Backend', 'Database', 'Python', 'Extra'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = ['Default', 'Highest Rated', 'Price: Low to High', 'Price: High to Low'];

const Browse = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart, items: cartItems } = useCartStore();
  const { showToast, ToastContainer } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('Default');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    if (!isAuthenticated) return [];
    const saved = localStorage.getItem('enrolledCourses');
    return saved ? JSON.parse(saved) : [];
  });
  const visibleEnrolledCourses = isAuthenticated ? enrolledCourses : [];

  // Listen for localStorage changes to sync state across components
  useEffect(() => {
    if (!isAuthenticated) {
      setEnrolledCourses([]);
      return undefined;
    }

    const handleStorageChange = () => {
      const saved = localStorage.getItem('enrolledCourses');
      if (saved) {
        setEnrolledCourses(JSON.parse(saved));
      } else {
        setEnrolledCourses([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom enrollment events
    const handleEnrollmentUpdate = () => {
      const saved = localStorage.getItem('enrolledCourses');
      if (saved) {
        setEnrolledCourses(JSON.parse(saved));
      }
    };

    window.addEventListener('enrollmentUpdated', handleEnrollmentUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('enrollmentUpdated', handleEnrollmentUpdate);
    };
  }, [isAuthenticated]);

  // Filter & Sort Courses
  const filteredCourses = useMemo(() => {
    let filtered = [...ALL_COURSES];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((course) => course.cat === selectedCategory);
    }

    // Apply level filter
    if (selectedLevel !== 'All') {
      filtered = filtered.filter((course) => course.lvl === selectedLevel);
    }

    // Apply sorting
    if (sortBy === 'Highest Rated') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Price: Low to High') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedLevel, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSortBy('Default');
  };

  const handleAddToCart = (e, course) => {
    e.stopPropagation(); // Prevent card click event

    // Check if already in cart
    const alreadyInCart = cartItems.find(item => item.id === course.id);
    if (alreadyInCart) {
      showToast('Course already in cart!', 'info', 3000);
      return;
    }

    // Add course to cart with proper structure
    const courseWithDetails = {
      ...course,
      thumbnail: `https://img.youtube.com/vi/${course.ytId}/hqdefault.jpg`,
      instructor: {
        name: course.author,
        avatar: null,
      },
      discountPrice: null, // Can be set if there are discounts
      totalDuration: 12 * 3600, // Default 12 hours in seconds
    };

    addToCart(courseWithDetails);
    showToast(`${course.title} added to cart!`, 'success', 3000);
  };

  const handleBuyNow = (e, course) => {
    e.stopPropagation(); // Prevent card click event

    // Navigate directly to checkout with course ID
    navigate(`/checkout?courseId=${course.id}`);
  };

  const handleCourseClick = (course) => {
    if (visibleEnrolledCourses.includes(course.id)) {
      // Already enrolled, go directly to course
      navigate(`/learn/${course.id}`);
    } else {
      // Not enrolled, show enrollment modal
      setSelectedCourse(course);
      setModalOpen(true);
    }
  };

  const handleEnrollmentSuccess = (course) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Update state
    const updatedEnrolledCourses = [...visibleEnrolledCourses, course.id];
    setEnrolledCourses(updatedEnrolledCourses);
    localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolledCourses));

    // Trigger custom event for cross-component state sync
    window.dispatchEvent(new Event('enrollmentUpdated'));

    // Close modal
    setModalOpen(false);

    // Show success toast
    showToast(`Enrolled in ${course.title}!`, 'success', 3000);

    // Navigate to /courses after 1.5 seconds
    setTimeout(() => {
      navigate('/courses');
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Browse All Courses
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Explore our complete catalog of {ALL_COURSES.length} courses
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Filter Panel */}
          <aside
            className="lg:sticky lg:top-20 h-fit p-6 rounded-xl space-y-6"
            style={{
              backgroundColor: 'var(--surface)',
              border: `1px solid var(--border)`,
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                Filters
              </h2>
              {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All' || sortBy !== 'Default') && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Search
              </label>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'var(--text-tertiary)' }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-9 py-2 rounded-lg text-sm transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--bg2)',
                    border: `1px solid var(--border)`,
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-primary)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity hover:opacity-70"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg2)',
                  border: `1px solid var(--border)`,
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg2)',
                  border: `1px solid var(--border)`,
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                }}
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg2)',
                  border: `1px solid var(--border)`,
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200"
              style={{
                backgroundColor: 'var(--accent-primary)',
                boxShadow: 'var(--shadow-sm)',
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
              Clear Filters
            </button>
          </aside>

          {/* Course Grid */}
          <div>
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {filteredCourses.length}
                </span>{' '}
                {filteredCourses.length === 1 ? 'course' : 'courses'} found
              </p>
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  No courses found
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 px-6 py-2 rounded-lg font-semibold text-white"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="group rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: `1px solid var(--border)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="relative overflow-hidden cursor-pointer"
                    style={{ aspectRatio: '16/9' }}
                    onClick={() => handleCourseClick(course)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${course.ytId}/hqdefault.jpg`}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay with Play Button */}
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                      >
                        {visibleEnrolledCourses.includes(course.id) ? (
                          <Play className="fill-white" size={24} style={{ color: 'white' }} />
                        ) : (
                          <Lock className="fill-white" size={24} style={{ color: 'white' }} />
                        )}
                      </div>
                    </div>

                    {/* Level Badge */}
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                      }}
                    >
                      {course.lvl}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-lg line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                      {course.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {course.author}
                    </p>

                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="px-2 py-1 rounded-full font-semibold"
                        style={{
                          backgroundColor: 'var(--bg2)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {course.cat}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center gap-1">
                        <Star className="fill-yellow-400" size={16} style={{ color: '#fbbf24' }} />
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {course.rating}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          ({course.students})
                        </span>
                      </div>
                      {visibleEnrolledCourses.includes(course.id) ? (
                        <div
                          className="px-3 py-1.5 rounded-lg text-sm font-bold"
                          style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            color: '#22c55e',
                          }}
                        >
                          ✓ Enrolled
                        </div>
                      ) : (
                        <div className="text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>
                          {course.price === 0 ? 'FREE' : `₹${course.price}`}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 space-y-2">
                      {visibleEnrolledCourses.includes(course.id) ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/learn/${course.id}`);
                          }}
                          className="w-full px-4 py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
                          style={{ backgroundColor: '#22c55e' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#16a34a';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#22c55e';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          Go to Course →
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={(e) => handleBuyNow(e, course)}
                            className="w-full px-4 py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
                            style={{ backgroundColor: 'var(--accent-primary)' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            {course.price === 0 ? 'Enroll Free' : 'Buy Now'}
                          </button>
                          {course.price > 0 && (
                            <button
                              onClick={(e) => handleAddToCart(e, course)}
                              className="w-full px-4 py-2.5 rounded-lg font-semibold border transition-all duration-200 flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: 'transparent',
                                borderColor: 'var(--accent-primary)',
                                color: 'var(--accent-primary)',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--bg3)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <ShoppingCart size={18} />
                              Add to Cart
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {/* Show EnrollmentModal for non-enrolled courses, VideoModal for enrolled */}
      {selectedCourse && visibleEnrolledCourses.includes(selectedCourse.id) ? (
        <VideoModal
          course={selectedCourse}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onEnrollClick={() => {
            setModalOpen(false);
            navigate(`/learn/${selectedCourse.id}`);
          }}
        />
      ) : (
        <EnrollmentModal
          course={selectedCourse}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleEnrollmentSuccess}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Browse;

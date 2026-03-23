import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Lock,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Clock,
  Users,
  Award,
  Infinity
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';

// ALL_COURSES data (same as in other pages)
const ALL_COURSES = [
  { id: 1, title: 'React Full Course', author: 'Traversy Media', cat: 'React/Next/TS', lvl: 'Beginner', price: 199, rating: 4.8, students: '32K', ytId: 'bMknfKXIFA8', duration: '12 hours', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324331cd?w=500&h=300&fit=crop' },
  { id: 2, title: 'Next.js Full Course', author: 'Vercel Team', cat: 'React/Next/TS', lvl: 'Intermediate', price: 299, rating: 4.7, students: '18K', ytId: 'wm5gMKuwSYk', duration: '15 hours', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324331cd?w=500&h=300&fit=crop' },
  { id: 3, title: 'TypeScript Course', author: 'Matt Pocock', cat: 'React/Next/TS', lvl: 'Intermediate', price: 249, rating: 4.6, students: '14K', ytId: '30LWjhZzg50', duration: '10 hours', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324331cd?w=500&h=300&fit=crop' },
  { id: 4, title: 'JavaScript Full Course', author: 'FreeCodeCamp', cat: 'JavaScript', lvl: 'Beginner', price: 0, rating: 4.9, students: '95K', ytId: 'PkZNo7MFNFg', duration: '8 hours', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324331cd?w=500&h=300&fit=crop' },
  { id: 5, title: 'Advanced JavaScript', author: 'Akshay Saini', cat: 'JavaScript', lvl: 'Advanced', price: 349, rating: 4.9, students: '41K', ytId: 'KGkiIBTq0y0', duration: '20 hours', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324331cd?w=500&h=300&fit=crop' },
];

const Payment = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const { setSuccess, setError } = useUIStore();

  const courseId = searchParams.get('courseId');
  const course = courseId ? ALL_COURSES.find(c => c.id === parseInt(courseId)) : null;

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setPaymentError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Redirect if no course
  useEffect(() => {
    if (!course) {
      navigate('/courses');
    }
  }, [course, navigate]);

  if (!course) return null;

  const TAX_RATE = 0.18;
  const subtotal = course.price;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value)) {
      value = value.slice(0, 16);
      // Format with spaces every 4 digits
      value = value.replace(/(\d{4})/g, '$1 ').trim();
      setCardData({ ...cardData, cardNumber: value });
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      setCardData({ ...cardData, expiryDate: value });
    }
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCardData({ ...cardData, cvv: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');

    // Basic validation
    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length !== 16) {
      setPaymentError('Please enter a valid card number (16 digits)');
      return;
    }

    if (!cardData.cardName.trim()) {
      setPaymentError('Please enter cardholder name');
      return;
    }

    if (!cardData.expiryDate || cardData.expiryDate.length !== 5) {
      setPaymentError('Please enter valid expiry date (MM/YY)');
      return;
    }

    if (!cardData.cvv || cardData.cvv.length !== 3) {
      setPaymentError('Please enter valid CVV (3 digits)');
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add courseId to enrolledCourses in localStorage
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      if (!enrolledCourses.includes(course.id)) {
        enrolledCourses.push(course.id);
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
      }

      setPaymentSuccess(true);
      setSuccess('Payment successful! You are now enrolled.');

      // Redirect after showing success modal
      setTimeout(() => {
        navigate(`/learn/${course.id}`);
      }, 2000);
    } catch (err) {
      setPaymentError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 mb-6 transition-colors hover:opacity-70"
            style={{ color: 'var(--accent-primary)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>
          <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Complete Your Purchase
          </h1>
          <p style={{ color: 'var(--text-secondary)' }} className="mt-2">
            Secure payment with instant access to your course
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form - Left Column */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Holder Name */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardData.cardName}
                  onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                  placeholder="John Doe"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 border-2"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    disabled={loading}
                    maxLength="19"
                    className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 border-2 pr-10"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                  <CreditCard className="absolute right-3 top-3.5 h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardData.expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    disabled={loading}
                    maxLength="5"
                    className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 border-2"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    CVV
                  </label>
                  <input
                    type="password"
                    value={cardData.cvv}
                    onChange={handleCVVChange}
                    placeholder="123"
                    disabled={loading}
                    maxLength="3"
                    className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 border-2"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
                <Lock className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Your payment information is encrypted and secure. No card details are stored.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Pay {formatPrice(total)}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Course Summary - Right Column */}
          <div>
            <div className="sticky top-8" style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border)' }}>
              {/* Course Thumbnail */}
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-6"
              />

              {/* Course Title */}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {course.title}
              </h3>

              {/* Instructor */}
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                by {course.author}
              </p>

              {/* Course Benefits */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{course.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{course.students} students enrolled</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Certificate included</span>
                </div>
                <div className="flex items-center gap-3">
                  <Infinity className="h-5 w-5" style={{ color: 'var(--accent-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lifetime access</span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 border-t border-b py-4 mb-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span style={{ color: 'var(--text-primary)' }} className="font-semibold">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Tax (18%)</span>
                  <span style={{ color: 'var(--text-primary)' }} className="font-semibold">
                    {formatPrice(tax)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span style={{ color: 'var(--text-primary)' }} className="font-bold text-lg">
                  Total Amount
                </span>
                <span style={{ color: 'var(--accent-primary)' }} className="font-bold text-2xl">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Money Back Guarantee */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <p className="text-xs text-center text-green-600 font-semibold">
                  ✓ 30-Day Money-Back Guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 text-center max-w-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-6 flex justify-center"
              >
                <CheckCircle2 className="h-20 w-20 text-green-600" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h2>

              <p className="text-gray-600 mb-6">
                You are now enrolled in "{course.title}". Get ready to learn!
              </p>

              <p className="text-sm text-gray-500 mb-4">
                Redirecting to your course...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payment;

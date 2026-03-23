import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Shield,
  CheckCircle,
  ArrowLeft,
  Lock,
  Star,
  Clock,
  Award,
  Infinity
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

// Course data
const ALL_COURSES = [
  { id: 1, title: 'React Full Course', author: 'Traversy Media', cat: 'React/Next/TS', lvl: 'Beginner', price: 199, rating: 4.8, students: '32K', ytId: 'bMknfKXIFA8', duration: '12 hours' },
  { id: 2, title: 'Next.js Full Course', author: 'Vercel Team', cat: 'React/Next/TS', lvl: 'Intermediate', price: 299, rating: 4.7, students: '18K', ytId: 'wm5gMKuwSYk', duration: '15 hours' },
  { id: 3, title: 'TypeScript Course', author: 'Matt Pocock', cat: 'React/Next/TS', lvl: 'Intermediate', price: 249, rating: 4.6, students: '14K', ytId: '30LWjhZzg50', duration: '10 hours' },
  { id: 4, title: 'JavaScript Full Course', author: 'FreeCodeCamp', cat: 'JavaScript', lvl: 'Beginner', price: 0, rating: 4.9, students: '95K', ytId: 'PkZNo7MFNFg', duration: '8 hours' },
  { id: 5, title: 'Advanced JavaScript', author: 'Akshay Saini', cat: 'JavaScript', lvl: 'Advanced', price: 349, rating: 4.9, students: '41K', ytId: 'KGkiIBTq0y0', duration: '20 hours' },
  { id: 6, title: 'JS Crash Course', author: 'Traversy Media', cat: 'JavaScript', lvl: 'Beginner', price: 99, rating: 4.5, students: '28K', ytId: 'hdI2bqOjy3c', duration: '6 hours' },
  { id: 7, title: 'Ethical Hacking Full Course', author: 'TCM Security', cat: 'Cybersecurity', lvl: 'Beginner', price: 399, rating: 4.8, students: '22K', ytId: '3Kq1MIfTWCE', duration: '25 hours' },
  { id: 8, title: 'Web Security Fundamentals', author: 'TCM Security', cat: 'Cybersecurity', lvl: 'Intermediate', price: 299, rating: 4.6, students: '11K', ytId: '3Kq1MIfTWCE', duration: '18 hours' },
  { id: 9, title: 'Bug Bounty Guide', author: 'InsiderPhD', cat: 'Cybersecurity', lvl: 'Intermediate', price: 449, rating: 4.7, students: '8K', ytId: 'Pu3gk9K5cZ8', duration: '22 hours' },
  { id: 10, title: 'Practical Ethical Hacking', author: 'Heath Adams', cat: 'Cybersecurity', lvl: 'Advanced', price: 499, rating: 4.9, students: '19K', ytId: 'fNzpcB7ODxQ', duration: '30 hours' },
  { id: 11, title: 'HackTheBox Walkthrough', author: 'IppSec', cat: 'Cybersecurity', lvl: 'Advanced', price: 349, rating: 4.8, students: '7K', ytId: '2eLe7uz-7CM', duration: '16 hours' },
  { id: 12, title: 'Docker Full Course', author: 'TechWorld Nina', cat: 'DevOps', lvl: 'Beginner', price: 199, rating: 4.7, students: '33K', ytId: 'fqMOX6JJhGo', duration: '12 hours' },
  { id: 13, title: 'Kubernetes Full Course', author: 'TechWorld Nina', cat: 'DevOps', lvl: 'Intermediate', price: 349, rating: 4.8, students: '25K', ytId: 'X48VuDVv0do', duration: '20 hours' },
  { id: 14, title: 'Jenkins CI/CD', author: 'Simplilearn', cat: 'DevOps', lvl: 'Intermediate', price: 249, rating: 4.5, students: '12K', ytId: 'FX322RVNGj4', duration: '14 hours' },
  { id: 15, title: 'DevOps Roadmap', author: 'TechWorld', cat: 'DevOps', lvl: 'Beginner', price: 0, rating: 4.6, students: '44K', ytId: '9pZ2xmsSDdo', duration: '8 hours' },
  { id: 16, title: 'Linux for Beginners', author: 'DorianDotSlash', cat: 'DevOps', lvl: 'Beginner', price: 149, rating: 4.7, students: '38K', ytId: 'ivd3b6z2d4k', duration: '10 hours' },
  { id: 17, title: 'Mobile App Security Android', author: 'STÖK', cat: 'Mobile Security', lvl: 'Intermediate', price: 399, rating: 4.6, students: '6K', ytId: 'HhF0X9cXH6E', duration: '18 hours' },
  { id: 18, title: 'OWASP Top 10 AppSec', author: 'TCM Security', cat: 'Mobile Security', lvl: 'Advanced', price: 449, rating: 4.8, students: '9K', ytId: '3Kq1MIfTWCE', duration: '20 hours' },
  { id: 19, title: 'System Design Basics', author: 'Gaurav Sen', cat: 'System Design', lvl: 'Intermediate', price: 299, rating: 4.9, students: '52K', ytId: 'UzLMhqg3_Wc', duration: '16 hours' },
  { id: 20, title: 'Microservices Architecture', author: 'Tech Primers', cat: 'System Design', lvl: 'Advanced', price: 399, rating: 4.7, students: '16K', ytId: 'rv4LlmLmVWk', duration: '18 hours' },
  { id: 21, title: 'Node.js Full Course', author: 'FreeCodeCamp', cat: 'Backend', lvl: 'Beginner', price: 0, rating: 4.8, students: '67K', ytId: 'Oe421EPjeBE', duration: '12 hours' },
  { id: 22, title: 'SQL Full Course', author: 'FreeCodeCamp', cat: 'Database', lvl: 'Beginner', price: 0, rating: 4.9, students: '88K', ytId: 'HXV3zeQKqGY', duration: '8 hours' },
  { id: 23, title: 'PostgreSQL Complete', author: 'Amigoscode', cat: 'Database', lvl: 'Intermediate', price: 249, rating: 4.7, students: '21K', ytId: 'qw--VYLpxG4', duration: '14 hours' },
  { id: 24, title: 'MongoDB Full Course', author: 'FreeCodeCamp', cat: 'Database', lvl: 'Beginner', price: 149, rating: 4.6, students: '29K', ytId: 'ofme2o29ngU', duration: '10 hours' },
  { id: 25, title: 'Python Full Course', author: 'FreeCodeCamp', cat: 'Python', lvl: 'Beginner', price: 0, rating: 4.9, students: '112K', ytId: 'rfscVS0vtbw', duration: '10 hours' },
  { id: 26, title: 'Python OOP', author: 'Corey Schafer', cat: 'Python', lvl: 'Intermediate', price: 199, rating: 4.8, students: '34K', ytId: 'JeznW_7DlB0', duration: '12 hours' },
  { id: 27, title: 'Python Projects', author: 'Tech With Tim', cat: 'Python', lvl: 'Intermediate', price: 249, rating: 4.7, students: '27K', ytId: '8ext9G7xspg', duration: '15 hours' },
  { id: 28, title: 'Automation with Python', author: 'FreeCodeCamp', cat: 'Python', lvl: 'Advanced', price: 299, rating: 4.6, students: '19K', ytId: 'PXMJ6FS7llk', duration: '18 hours' },
  { id: 29, title: 'CI/CD Advanced Pipeline', author: 'DevOps Directive', cat: 'Extra', lvl: 'Advanced', price: 349, rating: 4.7, students: '8K', ytId: 'scEDHsr3APg', duration: '16 hours' },
  { id: 30, title: 'Advanced Web Dev Project', author: 'Traversy Media', cat: 'Extra', lvl: 'Advanced', price: 399, rating: 4.8, students: '11K', ytId: 'Ke90Tje7VS0', duration: '20 hours' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const courseId = searchParams.get('courseId');
  const course = courseId ? ALL_COURSES.find(c => c.id === parseInt(courseId)) : null;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Redirect if no course
  useEffect(() => {
    if (!course) {
      navigate('/courses');
    }
  }, [course, navigate]);

  if (!course) return null;

  // Pricing calculations
  const originalPrice = course.price;
  const discountPercent = appliedCoupon?.percent || 0;
  const discountAmount = (originalPrice * discountPercent) / 100;
  const subtotal = originalPrice - discountAmount;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleApplyCoupon = () => {
    setCouponError('');
    if (couponCode === 'LEARN50') {
      setAppliedCoupon({ code: 'LEARN50', percent: 50 });
    } else if (couponCode === 'LEARN20') {
      setAppliedCoupon({ code: 'LEARN20', percent: 20 });
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Enroll user
      const enrolled = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      enrolled.push(course.id);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));

      // Award XP
      const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
      userStats.totalXp = (userStats.totalXp || 0) + 10;
      localStorage.setItem('userStats', JSON.stringify(userStats));

      setSuccess(true);
    } catch (err) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI Payment', icon: Smartphone },
    { id: 'netbanking', name: 'Net Banking', icon: Building2 },
    { id: 'wallet', name: 'Wallets', icon: Wallet },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <header
        className="border-b"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 transition-opacity hover:opacity-70"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Checkout
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Lock className="h-4 w-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {success ? (
        // Success State
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            🎉 Enrolled Successfully!
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            You can now start learning {course.title}
          </p>
          <button
            onClick={() => navigate(`/course/${course.id}`)}
            className="px-8 py-3 rounded-lg font-semibold text-white transition-all"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Start Learning
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* LEFT COLUMN - Course Info (Spans 2 columns) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 rounded-xl p-6 h-fit"
              style={{
                backgroundColor: 'var(--surface)',
                border: `1px solid var(--border)`,
              }}
            >
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Course Details
              </h2>

              {/* Thumbnail */}
              <img
                src={`https://img.youtube.com/vi/${course.ytId}/maxresdefault.jpg`}
                alt={course.title}
                className="w-full aspect-video object-cover rounded-lg mb-4"
              />

              {/* Title & Instructor */}
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {course.title}
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                By {course.author}
              </p>

              {/* Rating & Level */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400" style={{ color: '#fbbf24' }} />
                  <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {course.rating}
                  </span>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: 'var(--bg2)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {course.lvl}
                </span>
              </div>

              {/* Includes */}
              <div
                className="border-t pt-4 space-y-3"
                style={{ borderColor: 'var(--border)' }}
              >
                <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  This course includes:
                </h4>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Clock className="w-4 h-4" />
                  <span>{course.duration || '12 hours'} on-demand video</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Award className="w-4 h-4" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Infinity className="w-4 h-4" />
                  <span>Lifetime access</span>
                </div>
              </div>

              {/* Price */}
              <div
                className="border-t mt-4 pt-4"
                style={{ borderColor: 'var(--border)' }}
              >
                {originalPrice === 0 ? (
                  <span className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                    FREE
                  </span>
                ) : (
                  <div className="flex items-center gap-3">
                    {discountAmount > 0 && (
                      <span className="text-lg line-through" style={{ color: 'var(--text-tertiary)' }}>
                        ₹{originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                      ₹{Math.round(subtotal)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* RIGHT COLUMN - Checkout Actions (Spans 3 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3 space-y-6"
            >
              {/* Coupon Section */}
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: `1px solid var(--border)`,
                }}
              >
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Apply Coupon
                </h3>

                {!appliedCoupon ? (
                  <>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--bg)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 rounded-lg font-semibold text-white"
                        style={{ backgroundColor: 'var(--accent-primary)' }}
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm" style={{ color: 'var(--error)' }}>
                        {couponError}
                      </p>
                    )}
                    <div className="space-y-2 mt-4">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        Available coupons:
                      </p>
                      <button
                        onClick={() => {
                          setCouponCode('LEARN50');
                          setCouponError('');
                        }}
                        className="block w-full text-left px-3 py-2 rounded border text-sm"
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span className="font-semibold">LEARN50</span> - 50% off
                      </button>
                      <button
                        onClick={() => {
                          setCouponCode('LEARN20');
                          setCouponError('');
                        }}
                        className="block w-full text-left px-3 py-2 rounded border text-sm"
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <span className="font-semibold">LEARN20</span> - 20% off
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    className="p-3 rounded-lg flex items-center justify-between"
                    style={{
                      backgroundColor: 'var(--bg2)',
                      border: `1px solid var(--accent-primary)`,
                    }}
                  >
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                        {appliedCoupon.code} applied!
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {appliedCoupon.percent}% discount
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm px-3 py-1 rounded"
                      style={{
                        color: 'var(--error)',
                        border: `1px solid var(--error)`,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: `1px solid var(--border)`,
                }}
              >
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                    <span style={{ color: 'var(--text-primary)' }}>₹{originalPrice}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-secondary)' }}>Discount</span>
                      <span style={{ color: 'var(--accent-primary)' }}>-₹{Math.round(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>GST (18%)</span>
                    <span style={{ color: 'var(--text-primary)' }}>₹{Math.round(gst)}</span>
                  </div>
                  <div
                    className="border-t pt-3 flex justify-between font-bold text-lg"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>Total</span>
                    <span style={{ color: 'var(--accent-primary)' }}>₹{Math.round(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full mt-6 px-6 py-3 rounded-lg font-semibold text-white transition-all"
                  style={{
                    backgroundColor: loading ? 'var(--bg3)' : 'var(--accent-primary)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {loading ? 'Processing...' : 'Complete Purchase'}
                </button>
              </div>

              {/* Security Badge */}
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'var(--bg2)',
                }}
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  <div>
                    <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      30-Day Money-Back Guarantee
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Full refund if you're not satisfied
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Methods Section */}
              <div
                className="rounded-xl p-6"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: `1px solid var(--border)`,
                }}
              >
              <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Payment Method
              </h3>

              {/* Payment Method Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className="flex-1 min-w-[80px] px-3 py-2 rounded-lg flex flex-col items-center gap-1 transition-all"
                      style={{
                        backgroundColor: paymentMethod === method.id ? 'var(--accent-primary)' : 'var(--bg2)',
                        color: paymentMethod === method.id ? '#fff' : 'var(--text-primary)',
                        border: `1px solid ${paymentMethod === method.id ? 'var(--accent-primary)' : 'var(--border)'}`,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{method.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Forms */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--bg)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        Expiry
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--bg)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--bg)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name || ''}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--bg)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--bg)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                      Select Bank
                    </label>
                    <select
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--bg)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="space-y-3">
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Choose your preferred wallet:
                  </p>
                  {['Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay'].map((wallet) => (
                    <button
                      key={wallet}
                      className="w-full px-4 py-3 rounded-lg border text-left transition-all hover:opacity-80"
                      style={{
                        backgroundColor: 'var(--bg2)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {wallet}
                    </button>
                  ))}
                </div>
              )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <div
            className="rounded-xl p-8 text-center"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: 'var(--accent-primary)' }}
            ></div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Processing Payment...
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Please don't close this window
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Checkout;

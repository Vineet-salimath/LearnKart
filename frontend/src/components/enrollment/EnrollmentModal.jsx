import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle, Lock, Shield, Download, Smartphone, Monitor, RefreshCcw } from 'lucide-react';

const EnrollmentModal = ({ course, isOpen, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  if (!course) return null;

  const handleEnroll = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Award XP for enrollment (this should happen in modal)
      const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
      userStats.totalXp = (userStats.totalXp || 0) + 10;
      localStorage.setItem('userStats', JSON.stringify(userStats));

      // Let parent component handle enrollment, state updates, toast, and navigation
      onSuccess?.(course);
    } catch (err) {
      alert('Enrollment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19);
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2);
    }
    return cleaned;
  };

  const paymentTabs = [
    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { id: 'upi', label: 'UPI', icon: '📱' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  ];

  const perks = [
    { icon: CheckCircle, text: 'Full Lifetime access' },
    { icon: Download, text: 'Downloadable resources' },
    { icon: Smartphone, text: 'Access on mobile and TV' },
    { icon: Monitor, text: 'Access on desktop' },
    { icon: Shield, text: 'Certificate of completion' },
    { icon: RefreshCcw, text: '30-day money-back guarantee' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-2xl"
            style={{
              backgroundColor: 'var(--surface)',
              border: `1px solid var(--border)`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Checkout
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors hover:bg-opacity-80"
                style={{ backgroundColor: 'var(--bg2)', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Course Info Section */}
              <div className="flex gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg2)' }}>
                <img
                  src={`https://img.youtube.com/vi/${course.ytId}/hqdefault.jpg`}
                  alt={course.title}
                  className="w-20 h-12 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                    {course.title}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                    By {course.author}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star size={14} fill="#fbbf24" style={{ color: '#fbbf24' }} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {course.rating}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      ({course.students} students)
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="text-center py-4">
                {course.price === 0 ? (
                  <div className="text-4xl font-black" style={{ color: 'var(--accent-primary)' }}>
                    FREE
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl font-black mb-2" style={{ color: 'var(--accent-primary)' }}>
                      ₹{course.price}
                    </div>
                    {course.originalPrice && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg line-through" style={{ color: 'var(--text-tertiary)' }}>
                          ₹{course.originalPrice}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                          {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Methods - Only show if not free */}
              {course.price > 0 && (
                <>
                  <div>
                    <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Payment Method
                    </h4>

                    {/* Payment Tabs */}
                    <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                      {paymentTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setPaymentMethod(tab.id)}
                          className="flex-1 px-4 py-3 text-sm font-semibold transition-all"
                          style={{
                            backgroundColor: paymentMethod === tab.id ? 'var(--accent-primary)' : 'var(--bg2)',
                            color: paymentMethod === tab.id ? '#fff' : 'var(--text-secondary)',
                            borderRight: tab.id !== 'netbanking' ? `1px solid var(--border)` : 'none',
                          }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <span>{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Payment Forms */}
                    <div className="mt-6">
                      {paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                              Card Number
                            </label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              maxLength={19}
                              className="w-full px-4 py-3 rounded-lg border text-lg font-mono transition-colors focus:outline-none focus:ring-2"
                              style={{
                                backgroundColor: 'var(--bg)',
                                borderColor: 'var(--border)',
                                color: 'var(--text-primary)',
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                MM/YY
                              </label>
                              <input
                                type="text"
                                placeholder="12/25"
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                maxLength={5}
                                className="w-full px-4 py-3 rounded-lg border font-mono transition-colors focus:outline-none focus:ring-2"
                                style={{
                                  backgroundColor: 'var(--bg)',
                                  borderColor: 'var(--border)',
                                  color: 'var(--text-primary)',
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                CVV
                              </label>
                              <input
                                type="password"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substr(0, 4))}
                                maxLength={4}
                                className="w-full px-4 py-3 rounded-lg border font-mono transition-colors focus:outline-none focus:ring-2"
                                style={{
                                  backgroundColor: 'var(--bg)',
                                  borderColor: 'var(--border)',
                                  color: 'var(--text-primary)',
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                              Name on Card
                            </label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
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
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                            UPI ID
                          </label>
                          <input
                            type="text"
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                            style={{
                              backgroundColor: 'var(--bg)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-primary)',
                            }}
                          />
                        </div>
                      )}

                      {paymentMethod === 'netbanking' && (
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Select Your Bank
                          </label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                            style={{
                              backgroundColor: 'var(--bg)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-primary)',
                            }}
                          >
                            <option value="">Choose your bank</option>
                            <option value="sbi">State Bank of India</option>
                            <option value="hdfc">HDFC Bank</option>
                            <option value="icici">ICICI Bank</option>
                            <option value="axis">Axis Bank</option>
                            <option value="kotak">Kotak Mahindra Bank</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* What You'll Get Section */}
              <div>
                <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  What you'll get
                </h4>
                <div className="space-y-3">
                  {perks.map((perk, index) => {
                    const Icon = perk.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <Icon size={18} style={{ color: 'var(--success)' }} />
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {perk.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-70"
                style={{
                  backgroundColor: loading ? 'var(--bg3)' : 'var(--accent-primary)',
                  boxShadow: loading ? 'none' : '0 4px 14px 0 rgba(139, 110, 245, 0.4)',
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : course.price === 0 ? (
                  'Enroll for Free'
                ) : (
                  `Pay ₹${course.price} — Enroll Now`
                )}
              </button>

              {/* Security Notice */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  <Lock size={16} />
                  <span>Secured by SSL encryption</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnrollmentModal;
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Modal,
  ModalBody,
} from '../ui/Modal';
import {
  Star,
  Clock,
  Users,
  Globe,
  PlayCircle,
  CheckCircle,
  Smartphone,
  Download,
  Award, // Used for certificate
  Infinity,
  CreditCard,
  Shield,
  Loader,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../../utils/helpers';

// Checkout states
const CHECKOUT_STATES = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const CheckoutModal = ({
  isOpen,
  onClose,
  course,
  onPurchase,
  loading = false,
  error = null,
  onEnroll = null,
}) => {
  const [checkoutState, setCheckoutState] = useState(CHECKOUT_STATES.IDLE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Demo coupons
  const DEMO_COUPONS = {
    'LEARN50': 0.50,
    'SAVE20': 0.20,
  };

  const basePrice = course?.discountPrice || course?.price || 0;
  const subtotal = basePrice;
  const discount = appliedCoupon ? basePrice * DEMO_COUPONS[appliedCoupon] : 0;
  const afterDiscount = subtotal - discount;
  const gst = Math.round(afterDiscount * 0.18 * 100) / 100;
  const total = Math.round((afterDiscount + gst) * 100) / 100;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      return;
    }

    const code = couponCode.toUpperCase();
    if (DEMO_COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponCode('');
    } else {
      setAppliedCoupon(null);
      setCouponCode('');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Prevent duplicate clicks with debouncing
  const handlePurchase = async () => {
    if (isProcessing || checkoutState === CHECKOUT_STATES.PROCESSING) return;

    setIsProcessing(true);
    setCheckoutState(CHECKOUT_STATES.PROCESSING);

    try {
      await onPurchase(course);
      setCheckoutState(CHECKOUT_STATES.SUCCESS);

      // Call onEnroll callback if provided
      if (onEnroll) {
        onEnroll(course.id);
      }

      // Auto-close modal after success animation
      setTimeout(() => {
        onClose();
        setCheckoutState(CHECKOUT_STATES.IDLE);
        setIsProcessing(false);
        setAppliedCoupon(null);
        setCouponCode('');
        setPaymentMethod('card');
      }, 2000);
    } catch (err) {
      setCheckoutState(CHECKOUT_STATES.ERROR);
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const courseIncludes = [
    { icon: PlayCircle, label: `${course?.totalLessons || 25} video lessons` },
    { icon: Clock, label: `${course?.totalDuration || 12} hours of content` },
    { icon: Download, label: 'Downloadable resources' },
    { icon: Award, label: 'Certificate of completion' },
    { icon: Smartphone, label: 'Access on mobile and TV' },
    { icon: Infinity, label: 'Lifetime access' },
  ];

  const whatYoullLearn = [
    'Build modern, responsive web applications',
    'Master advanced React patterns and hooks',
    'Create stunning UI with Tailwind CSS',
    'Implement secure authentication systems',
    'Deploy applications to production',
    'Best practices for code organization',
  ];

  // Success animation variant
  const successVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="checkout"
      className="mx-4"
    >
      <ModalBody className="p-0">
        {/* Success Overlay */}
        {checkoutState === CHECKOUT_STATES.SUCCESS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                variants={successVariants}
                initial="initial"
                animate="animate"
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-success to-primary"
              >
                <CheckCircle className="h-10 w-10 text-white" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-2 text-2xl font-heading font-bold text-text"
              >
                Enrollment Successful!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-text-secondary"
              >
                Welcome to {course?.title}. Start learning now!
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Processing Overlay */}
        {checkoutState === CHECKOUT_STATES.PROCESSING && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12">
                <Loader className="h-12 w-12 animate-spin text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-heading font-semibold text-text">
                Processing Payment...
              </h3>
              <p className="text-text-secondary">
                Please don't close this window
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[600px]">
          {/* Left Section - Course Preview */}
          <div className="lg:col-span-2 p-8 pr-6">
            {/* Course Header */}
            <div className="mb-8">
              <div className="aspect-video mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
                {course?.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-primary" />
                  </div>
                )}
              </div>

              <h2 className="mb-4 text-2xl font-heading font-bold text-text">
                {course?.title || 'Complete Web Development Course'}
              </h2>

              <div className="mb-6 flex items-center gap-6 text-sm text-text-secondary">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span>(2,543 reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>15,230 students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>English</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={course?.instructor?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face'}
                  alt={course?.instructor?.name || 'Instructor'}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-text">
                    {course?.instructor?.name || 'John Smith'}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Senior Developer at Google
                  </p>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-heading font-semibold text-text">
                What you'll learn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {whatYoullLearn.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="h-5 w-5 mt-0.5 text-success flex-shrink-0" />
                    <span className="text-sm text-text">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Error State */}
            {checkoutState === CHECKOUT_STATES.ERROR && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl bg-error/5 border border-error/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-error flex-shrink-0" />
                  <div>
                    <p className="font-medium text-error">Payment Failed</p>
                    <p className="text-sm text-error/80">
                      {error || 'Something went wrong. Please try again.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Section - Purchase Card */}
          <div className="bg-background-secondary border-l border-border">
            <div className="sticky top-0 p-8">
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                {/* Price Section */}
                <div className="mb-8 text-center border-b border-border pb-6">
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between text-sm text-text-secondary">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Discount ({appliedCoupon})</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-text-secondary">
                      <span>GST (18%)</span>
                      <span>{formatPrice(gst)}</span>
                    </div>
                  </div>
                  <div className="mb-4 pt-4 flex justify-between border-t border-border">
                    <span className="font-semibold text-text">Total</span>
                    <span className="text-2xl font-heading font-bold text-accent-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="mb-6 p-4 rounded-lg bg-background-secondary border border-border">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="text-sm font-medium text-success">
                          Coupon {appliedCoupon} applied!
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-text-secondary hover:text-text"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text">
                        Have a coupon code?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 px-3 py-2 rounded-lg text-sm border border-border bg-background-tertiary text-text placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition"
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-xs text-text-tertiary">
                        Try: LEARN50 (50% off) or SAVE20 (20% off)
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Method Section */}
                <div className="mb-6 p-4 rounded-lg bg-background-secondary border border-border">
                  <label className="block text-sm font-medium text-text mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'card', icon: CreditCard, label: 'Credit / Debit Card' },
                      { id: 'upi', icon: Smartphone, label: 'UPI' },
                      { id: 'netbanking', icon: Globe, label: 'Net Banking' },
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <label
                          key={method.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-background-tertiary cursor-pointer transition"
                          style={{
                            backgroundColor:
                              paymentMethod === method.id
                                ? 'var(--accent-primary)'
                                : 'transparent',
                          }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4"
                          />
                          <Icon className="h-4 w-4 text-text-secondary" />
                          <span className="text-sm text-text">{method.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={handlePurchase}
                  disabled={isProcessing || checkoutState === CHECKOUT_STATES.PROCESSING}
                  className={cn(
                    "w-full rounded-xl px-6 py-4 font-semibold text-white transition-all duration-200 mb-4",
                    "bg-gradient-to-r from-primary to-secondary hover:scale-105 hover:shadow-primary",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  )}
                >
                  {checkoutState === CHECKOUT_STATES.PROCESSING ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="h-5 w-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Complete Purchase · {formatPrice(total)}
                    </span>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-center gap-2 text-text-tertiary">
                    <Shield className="h-4 w-4 text-success" />
                    <span>🔒 Secure Checkout</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-text-tertiary">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>✓ 30-day money-back guarantee</span>
                  </div>
                </div>

                {/* Course Includes */}
                <div className="mt-8">
                  <h4 className="mb-4 font-heading font-semibold text-text">
                    This course includes:
                  </h4>
                  <div className="space-y-3">
                    {courseIncludes.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <Icon className="h-4 w-4 text-text-secondary flex-shrink-0" />
                          <span className="text-text-secondary">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block mb-6"
        >
          <CheckCircle className="w-20 h-20 text-green-600" />
        </motion.div>

        <h1 className="font-heading text-4xl font-bold text-text mb-4">
          Thank You!
        </h1>

        <p className="text-lg text-muted mb-8">
          Your order has been successfully confirmed. You now have access to all enrolled courses.
        </p>

        <div className="card p-6 mb-8 text-left">
          <h3 className="font-heading font-bold mb-4">Order Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Order Number</span>
              <span className="font-semibold">ORD-2024-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Amount</span>
              <span className="font-semibold">₹4,999</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Status</span>
              <span className="font-semibold text-green-600">✓ Completed</span>
            </div>
          </div>
        </div>

        <p className="text-muted mb-8">
          A confirmation email has been sent to your registered email address.
        </p>

        <Link
          to="/"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <span>Start Learning</span>
          <ArrowRight size={20} />
        </Link>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;

import { useUIStore } from '../../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ id, message, type }) => {
  const removeNotification = useUIStore(state => state.removeNotification);

  const bgColor = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    info: 'bg-blue-50'
  }[type] || 'bg-blue-50';

  const borderColor = {
    success: 'border-green-200',
    error: 'border-red-200',
    info: 'border-blue-200'
  }[type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800'
  }[type];

  const Icon = {
    success: <CheckCircle className="text-green-600" size={20} />,
    error: <AlertCircle className="text-red-600" size={20} />,
    info: <Info className="text-white" size={20} />
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${bgColor} border ${borderColor} rounded-lg p-4 shadow-lg mb-3 flex items-start space-x-3`}
    >
      <div className="flex-shrink-0">{Icon}</div>
      <div className={`flex-1 ${textColor} text-sm`}>{message}</div>
      <button
        onClick={() => removeNotification(id)}
        className="flex-shrink-0 text-muted hover:text-text transition"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const notifications = useUIStore(state => state.notifications);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <AnimatePresence>
        {notifications.map(notification => (
          <Toast
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

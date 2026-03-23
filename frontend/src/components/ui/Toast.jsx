import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 3000,
  position = 'top-right'
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: {
      bg: 'rgba(34, 197, 94, 0.1)',
      border: '#22c55e',
      icon: '#22c55e',
      text: '#22c55e'
    },
    error: {
      bg: 'rgba(239, 68, 68, 0.1)',
      border: '#ef4444',
      icon: '#ef4444',
      text: '#ef4444'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.1)',
      border: '#f59e0b',
      icon: '#f59e0b',
      text: '#f59e0b'
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.1)',
      border: '#3b82f6',
      icon: '#3b82f6',
      text: '#3b82f6'
    }
  };

  const positionClasses = {
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
    'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
  };

  const Icon = icons[type];
  const colorScheme = colors[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            zIndex: 9999,
            ...positionClasses[position],
            backgroundColor: colorScheme.bg,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${colorScheme.border}`,
            borderRadius: '12px',
            padding: '16px',
            minWidth: '320px',
            maxWidth: '480px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="flex items-start gap-3">
            <Icon
              size={20}
              style={{
                color: colorScheme.icon,
                flexShrink: 0,
                marginTop: '2px'
              }}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
              >
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress bar for duration */}
          {duration > 0 && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                backgroundColor: colorScheme.border,
                borderRadius: '0 0 12px 12px'
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook to manage toast notifications
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts(prev => [...prev, newToast]);

    return id;
  };

  const hideToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => hideToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );

  return {
    showToast,
    hideToast,
    ToastContainer
  };
};

export default Toast;
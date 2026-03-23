import { forwardRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

const Modal = ({ isOpen, onClose, children, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
    checkout: 'max-w-6xl', // Special size for checkout modal
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
              />
            </Dialog.Overlay>

            {/* Modal Content */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{
                  duration: 0.2,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 transform",
                  sizeClasses[size],
                  className
                )}
              >
                <div className="relative max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl">
                  {/* Close Button */}
                  <Dialog.Close asChild>
                    <button
                      onClick={onClose}
                      className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-gray-500 transition-colors hover:bg-black/10 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Close modal"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>

                  {/* Modal Body */}
                  <div className="max-h-[90vh] overflow-y-auto">
                    {children}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

// Modal Header Component
const ModalHeader = ({ children, className }) => (
  <div className={cn("px-8 py-6 border-b border-gray-100", className)}>
    {children}
  </div>
);

// Modal Body Component
const ModalBody = ({ children, className }) => (
  <div className={cn("px-8 py-6", className)}>
    {children}
  </div>
);

// Modal Footer Component
const ModalFooter = ({ children, className }) => (
  <div className={cn("px-8 py-6 border-t border-gray-100 bg-gray-50/50", className)}>
    {children}
  </div>
);

// Modal Title Component
const ModalTitle = forwardRef(({ children, className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("text-2xl font-heading font-bold text-text", className)}
    {...props}
  >
    {children}
  </Dialog.Title>
));
ModalTitle.displayName = 'ModalTitle';

// Modal Description Component
const ModalDescription = forwardRef(({ children, className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn("mt-2 text-text-secondary", className)}
    {...props}
  >
    {children}
  </Dialog.Description>
));
ModalDescription.displayName = 'ModalDescription';

export {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface SuccessToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error' | 'info';
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  message,
  isVisible,
  onClose,
  duration = 5000,
  type = 'success',
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className='w-5 h-5 text-green-400' />;
      case 'error':
        return <AlertCircle className='w-5 h-5 text-red-400' />;
      case 'info':
        return <Info className='w-5 h-5 text-blue-400' />;
      default:
        return <CheckCircle className='w-5 h-5 text-green-400' />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/40 text-green-400';
      case 'error':
        return 'bg-red-500/10 border-red-500/40 text-red-400';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/40 text-blue-400';
      default:
        return 'bg-green-500/10 border-green-500/40 text-green-400';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className='fixed top-4 right-4 z-50 max-w-sm'
        >
          <div className={`p-4 rounded-lg border shadow-lg ${getStyles()}`}>
            <div className='flex items-start'>
              {getIcon()}
              <div className='ml-3 flex-1'>
                <p className='text-sm font-medium'>{message}</p>
              </div>
              <button onClick={onClose} className='ml-auto pl-3 flex-shrink-0'>
                <X className='w-4 h-4 hover:opacity-70 transition-opacity' />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast container component
export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  return (
    <div className='fixed top-4 right-4 z-50 space-y-2'>
      {toasts.map(toast => (
        <SuccessToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default SuccessToast;

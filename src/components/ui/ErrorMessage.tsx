import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onClose,
  className = '',
  variant = 'default',
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`bg-red-500/10 border border-red-500/40 text-red-400 rounded-lg ${
          variant === 'default' ? 'p-4' : 'p-3'
        } ${className}`}
      >
        <div className='flex items-start'>
          <AlertCircle
            className={`flex-shrink-0 ${variant === 'default' ? 'w-5 h-5' : 'w-4 h-4'} mt-0.5`}
          />
          <div className='ml-3 flex-1'>
            <p
              className={`${variant === 'default' ? 'text-sm' : 'text-xs'} leading-5`}
            >
              {message}
            </p>
          </div>
          {onClose && (
            <button onClick={onClose} className='ml-auto pl-3 flex-shrink-0'>
              <X
                className={`${variant === 'default' ? 'w-5 h-5' : 'w-4 h-4'} text-red-400 hover:text-red-300 transition-colors`}
              />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({
  message,
  className = '',
}) => {
  if (!message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`text-red-400 text-xs mt-1 ${className}`}
    >
      {message}
    </motion.p>
  );
};

export default ErrorMessage;

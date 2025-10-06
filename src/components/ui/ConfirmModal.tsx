import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: 'orange' | 'red' | 'blue';
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonColor = 'orange',
}: ConfirmModalProps) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getConfirmButtonClasses = () => {
    switch (confirmButtonColor) {
      case 'red':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'orange':
      default:
        return 'bg-orange-500 hover:bg-orange-600 text-black';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center'
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute inset-0 bg-black/60 backdrop-blur-sm'
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className='relative bg-neutral-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl'
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className='absolute top-4 right-4 text-white/60 hover:text-white transition-colors'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>

            {/* Content */}
            <div className='pr-8'>
              <h3 className='text-xl font-semibold text-white mb-3 font-mondwest'>
                {title}
              </h3>
              <p className='text-white/70 mb-6 leading-relaxed'>{message}</p>

              {/* Actions */}
              <div className='flex gap-3 justify-end'>
                <button
                  onClick={onClose}
                  className='px-4 py-2 bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors rounded'
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-4 py-2 font-semibold transition-colors rounded ${getConfirmButtonClasses()}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;

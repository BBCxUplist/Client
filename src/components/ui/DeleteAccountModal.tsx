import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteAccountModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteAccountModalProps) => {
  const [confirmText, setConfirmText] = useState('');
  const canDelete = confirmText.toLowerCase() === 'delete';

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className='bg-neutral-900 border border-red-500/30 rounded-lg p-6 max-w-md w-full'
          >
            <div className='flex items-start gap-4 mb-6'>
              <div className='w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0'>
                <svg
                  className='w-6 h-6 text-red-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
              <div className='flex-1'>
                <h3 className='text-xl font-bold text-white mb-2 font-mondwest'>
                  Delete Account
                </h3>
                <p className='text-white/70 text-sm'>
                  This action cannot be undone. This will permanently delete
                  your account and remove all of your data from our servers.
                </p>
              </div>
            </div>

            <div className='space-y-4 mb-6'>
              <div className='bg-red-500/10 border border-red-500/30 rounded p-4'>
                <p className='text-red-400 text-sm mb-2 font-semibold'>
                  Warning: This will delete:
                </p>
                <ul className='text-red-400/80 text-xs space-y-1 list-disc list-inside'>
                  <li>Your profile and all personal information</li>
                  <li>All your bookings and booking history</li>
                  <li>Your saved artists and preferences</li>
                  <li>Any pending or active transactions</li>
                </ul>
              </div>

              <div>
                <label className='block text-white/70 text-sm mb-2'>
                  Type <span className='font-bold text-white'>DELETE</span> to
                  confirm:
                </label>
                <input
                  type='text'
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  className='w-full bg-white/5 border border-white/20 text-white p-3 focus:outline-none focus:border-red-500/50'
                  placeholder='Type DELETE'
                  disabled={isDeleting}
                  autoComplete='off'
                />
              </div>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className='flex-1 bg-white/10 border border-white/30 text-white px-4 py-3 font-semibold hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canDelete || isDeleting}
                className='flex-1 bg-red-500 text-white px-4 py-3 font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isDeleting ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    Deleting...
                  </span>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountModal;

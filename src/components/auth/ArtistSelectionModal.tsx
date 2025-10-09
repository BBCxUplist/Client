import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArtistSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (isArtist: boolean) => void;
  useremail: string;
  userName: string;
}

const ArtistSelectionModal = ({
  isOpen,
  onClose,
  onSelect,
  useremail,
  userName,
}: ArtistSelectionModalProps) => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'artist' | null>(
    null
  );

  const handleSubmit = () => {
    if (selectedRole) {
      onSelect(selectedRole === 'artist');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className='bg-white text-black rounded-lg p-6 max-w-md w-full mx-4'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className='text-center mb-6'>
              <h2 className='text-2xl font-bold mb-2'>Welcome to UPLIST!</h2>
              <p className='text-gray-600'>
                Hi {userName || useremail}, please select your account type:
              </p>
            </div>

            <div className='space-y-4 mb-6'>
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRole === 'user'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRole('user')}
              >
                <div className='flex items-center space-x-3'>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedRole === 'user'
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedRole === 'user' && (
                      <div className='w-full h-full rounded-full bg-white scale-50'></div>
                    )}
                  </div>
                  <div>
                    <h3 className='font-semibold'>Regular User</h3>
                    <p className='text-sm text-gray-600'>
                      Discover artists, book shows, and explore music
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedRole === 'artist'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedRole('artist')}
              >
                <div className='flex items-center space-x-3'>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedRole === 'artist'
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedRole === 'artist' && (
                      <div className='w-full h-full rounded-full bg-white scale-50'></div>
                    )}
                  </div>
                  <div>
                    <h3 className='font-semibold'>Artist</h3>
                    <p className='text-sm text-gray-600'>
                      Create your profile, manage bookings, and showcase your
                      music
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex space-x-3'>
              <button
                onClick={onClose}
                className='flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedRole}
                className='flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
              >
                Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArtistSelectionModal;

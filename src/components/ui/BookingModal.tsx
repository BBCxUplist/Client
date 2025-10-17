import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/helper';
import { useStartConversation } from '@/hooks/useChat';
import { useStore } from '@/stores/store';
import toast from 'react-hot-toast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    eventType: string;
    clientName: string;
    clientEmail: string;
    clientId?: string; // User ID of the client
    date: string;
    location: string;
    amount: number;
    status: string;
    duration?: string;
    guests?: string;
    message?: string;
    contactPhone?: string;
  };
}

const BookingModal = ({ isOpen, onClose, booking }: BookingModalProps) => {
  const navigate = useNavigate();
  const { user } = useStore();
  const startConversationMutation = useStartConversation();

  const handleChatWithClient = async () => {
    if (!booking.clientId) {
      toast.error('Client information not available');
      return;
    }

    if (!user) {
      toast.error('Please log in to chat');
      navigate('/auth');
      return;
    }

    try {
      // Start or find existing conversation with the client
      const response = await startConversationMutation.mutateAsync(
        booking.clientId
      );

      // Navigate to messages page with the conversation ID
      navigate('/messages', {
        state: {
          conversationId: response.conversation.id,
          openChat: true,
        },
      });

      // Close the modal
      onClose();
    } catch (error: any) {
      console.error('Error starting conversation:', error);
      toast.error(
        error.response?.data?.message || 'Failed to start conversation'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 '>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='absolute inset-0 bg-black/80'
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='relative w-full max-w-2xl bg-neutral-900 border border-white/20 p-6 pr-3 max-h-[90vh] overflow-y-auto '
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-semibold text-white font-mondwest'>
            Booking Request Details
          </h2>
          <button
            onClick={onClose}
            className='text-white/60 hover:text-white text-2xl'
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className='space-y-6'>
          {/* Event Details */}
          <div className='bg-white/5 border border-white/10 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4 font-mondwest'>
              Event Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-white/70 text-sm'>Event Type</p>
                <p className='text-white font-semibold'>{booking.eventType}</p>
              </div>
              <div>
                <p className='text-white/70 text-sm'>Date</p>
                <p className='text-white font-semibold'>{booking.date}</p>
              </div>
              <div>
                <p className='text-white/70 text-sm'>Location</p>
                <p className='text-white font-semibold'>{booking.location}</p>
              </div>
              <div>
                <p className='text-white/70 text-sm'>Budget</p>
                <p className='text-orange-500 font-bold font-mondwest'>
                  {formatPrice(booking.amount)}
                </p>
              </div>
              {booking.duration && (
                <div>
                  <p className='text-white/70 text-sm'>Duration</p>
                  <p className='text-white font-semibold'>{booking.duration}</p>
                </div>
              )}
              {booking.guests && (
                <div>
                  <p className='text-white/70 text-sm'>Expected Guests</p>
                  <p className='text-white font-semibold'>{booking.guests}</p>
                </div>
              )}
            </div>
          </div>

          {/* Client Details */}
          <div className='bg-white/5 border border-white/10 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4 font-mondwest'>
              Client Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-white/70 text-sm'>Name</p>
                <p className='text-white font-semibold'>{booking.clientName}</p>
              </div>
              <div>
                <p className='text-white/70 text-sm'>Email</p>
                <p className='text-white font-semibold'>
                  {booking.clientEmail}
                </p>
              </div>
              {booking.contactPhone && (
                <div>
                  <p className='text-white/70 text-sm'>Phone</p>
                  <p className='text-white font-semibold'>
                    {booking.contactPhone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          {booking.message && (
            <div className='bg-white/5 border border-white/10 p-6'>
              <h3 className='text-lg font-semibold text-white mb-4 font-mondwest'>
                Special Requirements
              </h3>
              <p className='text-white/80'>{booking.message}</p>
            </div>
          )}

          {/* Status */}
          <div className='bg-white/5 border border-white/10 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4 font-mondwest'>
              Request Status
            </h3>
            <span
              className={`px-3 py-1 text-sm font-semibold border ${
                booking.status === 'confirmed'
                  ? 'bg-green-500/20 text-green-400 border-green-500/40'
                  : booking.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                    : 'bg-red-500/20 text-red-400 border-red-500/40'
              }`}
            >
              {booking.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 mt-8'>
          <button
            onClick={onClose}
            className='flex-1 bg-white/10 border border-white/30 text-white px-6 py-3 font-semibold hover:bg-white/20 transition-colors'
          >
            Dismiss
          </button>
          <button
            onClick={handleChatWithClient}
            disabled={startConversationMutation.isPending || !booking.clientId}
            className='flex-1 bg-orange-500 text-black px-6 py-3 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {startConversationMutation.isPending
              ? 'Opening Chat...'
              : 'Chat with Client'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;

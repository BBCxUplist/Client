import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get bookingId from URL params (camelCase as per backend)
  const bookingId =
    searchParams.get('bookingId') || searchParams.get('booking_id');
  const errorMessage = searchParams.get('error') || searchParams.get('message');

  const handleBack = () => {
    navigate('/');
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4 py-4 sm:py-6'>
      <div className='max-w-md w-full bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 md:p-8 text-center'>
        {/* Failed Icon */}
        <div className='inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full mb-3 sm:mb-4'>
          <AlertCircle className='w-6 h-6 sm:w-8 sm:h-8 text-red-500' />
        </div>

        {/* Title */}
        <h1 className='text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 font-mondwest'>
          Payment Failed
        </h1>

        {/* Message */}
        <p className='text-white/70 mb-4 sm:mb-5 text-sm sm:text-base md:text-lg'>
          We encountered an issue processing your payment. No charges were made
          to your account.
        </p>

        {/* Error Details */}
        {errorMessage && (
          <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 mb-4 text-left'>
            <p className='text-red-400 text-xs sm:text-sm font-semibold mb-1.5'>
              Error Details:
            </p>
            <p className='text-red-300 text-xs sm:text-sm'>{errorMessage}</p>
          </div>
        )}

        {bookingId && (
          <p className='text-white/50 mb-4 text-xs font-mono'>
            Booking ID: {bookingId}
          </p>
        )}

        {/* Additional Info */}
        <div className='bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 mb-4 sm:mb-5 text-left'>
          <p className='text-white/80 text-xs sm:text-sm mb-2'>
            <strong>What can you do?</strong>
          </p>
          <ul className='text-white/60 text-xs sm:text-sm space-y-1 list-disc list-inside'>
            <li>Check your payment method and try again</li>
            <li>Ensure you have sufficient funds</li>
            <li>Contact your bank if the issue persists</li>
            <li>Reach out to our support team for assistance</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2 sm:gap-3'>
          <button
            onClick={handleBack}
            className='flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-2.5 px-4 sm:px-6 font-semibold transition-colors flex items-center justify-center gap-2 rounded-lg text-sm sm:text-base'
          >
            <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
            Back
          </button>
          <button
            onClick={handleHome}
            className='flex-1 bg-orange-500 hover:bg-orange-600 text-black py-2 sm:py-2.5 px-4 sm:px-6 font-semibold transition-colors flex items-center justify-center gap-2 rounded-lg text-sm sm:text-base'
          >
            <Home className='w-4 h-4 sm:w-5 sm:h-5' />
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;

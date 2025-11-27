// components/artist/booking/BookingMessages.tsx
interface BookingMessagesProps {
  successMessage: string;
  errorMessage: string;
}

const BookingMessages = ({
  successMessage,
  errorMessage,
}: BookingMessagesProps) => {
  if (!successMessage && !errorMessage) return null;

  return (
    <>
      {/* Success Message */}
      {successMessage && (
        <div className='bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6'>
          <div className='flex items-center gap-3'>
            <div className='text-green-400 text-xl'>✅</div>
            <p className='text-green-400'>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6'>
          <div className='flex items-center gap-3'>
            <div className='text-red-400 text-xl'>❌</div>
            <p className='text-red-400'>{errorMessage}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingMessages;

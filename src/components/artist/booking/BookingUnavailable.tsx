// components/artist/booking/BookingUnavailable.tsx
interface BookingUnavailableProps {
  artist: {
    isBookable: boolean;
    isApproved: boolean;
    isAvailable: boolean;
  };
}

const BookingUnavailable = ({ artist }: BookingUnavailableProps) => {
  if (artist.isBookable && artist.isAvailable && artist.isApproved) {
    return null;
  }

  return (
    <>
      {!artist.isBookable && (
        <div className='text-center py-12'>
          <p className='text-white/60 text-lg mb-4'>
            This artist is currently not accepting bookings
          </p>
        </div>
      )}

      {!artist.isApproved && (
        <div className='text-center py-12'>
          <div className='flex items-center justify-center mb-4'>
            <img
              src='/icons/badge.svg'
              alt='Approval Badge'
              className='w-12 h-12 opacity-50 mr-3'
            />
            <p className='text-white/60 text-lg'>
              This artist is not yet approved
            </p>
          </div>
          <p className='text-white/40 text-sm mb-6'>
            This artist is currently under review and not accepting bookings.
          </p>
        </div>
      )}

      {!artist.isAvailable && artist.isBookable && artist.isApproved && (
        <div className='text-center py-12'>
          <p className='text-white/60 text-lg mb-4'>
            This artist is currently not available
          </p>
        </div>
      )}
    </>
  );
};

export default BookingUnavailable;

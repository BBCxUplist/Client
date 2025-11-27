// components/artist/booking/BookingStatus.tsx
import { formatPrice } from '@/helper';

interface BookingStatusProps {
  artist: {
    isBookable: boolean;
    basePrice: number;
  };
}

const BookingStatus = ({ artist }: BookingStatusProps) => {
  return (
    <div className='bg-white/5 p-4 border border-white/10'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-white/70 text-sm'>Booking Status</p>
          <p
            className={`text-lg font-semibold ${
              artist.isBookable ? 'text-orange-500' : 'text-red-400'
            }`}
          >
            {artist.isBookable ? 'AVAILABLE' : 'UNAVAILABLE'}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-white/70 text-sm'>Starting Price</p>
          <p className='text-xl font-bold text-orange-500 font-mondwest'>
            {formatPrice(artist.basePrice)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingStatus;

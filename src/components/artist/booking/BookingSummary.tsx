// components/artist/booking/BookingSummary.tsx
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/helper';

interface BookingFormData {
  eventDate: Date | undefined;
  eventType: string;
  duration: string;
  guests: string;
  budget: string;
  location: string;
  message: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface BookingSummaryProps {
  artist: {
    displayName: string;
    basePrice: number;
  };
  watchedValues: BookingFormData;
  isSubmitting: boolean;
  isFormValid: boolean;
}

const BookingSummary = ({
  artist,
  watchedValues,
  isSubmitting,
  isFormValid,
}: BookingSummaryProps) => {
  return (
    <div className='space-y-6'>
      {/* Booking Summary */}
      <div>
        <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
          Booking Summary
        </h4>
        <div className='bg-white/5 p-6 border border-white/10 space-y-3'>
          <div className='flex justify-between'>
            <span className='text-white/70'>Artist:</span>
            <span className='text-white font-semibold'>
              {artist.displayName}
            </span>
          </div>
          {watchedValues.eventDate && (
            <div className='flex justify-between'>
              <span className='text-white/70'>Date:</span>
              <span className='text-white'>
                {format(watchedValues.eventDate, 'MMMM do, yyyy')}
              </span>
            </div>
          )}
          {watchedValues.eventType && (
            <div className='flex justify-between'>
              <span className='text-white/70'>Event:</span>
              <span className='text-white'>{watchedValues.eventType}</span>
            </div>
          )}
          {watchedValues.duration && (
            <div className='flex justify-between'>
              <span className='text-white/70'>Duration:</span>
              <span className='text-white'>{watchedValues.duration}h</span>
            </div>
          )}
          <div className='border-t border-white/10 pt-3 mt-3'>
            <div className='flex justify-between'>
              <span className='text-white/70'>Starting Price:</span>
              <span className='text-orange-500 font-bold font-mondwest'>
                {formatPrice(artist.basePrice)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        className='w-full bg-orange-500 text-black hover:bg-orange-600 font-semibold py-3 hidden lg:block'
        disabled={isSubmitting || !isFormValid || !watchedValues.eventDate}
      >
        {isSubmitting ? 'SUBMITTING...' : 'SEND BOOKING REQUEST'}
      </Button>
    </div>
  );
};

export default BookingSummary;

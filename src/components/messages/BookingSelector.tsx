import React from 'react';
import { useGetBookings } from '@/hooks/booking/useGetBookings';
import { ChevronDown } from 'lucide-react';

interface Booking {
  id: string;
  userId: string;
  artistId: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'cancelled'
    | 'refunded'
    | 'paid_escrow'
    | 'paid_artist';
  eventDate: string;
  eventType: string;
  duration: number;
  expectedGuests: number;
  budgetRange: string;
  eventLocation: string;
  specialRequirements?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface BookingSelectorProps {
  recipientUserId: string;
  selectedBookingId?: string;
  onBookingSelect: (booking: Booking) => void;
  isDisabled?: boolean;
}

const BookingSelector = ({
  recipientUserId,
  selectedBookingId,
  onBookingSelect,
  isDisabled = false,
}: BookingSelectorProps) => {
  const { data: bookingsResponse, isLoading, error } = useGetBookings();
  const hasAutoSelected = React.useRef(false);

  // Filter bookings: pending status and matching with recipient user
  // Sort by createdAt or eventDate descending to get latest first
  const filteredBookings: Booking[] = React.useMemo(() => {
    if (!bookingsResponse?.data) return [];

    return bookingsResponse.data
      .filter(
        booking =>
          booking.status === 'pending' &&
          ((booking.userId === recipientUserId && booking.artistId) ||
            (booking.artistId === recipientUserId && booking.userId))
      )
      .sort((a, b) => {
        // Sort by eventDate descending (most recent first)
        return (
          new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
        );
      });
  }, [bookingsResponse?.data, recipientUserId]);

  // Auto-select the latest booking when bookings are loaded
  React.useEffect(() => {
    if (
      filteredBookings.length > 0 &&
      !selectedBookingId &&
      !hasAutoSelected.current
    ) {
      hasAutoSelected.current = true;
      onBookingSelect(filteredBookings[0]);
    }
  }, [filteredBookings, selectedBookingId, onBookingSelect]);

  const selectedBooking = filteredBookings.find(
    b => b.id === selectedBookingId
  );

  return (
    <div className='space-y-2'>
      <label className='block text-sm font-semibold text-white'>
        Select Booking (Optional)
      </label>

      {isLoading ? (
        <div className='bg-white/5 border border-white/20 text-white p-3 rounded'>
          Loading bookings...
        </div>
      ) : error ? (
        <div className='bg-white/5 border border-white/20 text-red-400 p-3 rounded'>
          Failed to load bookings
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className='bg-white/5 border border-white/20 text-white/60 p-3 rounded'>
          No pending bookings available
        </div>
      ) : (
        <div className='relative'>
          <div className='relative'>
            <select
              value={selectedBookingId || ''}
              onChange={e => {
                const booking = filteredBookings.find(
                  b => b.id === e.target.value
                );
                if (booking) {
                  onBookingSelect(booking);
                }
              }}
              disabled={isDisabled}
              className='w-full bg-white text-black placeholder:text-black/50 p-3 border border-neutral-200 rounded focus:ring-2 focus:ring-orange-400 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed pr-10'
            >
              <option className='text-black' value=''>
                Choose a booking...
              </option>
              {filteredBookings.map(booking => (
                <option
                  className='text-black'
                  key={booking.id}
                  value={booking.id}
                >
                  {booking.eventType} -{' '}
                  {new Date(booking.eventDate).toLocaleDateString()} at{' '}
                  {booking.eventLocation}
                </option>
              ))}
            </select>
            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50 pointer-events-none' />
          </div>
        </div>
      )}

      {/* Display selected booking details */}
      {selectedBooking && (
        <div className='bg-white/5 border border-white/20 rounded p-3 space-y-2'>
          <p className='text-sm text-white/80'>
            <span className='font-semibold'>Event:</span>{' '}
            {selectedBooking.eventType}
          </p>
          <p className='text-sm text-white/80'>
            <span className='font-semibold'>Date:</span>{' '}
            {new Date(selectedBooking.eventDate).toLocaleDateString()}
          </p>
          <p className='text-sm text-white/80'>
            <span className='font-semibold'>Location:</span>{' '}
            {selectedBooking.eventLocation}
          </p>
          <p className='text-sm text-white/80'>
            <span className='font-semibold'>Duration:</span>{' '}
            {selectedBooking.duration} hours
          </p>
          <p className='text-sm text-white/80'>
            <span className='font-semibold'>Guests:</span>{' '}
            {selectedBooking.expectedGuests}
          </p>
          {selectedBooking.specialRequirements && (
            <p className='text-sm text-white/80'>
              <span className='font-semibold'>Requirements:</span>{' '}
              {selectedBooking.specialRequirements}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingSelector;

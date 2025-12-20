import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowLeft,
  Home,
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  FileText,
} from 'lucide-react';
import { useGetBooking } from '@/hooks/booking/useGetBooking';
import { format } from 'date-fns';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get bookingId from URL params (camelCase as per backend)
  // session_id is a Stripe session ID, not a booking ID
  const bookingId =
    searchParams.get('bookingId') || searchParams.get('booking_id');

  const { data: bookingResponse, isLoading, error } = useGetBooking(bookingId);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return dateString;
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleHome = () => {
    navigate('/');
  };

  // If no booking ID in URL, show error
  if (!bookingId) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4 py-4 sm:py-6'>
        <div className='max-w-md w-full bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 md:p-8 text-center'>
          <div className='text-red-500 mb-3 sm:mb-4'>
            <CheckCircle2 className='w-12 h-12 sm:w-16 sm:h-16 mx-auto' />
          </div>
          <h1 className='text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-mondwest'>
            Payment Information Not Found
          </h1>
          <p className='text-white/70 mb-4 sm:mb-5 text-sm sm:text-base'>
            We couldn't find the payment information. Please contact support if
            you completed a payment.
          </p>
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
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500 mx-auto mb-3 sm:mb-4'></div>
          <p className='text-white/70 text-sm sm:text-base'>
            Loading payment information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !bookingResponse?.success || !bookingResponse?.data) {
    // Extract error message from axios error
    let errorMessage =
      'Failed to load payment information. Please try again later.';
    if (error) {
      if (error.message) {
        errorMessage = error.message;
      } else if ((error as any).response?.data?.message) {
        errorMessage = (error as any).response.data.message;
      } else if ((error as any).response?.status) {
        errorMessage = `Server error (${(error as any).response.status}). Please contact support if the issue persists.`;
      }
    }

    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4 py-4 sm:py-6'>
        <div className='max-w-md w-full bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 md:p-8 text-center'>
          <div className='text-red-500 mb-3 sm:mb-4'>
            <CheckCircle2 className='w-12 h-12 sm:w-16 sm:h-16 mx-auto' />
          </div>
          <h1 className='text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-mondwest'>
            Error Loading Payment
          </h1>
          <p className='text-white/70 mb-4 sm:mb-5 text-xs sm:text-sm'>
            {errorMessage}
          </p>
          {bookingId && (
            <p className='text-white/50 mb-4 text-xs font-mono'>
              Booking ID: {bookingId}
            </p>
          )}
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
  }

  const booking = bookingResponse.data;

  return (
    <div className='min-h-screen bg-neutral-950 text-white py-4 sm:py-6 md:py-8 px-4 flex items-center justify-center'>
      <div className='w-full max-w-2xl'>
        {/* Success Header */}
        <div className='text-center mb-4 sm:mb-6'>
          <div className='inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full mb-2 sm:mb-3'>
            <CheckCircle2 className='w-6 h-6 sm:w-8 sm:h-8 text-green-500' />
          </div>
          <h1 className='text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 font-mondwest'>
            Payment Completed Successfully
          </h1>
          <p className='text-white/70 text-sm sm:text-base md:text-lg'>
            Your payment has been processed and confirmed
          </p>
        </div>

        {/* Payment Information Card */}
        <div className='bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 md:p-5 mb-4 sm:mb-5'>
          <h2 className='text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 font-mondwest border-b border-white/10 pb-2'>
            Payment Information
          </h2>

          <div className='space-y-2 sm:space-y-3'>
            {/* Booking ID */}
            <div className='flex items-center justify-between py-1.5 border-b border-white/5'>
              <span className='text-white/70 text-xs sm:text-sm'>
                Booking ID
              </span>
              <span className='text-white font-mono text-xs sm:text-sm truncate ml-2'>
                {booking.id}
              </span>
            </div>

            {/* Payment Status */}
            <div className='flex items-center justify-between py-1.5 border-b border-white/5'>
              <span className='text-white/70 text-xs sm:text-sm'>
                Payment Status
              </span>
              <span className='text-green-500 font-semibold text-xs sm:text-sm'>
                {booking.isPaid ? 'Paid' : booking.status}
              </span>
            </div>

            {/* Booking Status */}
            <div className='flex items-center justify-between py-1.5 border-b border-white/5'>
              <span className='text-white/70 text-xs sm:text-sm'>
                Booking Status
              </span>
              <span className='text-white font-semibold capitalize text-xs sm:text-sm'>
                {booking.status.replace('_', ' ')}
              </span>
            </div>

            {/* Event Details Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-2'>
              {/* Event Type */}
              {booking.eventType && (
                <div className='flex items-start gap-2 py-1.5 border-b border-white/5 sm:border-b-0 sm:border-r border-white/5 sm:pr-3'>
                  <FileText className='w-4 h-4 sm:w-5 sm:h-5 text-white/60 mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <span className='text-white/70 text-xs block mb-0.5'>
                      Event Type
                    </span>
                    <span className='text-white font-semibold text-xs sm:text-sm truncate'>
                      {booking.eventType}
                    </span>
                  </div>
                </div>
              )}

              {/* Event Date */}
              {booking.eventDate && (
                <div className='flex items-start gap-2 py-1.5 border-b border-white/5 sm:border-b-0 sm:pl-3'>
                  <Calendar className='w-4 h-4 sm:w-5 sm:h-5 text-white/60 mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <span className='text-white/70 text-xs block mb-0.5'>
                      Event Date
                    </span>
                    <span className='text-white font-semibold text-xs sm:text-sm'>
                      {formatDate(booking.eventDate)}
                    </span>
                  </div>
                </div>
              )}

              {/* Location */}
              {booking.eventLocation && (
                <div className='flex items-start gap-2 py-1.5 border-b border-white/5 sm:border-b-0 sm:border-r border-white/5 sm:pr-3'>
                  <MapPin className='w-4 h-4 sm:w-5 sm:h-5 text-white/60 mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <span className='text-white/70 text-xs block mb-0.5'>
                      Location
                    </span>
                    <span className='text-white font-semibold text-xs sm:text-sm truncate'>
                      {booking.eventLocation}
                    </span>
                  </div>
                </div>
              )}

              {/* Duration */}
              {booking.duration && (
                <div className='flex items-start gap-2 py-1.5 border-b border-white/5 sm:border-b-0 sm:pl-3'>
                  <Clock className='w-4 h-4 sm:w-5 sm:h-5 text-white/60 mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <span className='text-white/70 text-xs block mb-0.5'>
                      Duration
                    </span>
                    <span className='text-white font-semibold text-xs sm:text-sm'>
                      {booking.duration} hours
                    </span>
                  </div>
                </div>
              )}

              {/* Expected Guests */}
              {booking.expectedGuests && (
                <div className='flex items-start gap-2 py-1.5 border-b border-white/5 sm:border-b-0 sm:border-r border-white/5 sm:pr-3'>
                  <Users className='w-4 h-4 sm:w-5 sm:h-5 text-white/60 mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <span className='text-white/70 text-xs block mb-0.5'>
                      Expected Guests
                    </span>
                    <span className='text-white font-semibold text-xs sm:text-sm'>
                      {booking.expectedGuests}
                    </span>
                  </div>
                </div>
              )}

              {/* Budget Range */}
              {booking.budgetRange && (
                <div className='flex items-start gap-2 py-1.5 sm:pl-3'>
                  <DollarSign className='w-4 h-4 sm:w-5 sm:h-5 text-white/60 mt-0.5 flex-shrink-0' />
                  <div className='flex-1 min-w-0'>
                    <span className='text-white/70 text-xs block mb-0.5'>
                      Budget Range
                    </span>
                    <span className='text-white font-semibold text-xs sm:text-sm'>
                      {booking.budgetRange}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Special Requirements */}
            {booking.specialRequirements && (
              <div className='pt-2 border-t border-white/10 mt-2'>
                <span className='text-white/70 text-xs sm:text-sm block mb-1'>
                  Special Requirements
                </span>
                <p className='text-white/80 text-xs sm:text-sm'>
                  {booking.specialRequirements}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div className='pt-2 border-t border-white/10 mt-2 space-y-1.5'>
              <h3 className='text-white font-semibold mb-2 text-xs sm:text-sm'>
                Contact Information
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-1.5'>
                {booking.contactName && (
                  <div className='flex items-center justify-between sm:flex-col sm:items-start py-1'>
                    <span className='text-white/70 text-xs'>Name</span>
                    <span className='text-white text-xs sm:text-sm truncate'>
                      {booking.contactName}
                    </span>
                  </div>
                )}
                {booking.contactEmail && (
                  <div className='flex items-center justify-between sm:flex-col sm:items-start py-1'>
                    <span className='text-white/70 text-xs'>Email</span>
                    <span className='text-white text-xs sm:text-sm truncate'>
                      {booking.contactEmail}
                    </span>
                  </div>
                )}
                {booking.contactPhone && (
                  <div className='flex items-center justify-between sm:flex-col sm:items-start py-1'>
                    <span className='text-white/70 text-xs'>Phone</span>
                    <span className='text-white text-xs sm:text-sm'>
                      {booking.contactPhone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Date */}
            <div className='pt-2 border-t border-white/10 mt-2'>
              <div className='flex items-center justify-between py-1'>
                <span className='text-white/70 text-xs sm:text-sm'>
                  Payment Date
                </span>
                <span className='text-white text-xs sm:text-sm'>
                  {formatDate(booking.updatedAt)}
                </span>
              </div>
            </div>
          </div>
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

export default PaymentSuccess;

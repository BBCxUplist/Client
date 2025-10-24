import { format } from 'date-fns';
import { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  FileText,
  Loader2,
} from 'lucide-react';
import type { QuoteData } from '@/types/chat';
import { useApproveBooking } from '@/hooks/booking/useApproveBooking';
import { usePayForBooking } from '@/hooks/booking/usePayForBooking';

interface QuoteCardProps {
  quoteData: QuoteData;
  isCurrentUser: boolean;
  text?: string | null;
}

interface BookingStatus {
  isApproved: boolean;
  isPaid: boolean;
}

const QuoteCard = ({ quoteData, isCurrentUser, text }: QuoteCardProps) => {
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>({
    isApproved: false,
    isPaid: false,
  });

  const { mutate: approveBooking, isPending: isApproving } =
    useApproveBooking();
  const { mutate: payForBooking, isPending: isPayingForBooking } =
    usePayForBooking();

  const isExpired = quoteData.validUntil
    ? new Date(quoteData.validUntil) < new Date()
    : false;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return dateString;
    }
  };

  const handleApproveQuote = () => {
    if (!quoteData.bookingId) {
      console.error('Booking ID is required');
      return;
    }

    approveBooking(quoteData.bookingId, {
      onSuccess: () => {
        setBookingStatus(prev => ({ ...prev, isApproved: true }));
      },
      onError: error => {
        console.error('Failed to approve booking:', error);
      },
    });
  };

  const handlePayForBooking = () => {
    if (!quoteData.bookingId) {
      console.error('Booking ID is required');
      return;
    }

    payForBooking(
      { bookingId: quoteData.bookingId, isUser: true },
      {
        onSuccess: () => {
          setBookingStatus(prev => ({ ...prev, isPaid: true }));
        },
        onError: error => {
          console.error('Failed to pay for booking:', error);
        },
      }
    );
  };

  return (
    <div
      className={`border-2 max-w-md ${
        isCurrentUser
          ? 'bg-orange-500/10 border-orange-500/30'
          : 'bg-white/5 border-white/10'
      } ${isExpired ? 'opacity-60' : ''}`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 border-b ${
          isCurrentUser ? 'border-orange-500/30' : 'border-white/10'
        }`}
      >
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold text-white text-lg font-mondwest'>
            Event Quote
          </h3>
          {isExpired && (
            <span className='text-xs text-red-400 font-semibold'>EXPIRED</span>
          )}
        </div>
      </div>

      {/* Quote Details */}
      <div className='p-4 space-y-3'>
        {/* Event Type */}
        {quoteData.eventType && (
          <div className='flex items-center gap-2'>
            <FileText className='w-4 h-4 text-white/60' />
            <span className='text-white text-sm'>
              <span className='text-white/60'>Event:</span>{' '}
              <span className='font-medium'>{quoteData.eventType}</span>
            </span>
          </div>
        )}

        {/* Event Date */}
        {quoteData.eventDate && (
          <div className='flex items-center gap-2'>
            <Calendar className='w-4 h-4 text-white/60' />
            <span className='text-white text-sm'>
              <span className='text-white/60'>Date:</span>{' '}
              <span className='font-medium'>
                {formatDate(quoteData.eventDate)}
              </span>
            </span>
          </div>
        )}

        {/* Location */}
        {quoteData.eventLocation && (
          <div className='flex items-center gap-2'>
            <MapPin className='w-4 h-4 text-white/60' />
            <span className='text-white text-sm'>
              <span className='text-white/60'>Location:</span>{' '}
              <span className='font-medium'>{quoteData.eventLocation}</span>
            </span>
          </div>
        )}

        {/* Duration */}
        {quoteData.duration && (
          <div className='flex items-center gap-2'>
            <Clock className='w-4 h-4 text-white/60' />
            <span className='text-white text-sm'>
              <span className='text-white/60'>Duration:</span>{' '}
              <span className='font-medium'>{quoteData.duration} hours</span>
            </span>
          </div>
        )}

        {/* Expected Guests */}
        {quoteData.expectedGuests && (
          <div className='flex items-center gap-2'>
            <Users className='w-4 h-4 text-white/60' />
            <span className='text-white text-sm'>
              <span className='text-white/60'>Guests:</span>{' '}
              <span className='font-medium'>{quoteData.expectedGuests}</span>
            </span>
          </div>
        )}

        {/* Price Breakdown */}
        {quoteData.priceBreakdown && (
          <div className='mt-4 pt-3 border-t border-white/10'>
            <p className='text-xs text-white/60 font-semibold mb-2 uppercase'>
              Price Breakdown
            </p>
            <div className='space-y-1.5 text-sm'>
              {quoteData.priceBreakdown.basePrice > 0 && (
                <div className='flex justify-between text-white/80'>
                  <span>Base Price</span>
                  <span>
                    {formatCurrency(quoteData.priceBreakdown.basePrice)}
                  </span>
                </div>
              )}
              {quoteData.priceBreakdown.additionalHours &&
                quoteData.priceBreakdown.additionalHours > 0 && (
                  <div className='flex justify-between text-white/80'>
                    <span>Additional Hours</span>
                    <span>
                      {formatCurrency(quoteData.priceBreakdown.additionalHours)}
                    </span>
                  </div>
                )}
              {quoteData.priceBreakdown.equipment &&
                quoteData.priceBreakdown.equipment > 0 && (
                  <div className='flex justify-between text-white/80'>
                    <span>Equipment</span>
                    <span>
                      {formatCurrency(quoteData.priceBreakdown.equipment)}
                    </span>
                  </div>
                )}
              {quoteData.priceBreakdown.travel &&
                quoteData.priceBreakdown.travel > 0 && (
                  <div className='flex justify-between text-white/80'>
                    <span>Travel</span>
                    <span>
                      {formatCurrency(quoteData.priceBreakdown.travel)}
                    </span>
                  </div>
                )}
              {quoteData.priceBreakdown.other &&
                quoteData.priceBreakdown.other > 0 && (
                  <div className='flex justify-between text-white/80'>
                    <span>Other</span>
                    <span>
                      {formatCurrency(quoteData.priceBreakdown.other)}
                    </span>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Total Price */}
        <div
          className={`mt-4 pt-4 border-t flex items-center justify-between ${
            isCurrentUser ? 'border-orange-500/30' : 'border-white/10'
          }`}
        >
          <div className='flex items-center gap-2'>
            <DollarSign className='w-5 h-5 text-orange-500' />
            <span className='text-white/60 font-semibold'>Total Price</span>
          </div>
          <span className='text-2xl font-bold text-orange-500'>
            {formatCurrency(quoteData.proposedPrice)}
          </span>
        </div>

        {/* Notes */}
        {quoteData.notes && (
          <div className='mt-3 pt-3 border-t border-white/10'>
            <p className='text-xs text-white/60 font-semibold mb-1.5 uppercase'>
              Notes
            </p>
            <p className='text-sm text-white/80 whitespace-pre-wrap'>
              {quoteData.notes}
            </p>
          </div>
        )}

        {/* Optional text message */}
        {text && (
          <div className='mt-3 pt-3 border-t border-white/10'>
            <p className='text-sm text-white/80 whitespace-pre-wrap'>{text}</p>
          </div>
        )}

        {/* Valid Until */}
        {quoteData.validUntil && (
          <div className='mt-3 text-center'>
            <p className='text-xs text-white/50'>
              Valid until {formatDate(quoteData.validUntil)}
            </p>
          </div>
        )}

        {/* Action Buttons (only for non-current user and not expired) */}
        {!isCurrentUser && !isExpired && (
          <div className='mt-4 flex gap-3'>
            {!bookingStatus.isApproved ? (
              <button
                onClick={handleApproveQuote}
                disabled={isApproving}
                className='flex-1 bg-orange-500 text-black py-2.5 px-4 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {isApproving && <Loader2 className='w-4 h-4 animate-spin' />}
                {isApproving ? 'Approving...' : 'Accept Quote'}
              </button>
            ) : !bookingStatus.isPaid ? (
              <button
                onClick={handlePayForBooking}
                disabled={isPayingForBooking}
                className='flex-1 bg-green-600 text-white py-2.5 px-4 font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {isPayingForBooking && (
                  <Loader2 className='w-4 h-4 animate-spin' />
                )}
                {isPayingForBooking ? 'Processing...' : 'Pay Now'}
              </button>
            ) : (
              <div className='flex-1 bg-green-500/20 text-green-400 py-2.5 px-4 font-semibold border border-green-500/50 flex items-center justify-center'>
                ✓ Booking Confirmed & Paid
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteCard;

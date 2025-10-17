import { format } from 'date-fns';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  FileText,
} from 'lucide-react';
import type { QuoteData } from '@/types/chat';

interface QuoteCardProps {
  quoteData: QuoteData;
  isCurrentUser: boolean;
  text?: string | null;
}

const QuoteCard = ({ quoteData, isCurrentUser, text }: QuoteCardProps) => {
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
            <button className='flex-1 bg-orange-500 text-black py-2.5 px-4 font-semibold hover:bg-orange-600 transition-colors'>
              Accept Quote
            </button>
            <button className='flex-1 bg-white/5 text-white border border-white/20 py-2.5 px-4 font-semibold hover:bg-white/10 transition-colors'>
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteCard;

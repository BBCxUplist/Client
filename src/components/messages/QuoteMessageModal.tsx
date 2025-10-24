import { useState, useEffect } from 'react';
import { X, DollarSign, Plus, Minus } from 'lucide-react';
import type { QuoteData } from '@/types/chat';
import BookingSelector from './BookingSelector';
import { useQuoteFromBooking } from '@/hooks/booking/useQuoteFromBooking';

interface Booking {
  id: string;
  userId: string;
  artistId: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'cancelled'
    | 'paid_escrow'
    | 'paid_artist'
    | 'refunded';
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

interface QuoteMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendQuote: (quoteData: QuoteData, text?: string) => void;
  recipientUserId?: string;
}

const QuoteMessageModal = ({
  isOpen,
  onClose,
  onSendQuote,
  recipientUserId,
}: QuoteMessageModalProps) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>(
    undefined
  );
  const [formData, setFormData] = useState({
    eventType: '',
    eventDate: '',
    eventLocation: '',
    duration: '',
    expectedGuests: '',
    proposedPrice: '',
    basePrice: '',
    additionalHours: '',
    equipment: '',
    travel: '',
    other: '',
    notes: '',
    validUntil: '',
    text: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const prepopulatedData = useQuoteFromBooking(selectedBooking);

  // Prepopulate form when booking is selected
  useEffect(() => {
    if (selectedBooking) {
      setFormData(prev => ({
        ...prev,
        ...prepopulatedData,
      }));
    }
  }, [selectedBooking, prepopulatedData]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Proposed price is required
    if (!formData.proposedPrice || parseFloat(formData.proposedPrice) <= 0) {
      newErrors.proposedPrice = 'Proposed price must be greater than 0';
    }

    // Duration validation
    if (formData.duration) {
      const duration = parseInt(formData.duration);
      if (duration < 1 || duration > 24) {
        newErrors.duration = 'Duration must be between 1 and 24 hours';
      }
    }

    // Text length validation
    if (formData.text && formData.text.length > 500) {
      newErrors.text = 'Message must be 500 characters or less';
    }

    // Notes length validation
    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = 'Notes must be 1000 characters or less';
    }

    // Valid until date validation
    if (formData.validUntil) {
      const validUntilDate = new Date(formData.validUntil);
      const now = new Date();
      if (validUntilDate <= now) {
        newErrors.validUntil = 'Valid until date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const quoteData: QuoteData = {
      proposedPrice: parseFloat(formData.proposedPrice),
    };

    // Add optional fields
    if (formData.eventType) quoteData.eventType = formData.eventType;
    if (formData.eventDate)
      quoteData.eventDate = new Date(formData.eventDate).toISOString();
    if (formData.eventLocation)
      quoteData.eventLocation = formData.eventLocation;
    if (formData.duration) quoteData.duration = parseInt(formData.duration);
    if (formData.expectedGuests)
      quoteData.expectedGuests = parseInt(formData.expectedGuests);
    if (formData.notes) quoteData.notes = formData.notes;
    if (formData.validUntil)
      quoteData.validUntil = new Date(formData.validUntil).toISOString();
    // Add booking ID if booking was selected
    if (selectedBooking?.id) quoteData.bookingId = selectedBooking.id;

    // Add price breakdown if any field is filled
    if (
      showBreakdown &&
      (formData.basePrice ||
        formData.additionalHours ||
        formData.equipment ||
        formData.travel ||
        formData.other)
    ) {
      quoteData.priceBreakdown = {
        basePrice: parseFloat(formData.basePrice) || 0,
        additionalHours: parseFloat(formData.additionalHours) || undefined,
        equipment: parseFloat(formData.equipment) || undefined,
        travel: parseFloat(formData.travel) || undefined,
        other: parseFloat(formData.other) || undefined,
      };
    }

    onSendQuote(quoteData, formData.text || undefined);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      eventType: '',
      eventDate: '',
      eventLocation: '',
      duration: '',
      expectedGuests: '',
      proposedPrice: '',
      basePrice: '',
      additionalHours: '',
      equipment: '',
      travel: '',
      other: '',
      notes: '',
      validUntil: '',
      text: '',
    });
    setErrors({});
    setShowBreakdown(false);
    setSelectedBooking(undefined);
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4'>
      <div className='bg-neutral-900 border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-neutral-900 border-b border-white/10 p-4 flex items-center justify-between'>
          <h2 className='text-xl font-bold text-white font-mondwest'>
            Send Quote
          </h2>
          <button
            onClick={handleClose}
            className='text-white/60 hover:text-white transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          {/* Booking Selector */}
          {recipientUserId && (
            <BookingSelector
              recipientUserId={recipientUserId}
              selectedBookingId={selectedBooking?.id}
              onBookingSelect={setSelectedBooking}
            />
          )}

          {/* Event Type */}
          <div>
            <label className='block text-sm font-semibold text-white mb-2'>
              Event Type
            </label>
            <input
              type='text'
              value={formData.eventType}
              onChange={e =>
                setFormData({ ...formData, eventType: e.target.value })
              }
              placeholder='e.g. Wedding, Birthday, Corporate Event'
              className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors'
            />
          </div>

          {/* Event Date & Location */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-white mb-2'>
                Event Date
              </label>
              <input
                type='datetime-local'
                value={formData.eventDate}
                onChange={e =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                aria-label='Event Date'
                className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-white mb-2'>
                Location
              </label>
              <input
                type='text'
                value={formData.eventLocation}
                onChange={e =>
                  setFormData({ ...formData, eventLocation: e.target.value })
                }
                placeholder='Event location'
                className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors'
              />
            </div>
          </div>

          {/* Duration & Expected Guests */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-white mb-2'>
                Duration (hours)
              </label>
              <input
                type='number'
                min='1'
                max='24'
                value={formData.duration}
                onChange={e =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder='e.g. 4'
                className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors'
              />
              {errors.duration && (
                <p className='text-red-400 text-xs mt-1'>{errors.duration}</p>
              )}
            </div>
            <div>
              <label className='block text-sm font-semibold text-white mb-2'>
                Expected Guests
              </label>
              <input
                type='number'
                min='1'
                value={formData.expectedGuests}
                onChange={e =>
                  setFormData({ ...formData, expectedGuests: e.target.value })
                }
                placeholder='e.g. 100'
                className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors'
              />
            </div>
          </div>

          {/* Proposed Price */}
          <div>
            <label className='block text-sm font-semibold text-white mb-2'>
              Total Price <span className='text-red-400'>*</span>
            </label>
            <div className='relative'>
              <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60' />
              <input
                type='number'
                min='0'
                step='0.01'
                value={formData.proposedPrice}
                onChange={e =>
                  setFormData({ ...formData, proposedPrice: e.target.value })
                }
                placeholder='0.00'
                className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 pl-10 focus:border-orange-500 focus:outline-none transition-colors'
                required
              />
            </div>
            {errors.proposedPrice && (
              <p className='text-red-400 text-xs mt-1'>
                {errors.proposedPrice}
              </p>
            )}
          </div>

          {/* Price Breakdown Toggle */}
          <button
            type='button'
            onClick={() => setShowBreakdown(!showBreakdown)}
            className='flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors text-sm font-semibold'
          >
            {showBreakdown ? (
              <Minus className='w-4 h-4' />
            ) : (
              <Plus className='w-4 h-4' />
            )}
            {showBreakdown ? 'Hide' : 'Add'} Price Breakdown
          </button>

          {/* Price Breakdown Fields */}
          {showBreakdown && (
            <div className='space-y-3 pl-4 border-l-2 border-orange-500/30'>
              <div>
                <label className='block text-sm text-white/80 mb-1'>
                  Base Price
                </label>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={formData.basePrice}
                  onChange={e =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                  placeholder='0.00'
                  className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-2 focus:border-orange-500 focus:outline-none transition-colors'
                />
              </div>
              <div>
                <label className='block text-sm text-white/80 mb-1'>
                  Additional Hours
                </label>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={formData.additionalHours}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      additionalHours: e.target.value,
                    })
                  }
                  placeholder='0.00'
                  className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-2 focus:border-orange-500 focus:outline-none transition-colors'
                />
              </div>
              <div>
                <label className='block text-sm text-white/80 mb-1'>
                  Equipment
                </label>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={formData.equipment}
                  onChange={e =>
                    setFormData({ ...formData, equipment: e.target.value })
                  }
                  placeholder='0.00'
                  className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-2 focus:border-orange-500 focus:outline-none transition-colors'
                />
              </div>
              <div>
                <label className='block text-sm text-white/80 mb-1'>
                  Travel
                </label>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={formData.travel}
                  onChange={e =>
                    setFormData({ ...formData, travel: e.target.value })
                  }
                  placeholder='0.00'
                  className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-2 focus:border-orange-500 focus:outline-none transition-colors'
                />
              </div>
              <div>
                <label className='block text-sm text-white/80 mb-1'>
                  Other
                </label>
                <input
                  type='number'
                  min='0'
                  step='0.01'
                  value={formData.other}
                  onChange={e =>
                    setFormData({ ...formData, other: e.target.value })
                  }
                  placeholder='0.00'
                  className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-2 focus:border-orange-500 focus:outline-none transition-colors'
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className='block text-sm font-semibold text-white mb-2'>
              Notes {formData.notes && `(${formData.notes.length}/1000)`}
            </label>
            <textarea
              value={formData.notes}
              onChange={e =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder='Additional details about the quote...'
              rows={3}
              maxLength={1000}
              className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 resize-none focus:border-orange-500 focus:outline-none transition-colors'
            />
            {errors.notes && (
              <p className='text-red-400 text-xs mt-1'>{errors.notes}</p>
            )}
          </div>

          {/* Optional Message */}
          <div>
            <label className='block text-sm font-semibold text-white mb-2'>
              Message (Optional){' '}
              {formData.text && `(${formData.text.length}/500)`}
            </label>
            <textarea
              value={formData.text}
              onChange={e => setFormData({ ...formData, text: e.target.value })}
              placeholder='Add a personal message with the quote...'
              rows={2}
              maxLength={500}
              className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 resize-none focus:border-orange-500 focus:outline-none transition-colors'
            />
            {errors.text && (
              <p className='text-red-400 text-xs mt-1'>{errors.text}</p>
            )}
          </div>

          {/* Valid Until */}
          <div>
            <label className='block text-sm font-semibold text-white mb-2'>
              Valid Until (Optional)
            </label>
            <input
              type='date'
              value={formData.validUntil}
              onChange={e =>
                setFormData({ ...formData, validUntil: e.target.value })
              }
              aria-label='Valid Until Date'
              className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors'
            />
            {errors.validUntil && (
              <p className='text-red-400 text-xs mt-1'>{errors.validUntil}</p>
            )}
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={handleClose}
              className='flex-1 bg-white/5 text-white border border-white/20 py-3 px-4 font-semibold hover:bg-white/10 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 bg-orange-500 text-black py-3 px-4 font-semibold hover:bg-orange-600 transition-colors'
            >
              Send Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteMessageModal;

import { useMemo } from 'react';

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

interface QuoteFormData {
  eventType: string;
  eventDate: string;
  eventLocation: string;
  duration: string;
  expectedGuests: string;
  proposedPrice: string;
  basePrice: string;
  additionalHours: string;
  equipment: string;
  travel: string;
  other: string;
  notes: string;
  validUntil: string;
  text: string;
}

/**
 * Hook to convert booking details into quote form data
 * Maps booking fields to quote form fields for prepopulation
 */
export const useQuoteFromBooking = (
  booking: Booking | undefined
): Partial<QuoteFormData> => {
  return useMemo(() => {
    if (!booking) return {};

    // Convert ISO string to datetime-local format for input
    const eventDate = new Date(booking.eventDate);
    const dateString = eventDate.toISOString().slice(0, 16);

    // Extract budget range (usually something like "$1000 - $5000")
    // Default base price to the minimum of budget range
    let basePrice = '';
    if (booking.budgetRange) {
      const match = booking.budgetRange.match(/\$?([\d,]+)/);
      if (match) {
        basePrice = match[1].replace(/,/g, '');
      }
    }

    return {
      eventType: booking.eventType,
      eventDate: dateString,
      eventLocation: booking.eventLocation,
      duration: booking.duration.toString(),
      expectedGuests: booking.expectedGuests.toString(),
      proposedPrice: basePrice, // Use budget as initial proposed price
      basePrice: basePrice,
      notes: booking.specialRequirements || '',
      text: '', // Leave text empty for artist to compose
    };
  }, [booking]);
};

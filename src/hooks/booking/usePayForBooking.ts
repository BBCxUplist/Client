import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface PayForBookingPayload {
  bookingId: string;
  isUser: boolean; // true for paid_escrow (user payment), false for paid_artist
}

interface PayForBookingResponse {
  success: boolean;
  message: string;
  data: {
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
    isPaid: boolean;
    eventDate: string;
    eventType: string;
    duration: number;
    expectedGuests: number;
    budgetRange?: string;
    eventLocation: string;
    specialRequirements?: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Hook to pay for a booking
 * Updates booking status to:
 * - paid_escrow: if payment is from user side
 * - paid_artist: if payment is from artist side
 */
export const usePayForBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<PayForBookingResponse, Error, PayForBookingPayload>({
    mutationFn: async ({ bookingId, isUser }) => {
      const status = isUser ? 'paid_escrow' : 'paid_artist';
      const response = await apiClient.post<PayForBookingResponse>(
        `/bookings/${bookingId}/pay`,
        { status }
      );
      return response.data;
    },
    onSuccess: data => {
      // Invalidate bookings list query
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      // Update specific booking cache
      queryClient.setQueryData(['booking', data.data.id], data.data);
    },
    onError: error => {
      console.error('Failed to pay for booking:', error);
    },
  });
};

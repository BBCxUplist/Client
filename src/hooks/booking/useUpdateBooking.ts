import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface UpdateBookingPayload {
  eventDate?: string;
  eventType?: string;
  duration?: number;
  expectedGuests?: number;
  budgetRange?: string;
  eventLocation?: string;
  specialRequirements?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface UpdateBookingResponse {
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
 * Hook to update a booking with new event details
 * Typically used when an artist sends a quote and wants to update booking details
 */
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateBookingResponse,
    Error,
    { bookingId: string; payload: UpdateBookingPayload }
  >({
    mutationFn: async ({ bookingId, payload }) => {
      const response = await apiClient.post<UpdateBookingResponse>(
        `/bookings/${bookingId}/update`,
        payload
      );
      return response.data;
    },
    onSuccess: data => {
      // Invalidate bookings query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });

      // Also update the specific booking in cache if it exists
      queryClient.setQueryData(['booking', data.data.id], data.data);
    },
    onError: error => {
      console.error('Failed to update booking:', error);
    },
  });
};

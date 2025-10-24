import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface ApproveBookingResponse {
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
 * Hook to approve a booking (user side)
 * Used when a user accepts a quote from an artist
 * Updates booking status to confirmed
 */
export const useApproveBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApproveBookingResponse,
    Error,
    string // bookingId
  >({
    mutationFn: async (bookingId: string) => {
      const response = await apiClient.post<ApproveBookingResponse>(
        `/bookings/${bookingId}/approve`,
        {}
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
      console.error('Failed to approve booking:', error);
    },
  });
};

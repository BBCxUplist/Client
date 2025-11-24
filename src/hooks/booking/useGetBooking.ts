import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

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
  isPaid: boolean;
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
  createdAt: string;
  updatedAt: string;
}

interface GetBookingResponse {
  success: boolean;
  message: string;
  data: Booking;
}

export const useGetBooking = (bookingId: string | null) => {
  const queryClient = useQueryClient();

  return useQuery<GetBookingResponse, Error>({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error('Booking ID is required');

      // Validate that it's not a Stripe session ID (session IDs start with 'cs_')
      if (bookingId.startsWith('cs_')) {
        throw new Error(
          'Invalid booking ID. Please use booking_id parameter, not session_id.'
        );
      }

      try {
        // Call the correct endpoint: GET /bookings/:id
        // This calls getBookingById which requires authentication
        const response = await apiClient.get<GetBookingResponse>(
          `/bookings/${bookingId}`
        );
        return response.data;
      } catch (error: any) {
        // If single endpoint fails (404, 500, etc.), try to find in bookings list cache
        try {
          const bookingsData = queryClient.getQueryData<{
            success: boolean;
            data: Booking[];
          }>(['bookings']);

          if (bookingsData?.success && bookingsData.data) {
            const booking = bookingsData.data.find(b => b.id === bookingId);
            if (booking) {
              return {
                success: true,
                message: 'Booking found',
                data: booking,
              };
            }
          }
        } catch (cacheError) {
          // Ignore cache errors
          console.error('Cache error:', cacheError);
        }

        // Re-throw the original error if not found in cache
        throw error;
      }
    },
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Reduced retries since we have fallback
  });
};

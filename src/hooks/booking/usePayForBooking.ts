import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface PayForBookingPayload {
  bookingId: string;
}

// i am not using this anymore, you have written this you can decide to keep or remove it
// interface PayForBookingResponse {
//   success: boolean;
//   message: string;
//   data: {
//     id: string;
//     userId: string;
//     artistId: string;
//     status:
//       | 'pending'
//       | 'confirmed'
//       | 'cancelled'
//       | 'paid_escrow'
//       | 'paid_artist'
//       | 'refunded';
//     isPaid: boolean;
//     eventDate: string;
//     eventType: string;
//     duration: number;
//     expectedGuests: number;
//     budgetRange?: string;
//     eventLocation: string;
//     specialRequirements?: string;
//     contactName: string;
//     contactEmail: string;
//     contactPhone: string;
//     createdAt: string;
//     updatedAt: string;
//   };
// }

/**
 * Hook to pay for a booking
 * Updates booking status to:
 * - paid_escrow: if payment is from user side
 * - paid_artist: if payment is from artist side
 */

interface PayForBookingPayload {
  bookingId: string;
}

interface StripeCheckoutResponse {
  checkoutUrl: string;
}

export const usePayForBooking = () => {
  return useMutation<StripeCheckoutResponse, Error, PayForBookingPayload>({
    mutationFn: async ({ bookingId }) => {
      if (!bookingId) throw new Error('Booking ID is required');
      const { data } = await apiClient.post(`/bookings/${bookingId}/pay`, {});
      if (!data?.data?.checkoutUrl)
        throw new Error('Stripe checkout URL not returned');
      return data.data;
    },
    onSuccess: ({ checkoutUrl }) => {
      // Redirect user to Stripe's hosted checkout page
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error('Checkout URL missing from response');
      }
    },
    onError: error => {
      console.error('Failed to start Stripe checkout:', error.message);
    },
  });
};

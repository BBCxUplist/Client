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

export interface PaymentError extends Error {
  accountStatus?: 'restricted' | 'pending' | 'not_connected';
  isStripeAccountError?: boolean;
}

export const usePayForBooking = () => {
  return useMutation<
    StripeCheckoutResponse,
    PaymentError,
    PayForBookingPayload
  >({
    mutationFn: async ({ bookingId }) => {
      if (!bookingId) throw new Error('Booking ID is required');

      try {
        const { data } = await apiClient.post(`/bookings/${bookingId}/pay`, {});

        // Handle explicit failure response from API
        if (data?.success === false) {
          const error = new Error(
            data.message || 'Payment failed'
          ) as PaymentError;
          if (data.data?.accountStatus) {
            error.accountStatus = data.data.accountStatus;
            error.isStripeAccountError = true;
          }
          throw error;
        }

        if (!data?.data?.checkoutUrl) {
          throw new Error('Stripe checkout URL not returned');
        }
        return data.data;
      } catch (err: unknown) {
        // Handle axios error responses
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as {
            response?: {
              data?: {
                success?: boolean;
                message?: string;
                data?: { accountStatus?: string };
              };
            };
          };
          const responseData = axiosError.response?.data;
          if (responseData?.success === false) {
            const error = new Error(
              responseData.message || 'Payment failed'
            ) as PaymentError;
            if (responseData.data?.accountStatus) {
              error.accountStatus = responseData.data
                .accountStatus as PaymentError['accountStatus'];
              error.isStripeAccountError = true;
            }
            throw error;
          }
        }
        throw err;
      }
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

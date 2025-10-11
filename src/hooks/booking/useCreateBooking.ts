import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface CreateBookingData {
  artistId: string;
  eventDate: string; // ISO 8601 format
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

interface CreateBookingResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    status: string;
    createdAt: string;
  };
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateBookingResponse, Error, CreateBookingData>({
    mutationFn: async bookingData => {
      try {
        const response = await apiClient.post<CreateBookingResponse>(
          '/bookings',
          bookingData
        );
        return response.data;
      } catch (error: any) {
        // Handle different error scenarios
        if (error.response?.data) {
          // If the API returns an error response with data
          const errorData = error.response.data;
          throw new Error(
            errorData.message ||
              errorData.error ||
              `API Error: ${error.response.status}`
          );
        } else if (error.response?.status) {
          // If we have a status but no data
          throw new Error(
            `API Error: ${error.response.status} - ${error.message}`
          );
        } else {
          // Network or other errors
          throw new Error(error.message || 'Network error occurred');
        }
      }
    },
    onSuccess: data => {
      console.log('Booking created successfully:', data);

      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });
    },
    onError: error => {
      console.error('Create booking failed:', error);
    },
  });
};

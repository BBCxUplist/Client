import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface Booking {
  id: string;
  userId: string;
  artistId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  activeEnquiryId: string | null;
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

interface GetBookingsResponse {
  success: boolean;
  message: string;
  data: Booking[];
}

export const useGetBookings = () => {
  return useQuery<GetBookingsResponse, Error>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await apiClient.get<GetBookingsResponse>('/bookings');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

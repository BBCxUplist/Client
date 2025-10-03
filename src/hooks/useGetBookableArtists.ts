import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { AllArtistsResponse } from '../types/api';

interface UseGetBookableArtistsParams {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export const useGetBookableArtists = ({
  page = 1,
  limit = 12,
  enabled = true,
}: UseGetBookableArtistsParams = {}) => {
  return useQuery({
    queryKey: ['bookable-artists', page, limit],
    queryFn: async () => {
      const response = await apiClient.get(
        `/artists/bookable?limit=${limit}&page=${page}`
      );
      return response.data as AllArtistsResponse;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

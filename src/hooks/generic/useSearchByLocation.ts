import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import type { AllArtistsResponse } from '../../types/api';

interface UseSearchByLocationParams {
  location: string;
  page?: number;
  limit?: number;
  isOnlyBookable?: boolean;
  enabled?: boolean;
}

export const useSearchByLocation = ({
  location,
  page = 1,
  limit = 12,
  isOnlyBookable = false,
  enabled = true,
}: UseSearchByLocationParams) => {
  return useQuery({
    queryKey: ['search-by-location', location, page, limit, isOnlyBookable],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('location', location);
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (isOnlyBookable) {
        params.set('isOnlyBookable', 'true');
      }

      const response = await apiClient.get(
        `/artists/search/location?${params.toString()}`
      );
      return response.data as AllArtistsResponse;
    },
    enabled: enabled && location.trim().length >= 4, // Location requires min 4 characters
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

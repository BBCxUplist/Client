import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import type { AllArtistsResponse } from '../../types/api';

interface UseSearchByNameParams {
  query: string;
  page?: number;
  limit?: number;
  isOnlyBookable?: boolean;
  enabled?: boolean;
}

export const useSearchByName = ({
  query,
  page = 1,
  limit = 12,
  isOnlyBookable = false,
  enabled = true,
}: UseSearchByNameParams) => {
  return useQuery({
    queryKey: ['search-by-name', query, page, limit, isOnlyBookable],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('q', query.trim());
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (isOnlyBookable) {
        params.set('isOnlyBookable', 'true');
      }

      const response = await apiClient.get(
        `/artists/search?${params.toString()}`
      );
      return response.data as AllArtistsResponse;
    },
    enabled: enabled && !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

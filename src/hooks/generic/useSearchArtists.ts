import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import type { AllArtistsResponse } from '../../types/api';

interface UseSearchArtistsParams {
  query: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export const useSearchArtists = ({
  query,
  page = 1,
  limit = 12,
  enabled = true,
}: UseSearchArtistsParams) => {
  return useQuery({
    queryKey: ['search-artists', query, page, limit],
    queryFn: async () => {
      const response = await apiClient.get(
        `/artists/search?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}`
      );
      return response.data as AllArtistsResponse;
    },
    enabled: enabled && !!query.trim(), // Only run query if enabled and there's a search term
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

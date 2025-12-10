import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import type { AllArtistsResponse } from '../../types/api';

interface UseSearchByGenreParams {
  genre: string;
  page?: number;
  limit?: number;
  isOnlyBookable?: boolean;
  enabled?: boolean;
}

export const useSearchByGenre = ({
  genre,
  page = 1,
  limit = 12,
  isOnlyBookable = false,
  enabled = true,
}: UseSearchByGenreParams) => {
  return useQuery({
    queryKey: ['search-by-genre', genre, page, limit, isOnlyBookable],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('genre', genre);
      params.set('page', page.toString());
      params.set('limit', limit.toString());
      if (isOnlyBookable) {
        params.set('isOnlyBookable', 'true');
      }

      const response = await apiClient.get(
        `/artists/search/genre?${params.toString()}`
      );
      return response.data as AllArtistsResponse;
    },
    enabled: enabled && !!genre.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

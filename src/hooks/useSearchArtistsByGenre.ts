import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { AllArtistsResponse } from '../types/api';

interface UseSearchArtistsByGenreParams {
  genre: string;
  page?: number;
  limit?: number;
}

export const useSearchArtistsByGenre = ({
  genre,
  page = 1,
  limit = 12,
}: UseSearchArtistsByGenreParams) => {
  return useQuery({
    queryKey: ['search-artists-by-genre', genre, page, limit],
    queryFn: async () => {
      const response = await apiClient.get(
        `/artists/search/genre?genre=${encodeURIComponent(genre)}&limit=${limit}&page=${page}`
      );
      return response.data as AllArtistsResponse;
    },
    enabled: !!genre.trim(), // Only run query if there's a genre
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

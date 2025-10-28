import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import type { AllArtistsResponse } from '../../types/api';

interface UseAdvancedSearchArtistsParams {
  query: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
  location?: string;
  genres?: string[];
  minPrice?: number;
  maxPrice?: number;
  isBookable?: boolean;
  isAvailable?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export const useAdvancedSearchArtists = ({
  query,
  page = 1,
  limit = 12,
  enabled = true,
  location,
  genres = [],
  minPrice,
  maxPrice,
  isBookable,
  isAvailable,
  sortBy = 'name',
  sortOrder = 'asc',
}: UseAdvancedSearchArtistsParams) => {
  return useQuery({
    queryKey: [
      'advanced-search-artists',
      query,
      page,
      limit,
      location,
      genres,
      minPrice,
      maxPrice,
      isBookable,
      isAvailable,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        page: page.toString(),
        sortBy,
        sortOrder,
      });

      // Add location filter if provided and meets minimum length requirement
      if (location && location.trim().length >= 4) {
        params.append('location', location.trim());
      }

      // Add genre filters if provided
      if (genres.length > 0) {
        genres.forEach(genre => {
          if (genre.trim()) {
            params.append('genre', genre.trim());
          }
        });
      }

      // Add price range filters
      if (minPrice !== undefined && minPrice > 0) {
        params.append('minPrice', minPrice.toString());
      }
      if (maxPrice !== undefined && maxPrice > 0) {
        params.append('maxPrice', maxPrice.toString());
      }

      // Add boolean filters
      if (isBookable !== undefined) {
        params.append('isBookable', isBookable.toString());
      }
      if (isAvailable !== undefined) {
        params.append('isAvailable', isAvailable.toString());
      }

      const response = await apiClient.get(
        `/artists/search?${params.toString()}`
      );
      return response.data as AllArtistsResponse;
    },
    enabled: enabled && !!query.trim(), // Only run query if enabled and there's a search term
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

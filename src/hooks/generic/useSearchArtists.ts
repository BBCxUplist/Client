import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import {
  buildSearchQuery,
  createSearchCacheKey,
  sanitizeSearchQuery,
  validateSearchParams,
} from '../../lib/searchUtils';
import type { AllArtistsResponse } from '../../types/api';

interface UseSearchArtistsParams {
  query: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
  location?: string;
  genres?: string[];
}

export const useSearchArtists = ({
  query,
  page = 1,
  limit = 12,
  enabled = true,
  location,
  genres = [],
}: UseSearchArtistsParams) => {
  // Sanitize and validate search parameters
  const sanitizedQuery = sanitizeSearchQuery(query);
  const searchFilters = {
    query: sanitizedQuery,
    location,
    genres,
  };

  // Validate search parameters
  const validationErrors = validateSearchParams(searchFilters);

  return useQuery({
    queryKey: createSearchCacheKey(
      'search-artists',
      searchFilters,
      page,
      limit
    ),
    queryFn: async () => {
      // Build query parameters using utility function
      const params = buildSearchQuery(searchFilters);
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      const response = await apiClient.get(
        `/artists/search?${params.toString()}`
      );
      return response.data as AllArtistsResponse;
    },
    enabled:
      enabled && !!sanitizedQuery.trim() && validationErrors.length === 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    retry: (failureCount, _error) => {
      // Don't retry on validation errors
      if (validationErrors.length > 0) return false;
      // Retry up to 3 times for network errors
      return failureCount < 3;
    },
  });
};

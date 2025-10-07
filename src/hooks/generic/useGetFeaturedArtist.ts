import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import type { FeaturedArtistsResponse } from '../../types/api';

export const useGetFeaturedArtist = () => {
  return useQuery({
    queryKey: ['featured-artists'],
    queryFn: async () => {
      const response = await apiClient.get('/artists/featured');
      return response.data as FeaturedArtistsResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

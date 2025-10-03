import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import type { Artist } from '../types/api';

interface ArtistResponse {
  success: boolean;
  message: string;
  data: Artist;
}

export const useGetArtist = (username: string) => {
  return useQuery({
    queryKey: ['artist', username],
    queryFn: async () => {
      const response = await apiClient.get(`/artists/username/${username}`);
      return response.data as ArtistResponse;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

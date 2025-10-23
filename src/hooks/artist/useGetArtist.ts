import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { useStore } from '@/stores/store';
import type { Artist } from '../../types/api';
import type { ConsolidatedUser } from '@/types/store';

interface ArtistResponse {
  success: boolean;
  message: string;
  data: Artist;
}

export const useGetArtist = (username: string) => {
  const { user: currentUser, setUser } = useStore();

  const query = useQuery({
    queryKey: ['artist', username],
    queryFn: async () => {
      const response = await apiClient.get(`/artists/username/${username}`);
      return response.data as ArtistResponse;
    },
    enabled: !!username,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Update store state when artist data is fetched
  useEffect(() => {
    if (query.data?.success && query.data.data && currentUser) {
      const apiData = query.data.data;

      // Only update store if the fetched artist is the current logged-in user
      if (currentUser.id === apiData.id) {
        if (!currentUser.username && !currentUser.slug) {
          const updatedUser: ConsolidatedUser = {
            ...currentUser,
            ...apiData,
            email: currentUser.email,
            name: currentUser.name,
            role: apiData.role as 'user' | 'artist' | 'admin',
            appealStatus: apiData.appealStatus as
              | 'pending'
              | 'approved'
              | 'rejected',
          };
          setUser(updatedUser);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return query;
};

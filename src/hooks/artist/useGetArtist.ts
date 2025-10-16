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
      // Only update if we don't already have the backend data to prevent infinite loops
      if (!currentUser.username && !currentUser.slug) {
        // Merge the fetched artist data with current user state
        const updatedUser: ConsolidatedUser = {
          ...currentUser,
          ...query.data.data,
          // Ensure we keep the original email and name from Supabase auth
          email: currentUser.email,
          name: currentUser.name,
          // Cast role to the correct type
          role: query.data.data.role as 'user' | 'artist' | 'admin',
          // Cast appealStatus to the correct type
          appealStatus: query.data.data.appealStatus as
            | 'pending'
            | 'approved'
            | 'rejected',
        };
        setUser(updatedUser);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]); // Only depend on query.data to prevent infinite loops

  return query;
};

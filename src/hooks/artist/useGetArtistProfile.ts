import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useStore } from '@/stores/store';
import type { ConsolidatedUser } from '@/types/store';

interface ArtistProfileResponse {
  success: boolean;
  message: string;
  data: ConsolidatedUser;
}

export const useGetArtistProfile = () => {
  const { isAuthenticated, user: currentUser, setUser } = useStore();

  const query = useQuery<ArtistProfileResponse, Error>({
    queryKey: ['artist', 'profile'],
    queryFn: async () => {
      const response =
        await apiClient.get<ArtistProfileResponse>('/artists/profile');
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's an authentication error
      if (
        error.message?.includes('401') ||
        error.message?.includes('not authenticated')
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Update store state when artist profile data is fetched
  useEffect(() => {
    if (query.data?.success && query.data.data && currentUser) {
      const apiData = query.data.data;

      // Only update store if the fetched data is for the current logged-in user
      if (currentUser.id === apiData.id) {
        if (!currentUser.username && !currentUser.slug) {
          const updatedUser: ConsolidatedUser = {
            ...currentUser,
            ...apiData,
            email: currentUser.email,
            name: currentUser.name,
            avatar: apiData.avatar || undefined,
            bio: apiData.bio || undefined,
            phone: apiData.phone || undefined,
            location: apiData.location || undefined,
            displayName: apiData.displayName || undefined,
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

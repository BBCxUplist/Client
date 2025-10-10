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
      // Only update if we don't already have the backend data to prevent infinite loops
      if (!currentUser.username && !currentUser.slug) {
        // Merge the fetched artist data with current user state
        const apiData = query.data.data;
        const updatedUser: ConsolidatedUser = {
          ...currentUser,
          ...apiData,
          // Ensure we keep the original email and name from Supabase auth
          email: currentUser.email,
          name: currentUser.name,
          // Handle null values properly
          avatar: apiData.avatar || undefined,
          bio: apiData.bio || undefined,
          phone: apiData.phone || undefined,
          location: apiData.location || undefined,
          displayName: apiData.displayName || undefined,
          // Cast appealStatus to the correct type
          appealStatus: apiData.appealStatus as
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

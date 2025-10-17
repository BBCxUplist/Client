import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { useStore } from '@/stores/store';

interface UpdateArtistProfileData {
  bio?: string;
  displayName?: string;
  username?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  socials?: {
    twitter?: string;
    instagram?: string;
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
  };
  genres?: string[];
  price?: number;
  embeds?: {
    youtube?: string[];
    soundcloud?: string[];
    spotify?: string[];
    custom?: { title: string; url: string }[];
  };
}

interface UpdateArtistProfileResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useUpdateArtistProfile = () => {
  const { user, setUser } = useStore();
  const queryClient = useQueryClient();

  return useMutation<
    UpdateArtistProfileResponse,
    Error,
    UpdateArtistProfileData
  >({
    mutationFn: async profileData => {
      const response = await apiClient.patch<UpdateArtistProfileResponse>(
        '/artists/update-profile',
        profileData
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log('Profile updated successfully:', data);

      // Update user data in state with the new data
      if (user) {
        const updatedUser = {
          ...user,
          ...variables,
        };
        setUser(updatedUser);
      }

      // Invalidate and refetch artist data
      if (user?.email) {
        queryClient.invalidateQueries({
          queryKey: ['artist', 'email', user.email],
        });
      }

      // Invalidate user profile to refresh saved artists and other profile data
      queryClient.invalidateQueries({
        queryKey: ['user', 'profile'],
      });

      // Invalidate artist profile queries
      queryClient.invalidateQueries({
        queryKey: ['artist'],
      });
    },
    onError: error => {
      console.error('Profile update failed:', error);
    },
  });
};

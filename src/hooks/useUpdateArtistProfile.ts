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
}

interface UpdateArtistProfileResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useUpdateArtistProfile = () => {
  const { accessToken, user, setArtistData, artistData } = useStore();
  const queryClient = useQueryClient();

  return useMutation<
    UpdateArtistProfileResponse,
    Error,
    UpdateArtistProfileData
  >({
    mutationFn: async profileData => {
      const response = await apiClient.patch<UpdateArtistProfileResponse>(
        '/artists/update-profile',
        profileData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log('Profile updated successfully:', data);

      // Update artist data in state with the new data
      if (artistData) {
        const updatedArtistData = {
          ...artistData,
          ...variables,
        };
        setArtistData(updatedArtistData);
      }

      // Invalidate and refetch artist data
      if (user?.email) {
        queryClient.invalidateQueries({
          queryKey: ['artist', 'email', user.email],
        });
      }
    },
    onError: error => {
      console.error('Profile update failed:', error);
    },
  });
};

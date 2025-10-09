import { useMutation } from '@tanstack/react-query';
import { useStore } from '@/stores/store';
import { useRegisterAPI } from './useRegisterAPI';
import type { User } from '@/types/auth';

interface ArtistSelectionData {
  user: User;
  accessToken: string;
  refreshToken: string;
  isArtist: boolean;
}

export const useArtistSelection = () => {
  const { setAuth } = useStore();
  const registerAPIMutation = useRegisterAPI();

  return useMutation<any, any, ArtistSelectionData>({
    mutationFn: async ({ user, accessToken, refreshToken, isArtist }) => {
      try {
        // Call the register API to set the user's role
        const result = await registerAPIMutation.mutateAsync({
          data: {
            useremail: user.email || '',
            role: isArtist ? 'artist' : 'user',
            displayName: user.name || '',
          },
          token: accessToken,
        });

        if (result.success) {
          // Update user data with the selected role
          const updatedUser: User = {
            ...user,
            role: isArtist ? 'artist' : 'user',
          };

          // Set authentication state in Zustand
          setAuth(updatedUser, accessToken, refreshToken);

          return result;
        } else {
          throw new Error(result.message || 'Failed to set user role');
        }
      } catch (error: any) {
        // If user already exists, just set the auth state with the existing role
        if (error.message?.includes('User already exists')) {
          const updatedUser: User = {
            ...user,
            role: isArtist ? 'artist' : 'user',
          };
          setAuth(updatedUser, accessToken, refreshToken);
          return { success: true, message: 'User role updated' };
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Auth state is set in the mutation function
    },
    onError: error => {
      console.error('Artist selection error:', error);
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';
import type { Artist } from '@/types/api';

interface SaveArtistResponse {
  success: boolean;
  message: string;
}

interface UseSaveArtistProps {
  artistId: string;
  artistData?: Artist; // Pass the artist data for optimistic update
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useSaveArtist = ({
  artistId,
  artistData,
  onSuccess,
  onError,
}: UseSaveArtistProps) => {
  const queryClient = useQueryClient();

  const saveArtistMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/users/save-artist/${artistId}`);
      return response.data;
    },
    // Optimistic update: update the UI immediately before API call completes
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['user', 'profile'] });

      // Snapshot the previous value for rollback
      const previousUserData = queryClient.getQueryData(['user', 'profile']);

      // Optimistically update the cache
      if (artistData) {
        queryClient.setQueryData(['user', 'profile'], (old: any) => {
          if (!old?.data) return old;

          const currentSavedArtists = old.data.savedArtists || [];
          // Add the artist to saved artists if not already there
          const isAlreadySaved = currentSavedArtists.some(
            (a: Artist) => a.id === artistId
          );

          if (!isAlreadySaved) {
            return {
              ...old,
              data: {
                ...old.data,
                savedArtists: [...currentSavedArtists, artistData],
              },
            };
          }
          return old;
        });
      }

      return { previousUserData };
    },
    onSuccess: (data: SaveArtistResponse) => {
      if (data.success) {
        toast.success('Artist saved!');
        onSuccess?.();
        // Don't invalidate queries - we already updated the cache optimistically
      } else {
        toast.error(data.message || 'Failed to save artist');
        // Rollback on failure
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      }
    },
    onError: (error: any, _variables, context) => {
      console.error('Error saving artist:', error);
      toast.error('Failed to save artist. Please try again.');

      // Rollback to previous state
      if (context?.previousUserData) {
        queryClient.setQueryData(['user', 'profile'], context.previousUserData);
      }

      onError?.(error);
    },
  });

  const unsaveArtistMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(`/users/save-artist/${artistId}`);
      return response.data;
    },
    // Optimistic update: update the UI immediately before API call completes
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['user', 'profile'] });

      // Snapshot the previous value for rollback
      const previousUserData = queryClient.getQueryData(['user', 'profile']);

      // Optimistically update the cache
      queryClient.setQueryData(['user', 'profile'], (old: any) => {
        if (!old?.data) return old;

        const currentSavedArtists = old.data.savedArtists || [];
        // Remove the artist from saved artists
        return {
          ...old,
          data: {
            ...old.data,
            savedArtists: currentSavedArtists.filter(
              (a: Artist) => a.id !== artistId
            ),
          },
        };
      });

      return { previousUserData };
    },
    onSuccess: (data: SaveArtistResponse) => {
      if (data.success) {
        toast.success('Artist removed from your favorites!');
        onSuccess?.();
        // Don't invalidate queries - we already updated the cache optimistically
      } else {
        toast.error(data.message || 'Failed to remove artist');
        // Rollback on failure
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      }
    },
    onError: (error: any, _variables, context) => {
      console.error('Error removing artist:', error);
      toast.error('Failed to remove artist. Please try again.');

      // Rollback to previous state
      if (context?.previousUserData) {
        queryClient.setQueryData(['user', 'profile'], context.previousUserData);
      }

      onError?.(error);
    },
  });

  return {
    saveArtist: saveArtistMutation.mutate,
    unsaveArtist: unsaveArtistMutation.mutate,
    isLoading: saveArtistMutation.isPending || unsaveArtistMutation.isPending,
  };
};

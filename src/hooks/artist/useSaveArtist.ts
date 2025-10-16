import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

interface SaveArtistResponse {
  success: boolean;
  message: string;
}

interface UseSaveArtistProps {
  artistId: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useSaveArtist = ({
  artistId,
  onSuccess,
  onError,
}: UseSaveArtistProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const queryClient = useQueryClient();

  const saveArtistMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/users/save-artist/${artistId}`);
      return response.data;
    },
    onSuccess: (data: SaveArtistResponse) => {
      if (data.success) {
        setIsSaved(true);
        toast.success('Artist saved to your favorites!');
        onSuccess?.();
        // Invalidate relevant queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['saved-artists'] });
      } else {
        toast.error(data.message || 'Failed to save artist');
      }
    },
    onError: (error: any) => {
      console.error('Error saving artist:', error);
      toast.error('Failed to save artist. Please try again.');
      onError?.(error);
    },
  });

  const unsaveArtistMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/users/save-artist/${artistId}`);
      return response.data;
    },
    onSuccess: (data: SaveArtistResponse) => {
      if (data.success) {
        setIsSaved(false);
        toast.success('Artist removed from your favorites!');
        onSuccess?.();
        // Invalidate relevant queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['saved-artists'] });
      } else {
        toast.error(data.message || 'Failed to remove artist');
      }
    },
    onError: (error: any) => {
      console.error('Error removing artist:', error);
      toast.error('Failed to remove artist. Please try again.');
      onError?.(error);
    },
  });

  const toggleSave = () => {
    if (isSaved) {
      unsaveArtistMutation.mutate();
    } else {
      saveArtistMutation.mutate();
    }
  };

  return {
    isSaved,
    toggleSave,
    isLoading: saveArtistMutation.isPending || unsaveArtistMutation.isPending,
    saveArtist: saveArtistMutation.mutate,
    unsaveArtist: unsaveArtistMutation.mutate,
  };
};

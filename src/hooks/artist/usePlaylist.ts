import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

interface CreatePlaylistData {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  embeds: {
    youtube?: string[];
    spotify?: string[];
    soundcloud?: string[];
    custom?: { title: string; url: string }[];
  };
}

interface UpdatePlaylistData {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  embeds?: {
    youtube?: string[];
    spotify?: string[];
    soundcloud?: string[];
    custom?: { title: string; url: string }[];
  };
}

interface PlaylistResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    artistId: string;
    isActive: boolean;
    thumbnailUrl?: string;
    title: string;
    description?: string;
    saves: number;
    listens: number;
    embeds: {
      youtube?: string[];
      spotify?: string[];
      soundcloud?: string[];
      custom?: { title: string; url: string }[];
    };
    createdAt: string;
    updatedAt: string;
  };
}

interface UsePlaylistProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

// Create Playlist Hook
export const useCreatePlaylist = ({
  onSuccess,
  onError,
}: UsePlaylistProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation<PlaylistResponse, Error, CreatePlaylistData>({
    mutationFn: async (playlistData: CreatePlaylistData) => {
      const response = await apiClient.post('/artists/playlists', playlistData);
      return response.data;
    },
    onSuccess: (data: PlaylistResponse) => {
      if (data.success) {
        toast.success('Playlist created successfully!');
        onSuccess?.();

        // Invalidate profile queries to refresh playlist data
        queryClient.invalidateQueries({ queryKey: ['artist', 'profile'] });
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      } else {
        toast.error(data.message || 'Failed to create playlist');
      }
    },
    onError: (error: any) => {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist. Please try again.');
      onError?.(error);
    },
  });
};

// Update Playlist Hook
export const useUpdatePlaylist = ({
  onSuccess,
  onError,
}: UsePlaylistProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation<
    PlaylistResponse,
    Error,
    { playlistId: string; data: UpdatePlaylistData }
  >({
    mutationFn: async ({ playlistId, data }) => {
      const response = await apiClient.patch(
        `/artists/playlists/${playlistId}`,
        data
      );
      return response.data;
    },
    onSuccess: (data: PlaylistResponse) => {
      if (data.success) {
        toast.success('Playlist updated successfully!');
        onSuccess?.();

        // Invalidate profile queries to refresh playlist data
        queryClient.invalidateQueries({ queryKey: ['artist', 'profile'] });
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      } else {
        toast.error(data.message || 'Failed to update playlist');
      }
    },
    onError: (error: any) => {
      console.error('Error updating playlist:', error);
      toast.error('Failed to update playlist. Please try again.');
      onError?.(error);
    },
  });
};

// Delete Playlist Hook
export const useDeletePlaylist = ({
  onSuccess,
  onError,
}: UsePlaylistProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation<PlaylistResponse, Error, string>({
    mutationFn: async (playlistId: string) => {
      const response = await apiClient.delete(
        `/artists/playlists/${playlistId}`
      );
      return response.data;
    },
    onSuccess: (data: PlaylistResponse) => {
      if (data.success) {
        toast.success('Playlist deleted successfully!');
        onSuccess?.();

        // Invalidate profile queries to refresh playlist data
        queryClient.invalidateQueries({ queryKey: ['artist', 'profile'] });
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      } else {
        toast.error(data.message || 'Failed to delete playlist');
      }
    },
    onError: (error: any) => {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist. Please try again.');
      onError?.(error);
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

interface SetFeaturedArtistResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    featured: boolean;
  };
}

interface SetFeaturedArtistParams {
  artistId: string;
  featured: boolean;
}

export const useSetFeaturedArtist = () => {
  const queryClient = useQueryClient();

  return useMutation<SetFeaturedArtistResponse, Error, SetFeaturedArtistParams>(
    {
      mutationFn: async ({ artistId, featured }) => {
        const response = await apiClient.post<SetFeaturedArtistResponse>(
          `/admin/artists/${artistId}/featured`,
          { featured }
        );
        return response.data;
      },
      onSuccess: data => {
        toast.success(data.message || 'Artist featured status updated');
        queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        queryClient.invalidateQueries({ queryKey: ['artists'] });
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || 'Failed to update featured status'
        );
      },
    }
  );
};

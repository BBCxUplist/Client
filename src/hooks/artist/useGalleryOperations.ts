import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { useStore } from '@/stores/store';

interface AddGalleryPhotosData {
  photoUrls: string[];
}

interface AddGalleryPhotosResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface DeleteGalleryPhotoResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useAddGalleryPhotos = () => {
  const { user } = useStore();
  const queryClient = useQueryClient();

  return useMutation<AddGalleryPhotosResponse, Error, AddGalleryPhotosData>({
    mutationFn: async data => {
      const response = await apiClient.post<AddGalleryPhotosResponse>(
        '/artists/gallery',
        data
      );
      return response.data;
    },
    onSuccess: data => {
      console.log('Gallery photos added successfully:', data);

      // Invalidate and refetch artist data
      if (user?.email) {
        queryClient.invalidateQueries({
          queryKey: ['artist', 'email', user.email],
        });
      }
    },
    onError: error => {
      console.error('Add gallery photos failed:', error);
    },
  });
};

export const useDeleteGalleryPhoto = () => {
  const { user } = useStore();
  const queryClient = useQueryClient();

  return useMutation<DeleteGalleryPhotoResponse, Error, number>({
    mutationFn: async photoIndex => {
      const response = await apiClient.delete<DeleteGalleryPhotoResponse>(
        `/artists/gallery/${photoIndex}`
      );
      return response.data;
    },
    onSuccess: data => {
      console.log('Gallery photo deleted successfully:', data);

      // Invalidate and refetch artist data
      if (user?.email) {
        queryClient.invalidateQueries({
          queryKey: ['artist', 'email', user.email],
        });
      }
    },
    onError: error => {
      console.error('Delete gallery photo failed:', error);
    },
  });
};

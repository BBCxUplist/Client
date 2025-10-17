import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

interface CreateRiderData {
  name: string;
  status: 'included' | 'to_be_provided';
}

interface UpdateRiderData {
  name?: string;
  status?: 'included' | 'to_be_provided';
}

interface RiderResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    artistId: string;
    name: string;
    status: 'included' | 'to_be_provided';
    createdAt: string;
    updatedAt: string;
  };
}

interface UseRiderProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

// Create Rider Hook
export const useCreateRider = ({ onSuccess, onError }: UseRiderProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation<RiderResponse, Error, CreateRiderData>({
    mutationFn: async (riderData: CreateRiderData) => {
      const response = await apiClient.post('/artists/riders', riderData);
      return response.data;
    },
    onSuccess: (data: RiderResponse) => {
      if (data.success) {
        toast.success('Rider item created successfully!');
        onSuccess?.();

        // Invalidate profile queries to refresh rider data
        queryClient.invalidateQueries({ queryKey: ['artist', 'profile'] });
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      } else {
        toast.error(data.message || 'Failed to create rider item');
      }
    },
    onError: (error: any) => {
      console.error('Error creating rider item:', error);
      toast.error('Failed to create rider item. Please try again.');
      onError?.(error);
    },
  });
};

// Update Rider Hook
export const useUpdateRider = ({ onSuccess, onError }: UseRiderProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation<
    RiderResponse,
    Error,
    { riderId: string; data: UpdateRiderData }
  >({
    mutationFn: async ({ riderId, data }) => {
      const response = await apiClient.patch(
        `/artists/riders/${riderId}`,
        data
      );
      return response.data;
    },
    onSuccess: (data: RiderResponse) => {
      if (data.success) {
        toast.success('Rider item updated successfully!');
        onSuccess?.();

        // Invalidate profile queries to refresh rider data
        queryClient.invalidateQueries({ queryKey: ['artist', 'profile'] });
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      } else {
        toast.error(data.message || 'Failed to update rider item');
      }
    },
    onError: (error: any) => {
      console.error('Error updating rider item:', error);
      toast.error('Failed to update rider item. Please try again.');
      onError?.(error);
    },
  });
};

// Delete Rider Hook
export const useDeleteRider = ({ onSuccess, onError }: UseRiderProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation<RiderResponse, Error, string>({
    mutationFn: async (riderId: string) => {
      const response = await apiClient.delete(`/artists/riders/${riderId}`);
      return response.data;
    },
    onSuccess: (data: RiderResponse) => {
      if (data.success) {
        toast.success('Rider item deleted successfully!');
        onSuccess?.();

        // Invalidate profile queries to refresh rider data
        queryClient.invalidateQueries({ queryKey: ['artist', 'profile'] });
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      } else {
        toast.error(data.message || 'Failed to delete rider item');
      }
    },
    onError: (error: any) => {
      console.error('Error deleting rider item:', error);
      toast.error('Failed to delete rider item. Please try again.');
      onError?.(error);
    },
  });
};

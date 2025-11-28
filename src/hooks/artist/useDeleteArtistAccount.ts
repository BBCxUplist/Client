import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { useStore } from '@/stores/store';
import toast from 'react-hot-toast';

interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

export const useDeleteArtistAccount = () => {
  const { logout } = useStore();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete<DeleteAccountResponse>(
        '/artists/delete-account'
      );
      return response.data;
    },
    onSuccess: async data => {
      if (data.success) {
        toast.success(data.message || 'Account deleted successfully');
        // Logout and redirect to home
        await logout();
        window.location.href = '/';
      } else {
        toast.error(data.message || 'Failed to delete account');
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete account. Please try again.';
      toast.error(errorMessage);
    },
  });
};

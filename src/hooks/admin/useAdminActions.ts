import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

interface AdminActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface PromoteUserData {
  role: 'artist' | 'admin';
  artistType?: 'dj' | 'music_artist' | 'other' | 'none';
}

export const useApproveUser = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminActionResponse, Error, string>({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch<AdminActionResponse>(
        `/admin/approve/${userId}`
      );
      return response.data;
    },
    onSuccess: data => {
      toast.success(data.message || 'User approved successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve user');
    },
  });
};

export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminActionResponse, Error, string>({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch<AdminActionResponse>(
        `/admin/ban/${userId}`
      );
      return response.data;
    },
    onSuccess: data => {
      toast.success(data.message || 'User banned successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to ban user');
    },
  });
};

export const useRejectUser = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminActionResponse, Error, string>({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch<AdminActionResponse>(
        `/admin/reject/${userId}`
      );
      return response.data;
    },
    onSuccess: data => {
      toast.success(data.message || 'User rejected successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject user');
    },
  });
};

export const usePromoteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AdminActionResponse,
    Error,
    { userId: string; data: PromoteUserData }
  >({
    mutationFn: async ({ userId, data }) => {
      const response = await apiClient.patch<AdminActionResponse>(
        `/admin/promote/${userId}`,
        data
      );
      return response.data;
    },
    onSuccess: data => {
      toast.success(data.message || 'User promoted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to promote user');
    },
  });
};

export const useDemoteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminActionResponse, Error, string>({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch<AdminActionResponse>(
        `/admin/demote/${userId}`
      );
      return response.data;
    },
    onSuccess: data => {
      toast.success(data.message || 'User demoted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to demote user');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminActionResponse, Error, string>({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch<AdminActionResponse>(
        `/admin/delete/${userId}`
      );
      return response.data;
    },
    onSuccess: data => {
      toast.success(data.message || 'User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
};

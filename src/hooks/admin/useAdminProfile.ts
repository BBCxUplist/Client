import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface AdminProfile {
  id: string;
  username: string;
  role: string;
  email: string;
  displayName: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetAdminProfileResponse {
  success: boolean;
  message: string;
  data: {
    admin: AdminProfile;
  };
}

export const useAdminProfile = () => {
  return useQuery<GetAdminProfileResponse, Error>({
    queryKey: ['admin', 'profile'],
    queryFn: async () => {
      const response =
        await apiClient.get<GetAdminProfileResponse>('/admin/profile');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

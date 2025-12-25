import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface AdminUser {
  id: string;
  role: string;
  username: string;
  useremail: string;
  displayName: string | null;
  avatar: string | null;
  isActive: boolean;
  isAdmin: boolean;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetAdminUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUser[];
    page: number;
    limit: number;
  };
}

interface UseGetAdminUsersParams {
  limit?: number;
  page?: number;
}

export const useGetAdminUsers = (params: UseGetAdminUsersParams = {}) => {
  const { limit = 100, page = 1 } = params;

  return useQuery<GetAdminUsersResponse, Error>({
    queryKey: ['admin', 'users', 'admins', { limit, page }],
    queryFn: async () => {
      const response = await apiClient.get<GetAdminUsersResponse>(
        `/admin/users?role=admin&limit=${limit}&page=${page}`
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

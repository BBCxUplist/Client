import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { useStore } from '@/stores/store';
import type { UserByEmailResponse } from '@/types/api';

interface UseGetUserByEmailProps {
  email: string;
  enabled?: boolean;
}

export const useGetUserByEmail = ({
  email,
  enabled = true,
}: UseGetUserByEmailProps) => {
  const { isAuthenticated: storeIsAuthenticated, accessToken } = useStore();

  return useQuery<UserByEmailResponse, Error>({
    queryKey: ['user', 'email', email],
    queryFn: async () => {
      // Check if user is authenticated and has a token
      if (!storeIsAuthenticated || !accessToken) {
        throw new Error('User not authenticated');
      }

      const response = await apiClient.get<UserByEmailResponse>(
        `/users/email/${email}`
      );
      return response.data;
    },
    enabled: enabled && !!email && storeIsAuthenticated && !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's an authentication error
      if (error.message === 'User not authenticated') {
        return false;
      }
      return failureCount < 2;
    },
  });
};

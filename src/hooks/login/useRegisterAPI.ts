import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import type { AuthError } from '@/types/auth';

export interface RegisterAPIData {
  useremail: string;
  role: 'artist' | 'user';
  displayName: string;
}

export interface RegisterAPIResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const useRegisterAPI = () => {
  return useMutation<
    RegisterAPIResponse,
    AuthError,
    { data: RegisterAPIData; token: string }
  >({
    mutationFn: async ({ data, token }) => {
      try {
        const response = await apiClient.post('/users/register', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Return the response data even if success is false
        // This allows us to handle "User already exists" responses properly
        return response.data;
      } catch (error: any) {
        // Handle actual HTTP errors (network issues, server errors, etc.)
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Registration failed';
        const status = error.response?.status || 500;

        throw {
          message: errorMessage,
          status,
          code: error.response?.data?.code || 'REGISTER_API_ERROR',
        };
      }
    },
    onSuccess: () => {
      // API call completed successfully
    },
    onError: () => {
      // Handle API errors
    },
  });
};

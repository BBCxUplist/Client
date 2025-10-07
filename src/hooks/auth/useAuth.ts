import { useMutation, useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/authService';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
} from '@/lib/authService';

/**
 * Hook for user login
 */
export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async credentials => {
      return await authService.login(credentials);
    },
    onError: error => {
      console.error('Login failed:', error);
    },
  });
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async userData => {
      return await authService.register(userData);
    },
    onError: error => {
      console.error('Registration failed:', error);
    },
  });
};

/**
 * Hook for token refresh
 */
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async () => {
      return await authService.refreshToken();
    },
    onError: error => {
      console.error('Token refresh failed:', error);
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      return await authService.logout();
    },
    onError: error => {
      console.error('Logout failed:', error);
    },
  });
};

/**
 * Hook to verify token validity
 */
export const useVerifyToken = () => {
  return useQuery({
    queryKey: ['verify-token'],
    queryFn: async () => {
      return await authService.verifyToken();
    },
    enabled: authService.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get current authentication status
 */
export const useAuthStatus = () => {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      return {
        isAuthenticated: authService.isAuthenticated(),
        user: authService.getCurrentUser(),
        isTokenExpired: authService.isTokenExpired(),
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
};

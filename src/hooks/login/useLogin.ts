import { useMutation } from '@tanstack/react-query';
import { login, loginWithGoogle } from '@/lib/supabase';
import type {
  LoginData,
  LoginResponse,
  AuthError,
  UseLoginReturn,
} from '@/types/auth';

export const useLogin = (): UseLoginReturn => {
  return useMutation<LoginResponse, AuthError, LoginData>({
    mutationFn: async ({ email, password }) => {
      try {
        const result = await login(email, password);
        return result;
      } catch (error: any) {
        // Transform Supabase errors into a consistent format
        throw {
          message: error.message || 'Login failed',
          status: error.status || 400,
          code: error.code,
        };
      }
    },
    onSuccess: () => {},
    onError: () => {
      // Handle login errors
    },
  });
};

export const useGoogleLogin = () => {
  return useMutation<any, AuthError, void>({
    mutationFn: async () => {
      try {
        const result = await loginWithGoogle();
        return result;
      } catch (error: any) {
        throw {
          message: error.message || 'Google login failed',
          status: error.status || 400,
          code: error.code,
        };
      }
    },
    onSuccess: () => {},
    onError: () => {
      // Handle Google login errors
    },
  });
};

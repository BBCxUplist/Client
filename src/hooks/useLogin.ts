import { useMutation } from '@tanstack/react-query';
import { login, loginWithGoogle } from '@/lib/supabase';
import { useStore } from '@/stores/store';
import type {
  LoginData,
  LoginResponse,
  AuthError,
  UseLoginReturn,
  User,
} from '@/types/auth';

export const useLogin = (): UseLoginReturn => {
  const { setAuth } = useStore();

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
    onSuccess: data => {
      // Extract user data and role from the response
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || '',
        role: data.user.user_metadata?.role || 'user',
        created_at: data.user.created_at,
        updated_at: data.user.updated_at,
      };

      // Set authentication state in Zustand
      setAuth(userData, data.session.access_token, data.session.refresh_token);
    },
    onError: () => {
      // Handle login errors
    },
  });
};

export const useGoogleLogin = () => {
  const { setAuth } = useStore();

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
    onSuccess: data => {
      // Extract user data and role from the response
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || '',
        role: data.user.user_metadata?.role || 'user',
        created_at: data.user.created_at,
        updated_at: data.user.updated_at,
      };

      // Set authentication state in Zustand
      setAuth(userData, data.session.access_token, data.session.refresh_token);
    },
    onError: () => {
      // Handle Google login errors
    },
  });
};

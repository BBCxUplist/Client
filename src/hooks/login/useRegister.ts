import { useMutation } from '@tanstack/react-query';
import { register } from '@/lib/supabase';
import type {
  RegisterData,
  RegisterResponse,
  AuthError,
  UseRegisterReturn,
} from '@/types/auth';

export const useRegister = (): UseRegisterReturn => {
  return useMutation<RegisterResponse, AuthError, RegisterData>({
    mutationFn: async ({ email, password, name, role }) => {
      try {
        const result = await register(email, password, {
          displayName: name, // Send name as displayName
          role,
        });

        return result;
      } catch (error: any) {
        // Transform Supabase errors into a consistent format
        throw {
          message: error.message || 'Registration failed',
          status: error.status || 400,
        };
      }
    },
    onSuccess: () => {
      // Registration completed successfully
    },
    onError: () => {
      // Handle registration errors
    },
  });
};

// Alternative hook with more detailed error handling
export const useRegisterWithValidation = (): UseRegisterReturn => {
  return useMutation<RegisterResponse, AuthError, RegisterData>({
    mutationFn: async ({ email, password, name, role }) => {
      // Client-side validation
      if (!email || !password || !name) {
        throw {
          message: 'All fields are required',
          status: 400,
        };
      }

      if (password.length < 6) {
        throw {
          message: 'Password must be at least 6 characters long',
          status: 400,
        };
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        throw {
          message: 'Please enter a valid email address',
          status: 400,
        };
      }

      try {
        const result = await register(email, password, {
          displayName: name, // Send name as displayName
          role,
        });

        return result;
      } catch (error: any) {
        // Handle specific Supabase errors
        let errorMessage = 'Registration failed';

        if (error.message?.includes('already registered')) {
          errorMessage =
            'An account with this email already exists. Please try signing in instead.';
        } else if (error.message?.includes('invalid email')) {
          errorMessage = 'Please enter a valid email address';
        } else if (error.message?.includes('password')) {
          errorMessage = 'Password does not meet requirements';
        } else if (error.message) {
          errorMessage = error.message;
        }

        throw {
          message: errorMessage,
          status: error.status || 400,
        };
      }
    },
    onSuccess: () => {
      // Registration completed successfully
    },
    onError: () => {
      // Handle registration errors
    },
  });
};

// Hook for checking if email is already registered
export const useCheckEmailAvailability = () => {
  return useMutation<boolean, AuthError, string>({
    mutationFn: async (_email: string) => {
      // This would typically call an API endpoint to check email availability
      // For now, we'll return true (available) since Supabase will handle duplicates
      return true;
    },
  });
};

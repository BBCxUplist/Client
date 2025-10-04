import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { AuthError } from '@/types/auth';

export interface OTPVerificationData {
  email: string;
  token: string;
}

export interface ResendOTPData {
  email: string;
  type: 'signup' | 'email_change';
}

export interface MagicLinkData {
  email: string;
  redirectTo?: string;
}

export const useOTPVerification = () => {
  return useMutation<any, AuthError, OTPVerificationData>({
    mutationFn: async ({ email, token }) => {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'email',
        });

        if (error) {
          throw {
            message: error.message || 'OTP verification failed',
            status: error.status || 400,
            code: error.code,
          };
        }

        return data;
      } catch (error: any) {
        throw {
          message: error.message || 'OTP verification failed',
          status: error.status || 400,
          code: error.code,
        };
      }
    },
    onSuccess: data => {
      console.log('OTP verification successful:', data);
    },
    onError: error => {
      console.error('OTP verification error:', error);
    },
  });
};

export const useResendOTP = () => {
  return useMutation<any, AuthError, ResendOTPData>({
    mutationFn: async ({ email, type }) => {
      try {
        const { data, error } = await supabase.auth.resend({
          type,
          email,
        });

        if (error) {
          throw {
            message: error.message || 'Failed to resend OTP',
            status: error.status || 400,
            code: error.code,
          };
        }

        return data;
      } catch (error: any) {
        throw {
          message: error.message || 'Failed to resend OTP',
          status: error.status || 400,
          code: error.code,
        };
      }
    },
    onSuccess: data => {
      console.log('OTP resent successfully:', data);
    },
    onError: error => {
      console.error('Resend OTP error:', error);
    },
  });
};

export const useMagicLink = () => {
  return useMutation<any, AuthError, MagicLinkData>({
    mutationFn: async ({ email, redirectTo }) => {
      try {
        const { data, error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo:
              redirectTo || `${window.location.origin}/auth?verified=true`,
          },
        });

        if (error) {
          throw {
            message: error.message || 'Failed to send magic link',
            status: error.status || 400,
            code: error.code,
          };
        }

        return data;
      } catch (error: any) {
        throw {
          message: error.message || 'Failed to send magic link',
          status: error.status || 400,
          code: error.code,
        };
      }
    },
    onSuccess: data => {
      console.log('Magic link sent successfully:', data);
    },
    onError: error => {
      console.error('Magic link error:', error);
    },
  });
};

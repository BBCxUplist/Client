import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/stores/store';
import { authService } from '@/lib/authService';
import { tokenCookies } from '@/lib/cookieUtils';

/**
 * Hook to handle authentication initialization on app startup
 * This validates the stored authentication state and cleans up invalid sessions
 */
export const useAuthInit = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, isAuthenticated, clearAuth } = useStore();

  const initializeAuth = useCallback(async () => {
    try {
      const accessToken = tokenCookies.getAccessToken();
      const refreshToken = tokenCookies.getRefreshToken();

      // If no tokens exist, clear any stale state and mark as initialized
      if (!accessToken && !refreshToken) {
        if (isAuthenticated || user) {
          clearAuth();
        }
        setIsInitialized(true);
        return;
      }

      // If we have tokens, validate them
      if (accessToken && refreshToken) {
        // If we have a valid user and tokens, just verify the token is not expired
        if (user && isAuthenticated) {
          const isTokenExpired = authService.isTokenExpired();

          if (isTokenExpired) {
            try {
              // Try to refresh the token
              await authService.refreshToken();
            } catch (error) {
              console.error('Token refresh failed:', error);
              clearAuth();
            }
          }
        } else {
          // No user data but have tokens - try to refresh to get user data
          try {
            await authService.refreshToken();
          } catch (error) {
            console.error('Token refresh failed:', error);
            clearAuth();
          }
        }
      } else if (accessToken && !refreshToken) {
        // We have access token but no refresh token, this is invalid
        clearAuth();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Don't automatically clear auth on general errors
    } finally {
      setIsInitialized(true);
    }
  }, [clearAuth, isAuthenticated, user]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return { isInitialized };
};

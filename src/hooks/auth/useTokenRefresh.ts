import { useEffect, useRef } from 'react';
import { authService } from '@/lib/authService';

interface UseTokenRefreshOptions {
  interval?: number; // Refresh interval in milliseconds (default: 15 minutes)
  enabled?: boolean; // Whether to enable automatic refresh (default: true)
}

/**
 * Hook to automatically refresh tokens at regular intervals
 */
export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const { interval = 15 * 60 * 1000, enabled = true } = options; // Default 15 minutes
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !authService.isAuthenticated()) {
      return;
    }

    const refreshToken = async () => {
      try {
        // Check if token is expired or will expire soon (within 5 minutes)
        if (authService.isTokenExpired()) {
          await authService.refreshToken();
        }
      } catch (error) {
        console.error('Automatic token refresh failed:', error);
        // If refresh fails, the auth service will handle logout
      }
    };

    // Set up interval for token refresh
    intervalRef.current = setInterval(refreshToken, interval);

    // Also refresh immediately if token is expired
    refreshToken();

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, enabled]);

  // Return function to manually refresh token
  const manualRefresh = async () => {
    try {
      await authService.refreshToken();
      return true;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  };

  return {
    manualRefresh,
  };
};

export default useTokenRefresh;

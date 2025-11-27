import { type ReactNode, useEffect } from 'react';
import { useStore } from '@/stores/store';
import { tokenCookies } from '@/lib/cookieUtils';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that ensures authentication state consistency
 */
const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, isAuthenticated, clearAuth } = useStore();

  useEffect(() => {
    // Simple check on mount - if we have user data but no tokens, clear the state
    const accessToken = tokenCookies.getAccessToken();
    const refreshToken = tokenCookies.getRefreshToken();

    if ((user || isAuthenticated) && (!accessToken || !refreshToken)) {
      clearAuth();
    }
  }, []); // Only run once on mount

  return <>{children}</>;
};

export default AuthProvider;

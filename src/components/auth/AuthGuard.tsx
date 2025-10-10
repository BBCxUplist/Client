import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/stores/store';
import { authService } from '@/lib/authService';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('user' | 'artist' | 'admin')[];
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = '/auth',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If authentication is not required, allow access
        if (!requireAuth) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Check if user is authenticated
        if (!isAuthenticated || !user) {
          // Store the current location to redirect back after login
          const currentPath = location.pathname + location.search;
          navigate(redirectTo, {
            state: { from: currentPath },
            replace: true,
          });
          return;
        }

        // Check if token is expired
        if (authService.isTokenExpired()) {
          try {
            // Try to refresh the token
            await authService.refreshToken();
          } catch (error) {
            // Refresh failed, redirect to login
            console.error('Token refresh failed:', error);
            navigate(redirectTo, {
              state: { from: location.pathname },
              replace: true,
            });
            return;
          }
        }

        // Check role-based access
        const userRole = user?.role;
        if (
          allowedRoles.length > 0 &&
          userRole &&
          !allowedRoles.includes(userRole)
        ) {
          // User doesn't have required role, redirect to unauthorized page
          navigate('/unauthorized', { replace: true });
          return;
        }

        // All checks passed
        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth guard error:', error);
        navigate(redirectTo, { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [
    isAuthenticated,
    user,
    location.pathname,
    navigate,
    requireAuth,
    allowedRoles,
    redirectTo,
  ]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4'></div>
          <p className='text-white/60'>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show children if authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Return null if not authorized (will redirect)
  return null;
};

export default AuthGuard;

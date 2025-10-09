import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/stores/store';
import { useArtistSelection } from '@/hooks/login/useArtistSelection';
import ArtistSelectionModal from './ArtistSelectionModal';
import type { User } from '@/types/auth';

const AuthStateListener = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, clearAuth } = useStore();
  const [showArtistSelection, setShowArtistSelection] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<{
    user: User;
    accessToken: string;
    refreshToken: string;
  } | null>(null);
  const artistSelectionMutation = useArtistSelection();

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const user = session.user;

        // Check if user already has a role set
        const userRole = user.user_metadata?.role;

        if (userRole) {
          // User already has a role, set auth state directly
          const userData: User = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
            role: userRole,
            created_at: user.created_at,
            updated_at: user.updated_at,
          };
          setAuth(userData, session.access_token, session.refresh_token);
        } else {
          // User doesn't have a role, show artist selection modal
          // Only show modal if not on auth page (to avoid conflicts with normal login flow)
          if (location.pathname !== '/auth') {
            setPendingUserData({
              user: {
                id: user.id,
                email: user.email || '',
                name: user.user_metadata?.name || '',
                role: 'user', // temporary
                created_at: user.created_at,
                updated_at: user.updated_at,
              },
              accessToken: session.access_token,
              refreshToken: session.refresh_token,
            });
            setShowArtistSelection(true);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        // Clear auth state when user signs out
        clearAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, [setAuth, clearAuth, location.pathname]);

  const handleArtistSelection = async (isArtist: boolean) => {
    if (!pendingUserData) return;

    try {
      await artistSelectionMutation.mutateAsync({
        user: pendingUserData.user,
        accessToken: pendingUserData.accessToken,
        refreshToken: pendingUserData.refreshToken,
        isArtist,
      });

      setShowArtistSelection(false);
      setPendingUserData(null);

      // Navigate to dashboard for both artists and users after successful registration
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Artist selection error:', error);
      // Handle error - maybe show a toast or error message
    }
  };

  const handleArtistSelectionClose = () => {
    setShowArtistSelection(false);
    setPendingUserData(null);
    // Sign out the user if they don't complete the setup
    supabase.auth.signOut();
  };

  return (
    <ArtistSelectionModal
      isOpen={showArtistSelection}
      onClose={handleArtistSelectionClose}
      onSelect={handleArtistSelection}
      useremail={pendingUserData?.user?.email || ''}
      userName={pendingUserData?.user?.name || ''}
    />
  );
};

export default AuthStateListener;

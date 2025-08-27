import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store';
import { AuthLoading } from '@/components/common/AuthLoading';
import { AuthContext } from '@/contexts/AuthContext';
import type { Role } from '@/constants/types';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { login, registerUser, registerArtist } = useAppStore();

  const handleUserSession = async (session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      // Extract user information from Supabase user
      const supabaseUser = session.user;
      const userMetadata = supabaseUser.user_metadata || {};
      
      // Determine role from metadata or default to 'user'
      const role = (userMetadata.role as Role) || 'user';
      
      // Extract name from various possible sources
      const name = userMetadata.full_name || 
                   userMetadata.name || 
                   userMetadata.display_name ||
                   `${userMetadata.first_name || ''} ${userMetadata.last_name || ''}`.trim() ||
                   supabaseUser.email?.split('@')[0] ||
                   'New User';
      
      // Update local store
      login(role, supabaseUser.id);
      
      // Check if user exists in local store, if not create them
      const { users, artists } = useAppStore.getState();
      const existingUser = users.find(u => u.id === supabaseUser.id);
      const existingArtist = artists.find(a => a.id === supabaseUser.id);
      
      if (!existingUser && !existingArtist) {
        if (role === 'artist') {
          registerArtist({
            id: supabaseUser.id,
            name: name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
          });
        } else {
          registerUser({
            id: supabaseUser.id,
            name: name,
          });
        }
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await handleUserSession(session);
    });

    return () => subscription.unsubscribe();
  }, [login, registerUser, registerArtist]);

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!session,
  };

  if (loading) {
    return <AuthLoading />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

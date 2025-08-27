import { useEffect, useState } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store';
import type { User, Role } from '@/constants/types';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { auth, login, logout: storeLogout } = useAppStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithSupabase = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Determine role from user metadata or default to 'user'
    const role = (data.user?.user_metadata?.role as Role) || 'user';
    const userId = data.user?.id || '';
    
    // Update local store
    login(role, userId);
    
    return data;
  };

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) throw error;
    
    return data;
  };

  const registerWithSupabase = async (
    email: string, 
    password: string, 
    userData: { name: string; role: Role }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
        },
      },
    });
    
    if (error) throw error;
    
    // If user is confirmed immediately, log them in
    if (data.user && !data.user.email_confirmed_at) {
      // User needs to confirm email
      return { needsConfirmation: true };
    }
    
    if (data.user) {
      const role = userData.role;
      const userId = data.user.id;
      
      // Update local store
      login(role, userId);
    }
    
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local store
    storeLogout();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) throw error;
  };

  return {
    currentUserId: auth.currentUserId,
    role: auth.role,
    isAuthenticated: !!session,
    user,
    session,
    loading,
    login: loginWithSupabase,
    loginWithGoogle,
    register: registerWithSupabase,
    logout,
    resetPassword,
    updatePassword,
  };
};

export const useCurrentUser = (): User | undefined => {
  const { currentUserId } = useAuth();
  const { users } = useAppStore();
  
  if (!currentUserId) return undefined;
  
  return users.find((user) => user.id === currentUserId);
};

export const useIsAdmin = (): boolean => {
  const { role } = useAuth();
  return role === 'admin';
};

export const useIsArtist = (): boolean => {
  const { role } = useAuth();
  return role === 'artist';
};

export const useIsUser = (): boolean => {
  const { role } = useAuth();
  return role === 'user';
};

export const useIsBanned = (): boolean => {
  const currentUser = useCurrentUser();
  return currentUser?.banned || false;
};

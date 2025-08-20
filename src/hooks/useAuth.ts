import { useAppStore } from '@/store';
import type { User } from '@/constants/types';

export const useAuth = () => {
  const { auth, login, logout } = useAppStore();
  
  return {
    currentUserId: auth.currentUserId,
    role: auth.role,
    isAuthenticated: !!auth.currentUserId,
    login,
    logout,
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

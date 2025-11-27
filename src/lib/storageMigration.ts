/**
 * Storage migration utilities to clean up localStorage and migrate to cookie-based auth
 */

import { tokenCookies, userDataCookies } from '@/lib/cookieUtils';
import { useStore } from '@/stores/store';

/**
 * Clean up old localStorage data and migrate to new structure
 */
export function migrateStorageData(): void {
  try {
    // Get current localStorage data
    const authStorage = localStorage.getItem('auth-storage');

    if (authStorage) {
      const parsedData = JSON.parse(authStorage);

      // If we have old token data in localStorage, migrate it to cookies
      if (parsedData.state?.accessToken && parsedData.state?.refreshToken) {
        // Store tokens in cookies
        tokenCookies.setAccessToken(parsedData.state.accessToken);
        tokenCookies.setRefreshToken(parsedData.state.refreshToken);

        // Store user data in cookies if available
        if (parsedData.state.user?.id) {
          userDataCookies.setUserId(parsedData.state.user.id);
        }
        if (parsedData.state.user?.role) {
          userDataCookies.setUserRole(parsedData.state.user.role);
        }
      }

      // Clean up the old localStorage data
      localStorage.removeItem('auth-storage');
    }

    // Clean up any other potentially sensitive data
    const keysToRemove = [
      'accessToken',
      'refreshToken',
      'userToken',
      'authToken',
      'jwt',
      'session',
    ];

    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error during storage migration:', error);
  }
}

/**
 * Initialize storage migration on app startup
 */
export function initializeStorageMigration(): void {
  // Run migration
  migrateStorageData();

  // Set up store with clean state
  const store = useStore.getState();

  // If we have tokens in cookies but no user in store, try to restore user data
  const accessToken = tokenCookies.getAccessToken();
  const refreshToken = tokenCookies.getRefreshToken();
  const userId = userDataCookies.getUserId();

  if (accessToken && refreshToken && userId && !store.user) {
    // We have tokens but no user data in store
    // This might happen after a page refresh
    // The user will need to re-authenticate or we can try to fetch user data
  }
}

/**
 * Clear all authentication-related data from both localStorage and cookies
 */
export function clearAllAuthData(): void {
  // Clear cookies
  tokenCookies.clearTokens();
  userDataCookies.clearUserData();

  // Clear localStorage
  localStorage.removeItem('auth-storage');

  // Clear any other auth-related localStorage items
  const authKeys = [
    'accessToken',
    'refreshToken',
    'userToken',
    'authToken',
    'jwt',
    'session',
    'user',
    'auth',
  ];

  authKeys.forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Get storage usage information for debugging
 */
export function getStorageInfo(): {
  localStorage: { [key: string]: any };
  cookies: { [key: string]: string | null };
} {
  const localStorageData: { [key: string]: any } = {};
  const cookieData: { [key: string]: string | null } = {};

  // Get localStorage data
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        localStorageData[key] = JSON.parse(localStorage.getItem(key) || '');
      } catch {
        localStorageData[key] = localStorage.getItem(key);
      }
    }
  }

  // Get cookie data
  cookieData.access_token = tokenCookies.getAccessToken();
  cookieData.refresh_token = tokenCookies.getRefreshToken();
  cookieData.user_id = userDataCookies.getUserId();
  cookieData.user_role = userDataCookies.getUserRole();

  return {
    localStorage: localStorageData,
    cookies: cookieData,
  };
}

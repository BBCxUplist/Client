/**
 * Cookie utility functions for secure token management
 */

interface CookieOptions {
  expires?: Date;
  maxAge?: number; // in seconds
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  const {
    expires,
    maxAge,
    path = '/',
    domain,
    secure = true, // Default to secure for production
    httpOnly = false, // Keep false for client-side access
    sameSite = 'lax',
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  if (httpOnly) {
    cookieString += '; httponly';
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Remove a cookie by setting its expiration date to the past
 */
export function removeCookie(name: string, path: string = '/'): void {
  // Try to remove with the same attributes that were used to set it
  setCookie(name, '', {
    expires: new Date(0),
    path,
    secure: true,
    sameSite: 'lax',
  });

  // Also try without secure/sameSite for compatibility
  setCookie(name, '', {
    expires: new Date(0),
    path,
  });
}

/**
 * Check if cookies are supported/enabled
 */
export function areCookiesEnabled(): boolean {
  try {
    const testCookie = 'test-cookie-support';
    setCookie(testCookie, 'test');
    const isSupported = getCookie(testCookie) === 'test';
    removeCookie(testCookie);
    return isSupported;
  } catch {
    return false;
  }
}

/**
 * Token-specific cookie functions
 */
export const tokenCookies = {
  /**
   * Set access token cookie (short-lived, 15 minutes)
   */
  setAccessToken: (token: string): void => {
    setCookie('access_token', token, {
      maxAge: 15 * 60, // 15 minutes
      secure: true,
      sameSite: 'lax',
    });
  },

  /**
   * Set refresh token cookie (long-lived, 7 days)
   */
  setRefreshToken: (token: string): void => {
    setCookie('refresh_token', token, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: true,
      sameSite: 'lax',
    });
  },

  /**
   * Get access token from cookie
   */
  getAccessToken: (): string | null => {
    return getCookie('access_token');
  },

  /**
   * Get refresh token from cookie
   */
  getRefreshToken: (): string | null => {
    return getCookie('refresh_token');
  },

  /**
   * Remove both token cookies
   */
  clearTokens: (): void => {
    removeCookie('access_token');
    removeCookie('refresh_token');

    // Double check - also try to clear with different paths
    removeCookie('access_token', '/');
    removeCookie('refresh_token', '/');
  },
};

/**
 * User data cookie functions (for non-sensitive data)
 */
export const userDataCookies = {
  /**
   * Set user ID cookie (for quick access)
   */
  setUserId: (userId: string): void => {
    setCookie('user_id', userId, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: true,
      sameSite: 'lax',
    });
  },

  /**
   * Set user role cookie
   */
  setUserRole: (role: string): void => {
    setCookie('user_role', role, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: true,
      sameSite: 'lax',
    });
  },

  /**
   * Get user ID from cookie
   */
  getUserId: (): string | null => {
    return getCookie('user_id');
  },

  /**
   * Get user role from cookie
   */
  getUserRole: (): string | null => {
    return getCookie('user_role');
  },

  /**
   * Clear user data cookies
   */
  clearUserData: (): void => {
    removeCookie('user_id');
    removeCookie('user_role');

    // Double check - also try to clear with different paths
    removeCookie('user_id', '/');
    removeCookie('user_role', '/');
  },
};

/**
 * Aggressively clear all auth-related cookies
 */
export function clearAllAuthCookies(): void {
  const cookieNames = ['access_token', 'refresh_token', 'user_id', 'user_role'];
  const paths = ['/', '/auth', '/dashboard'];

  cookieNames.forEach(cookieName => {
    // Try different combinations of path
    paths.forEach(path => {
      try {
        // Try with secure and sameSite
        setCookie(cookieName, '', {
          expires: new Date(0),
          path,
          secure: true,
          sameSite: 'lax',
        });

        // Try without secure
        setCookie(cookieName, '', {
          expires: new Date(0),
          path,
          sameSite: 'lax',
        });

        // Try with just path
        setCookie(cookieName, '', {
          expires: new Date(0),
          path,
        });
      } catch {
        // Ignore errors for invalid combinations
      }
    });

    // Also try the simple removal
    try {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    } catch {
      // Ignore errors
    }
  });
}

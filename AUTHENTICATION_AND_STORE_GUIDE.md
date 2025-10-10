# Authentication & Store Management Guide

## Overview

This document explains how authentication and state management work in the Uplist application. The system uses a hybrid approach combining Supabase authentication with a custom backend API and secure cookie-based token management.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │   Frontend      │    │   Backend API   │
│   Authentication│◄──►│   Store         │◄──►│   (Your API)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Tokens   │    │   User State    │    │   User Data     │
│   (Cookies)     │    │   (Zustand)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Authentication Flow

### 1. User Login/Registration

```typescript
// User logs in via Supabase
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// AuthStateListener detects the auth change
// If user has no role, shows ArtistSelectionModal
// If user has role, directly sets auth state
```

### 2. Role Selection (New Users)

```typescript
// New users choose between 'user' or 'artist' role
const handleArtistSelection = async (isArtist: boolean) => {
  await artistSelectionMutation.mutateAsync({
    user: pendingUserData.user,
    accessToken: pendingUserData.accessToken,
    refreshToken: pendingUserData.refreshToken,
    isArtist,
  });
};
```

### 3. State Management

```typescript
// Store is updated with consolidated user data
setAuth(consolidatedUser, accessToken, refreshToken);
```

## Store Structure

### Core Types (`src/types/store.ts`)

```typescript
interface ConsolidatedUser {
  // Supabase auth fields
  id: string;
  email?: string;
  name?: string;
  role?: 'user' | 'artist' | 'admin';

  // Backend-specific fields
  username?: string;
  useremail?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  // ... more backend fields
}

interface AuthState {
  user: ConsolidatedUser | null;
  isAuthenticated: boolean;
  authMode: 'signin' | 'register' | null;
}
```

### Store Actions

```typescript
interface AuthActions {
  setAuth: (
    user: ConsolidatedUser,
    accessToken: string,
    refreshToken: string
  ) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
  setUser: (user: ConsolidatedUser) => void;
  setAuthMode: (mode: 'signin' | 'register' | null) => void;

  // Helper methods
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getRole: () => 'user' | 'artist' | 'admin';
  isArtist: () => boolean;
  isAdmin: () => boolean;
}
```

## Token Management

### Secure Cookie Storage

```typescript
// Tokens are stored in secure HTTP cookies, not localStorage
const tokenCookies = {
  setAccessToken: (token: string) => {
    setCookie(ACCESS_TOKEN_COOKIE_NAME, token, { expires: 1 / 24 / 4 }); // 15 minutes
  },
  setRefreshToken: (token: string) => {
    setCookie(REFRESH_TOKEN_COOKIE_NAME, token, { expires: 7 }); // 7 days
  },
  // ... get and clear methods
};
```

### Automatic Token Refresh

```typescript
// Axios interceptors handle token refresh automatically
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Attempt to refresh token
      await authService.refreshToken();
      // Retry original request with new token
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

## Data Flow

### 1. Initial Authentication

```
User Login → Supabase Auth → AuthStateListener → Role Check → Store Update
```

### 2. API Calls

```
Component → useQuery Hook → apiClient → Axios Interceptors → Backend API
```

### 3. Token Refresh

```
401 Error → Refresh Token → Update Cookies → Retry Request
```

## Key Components

### 1. AuthStateListener (`src/components/auth/AuthStateListener.tsx`)

- Listens for Supabase auth state changes
- Handles role selection for new users
- Manages authentication flow

### 2. Store (`src/stores/store.ts`)

- Centralized state management with Zustand
- Persists non-sensitive data to localStorage
- Provides helper methods for role checking

### 3. AuthService (`src/lib/authService.ts`)

- Handles login, registration, and token refresh
- Converts API responses to ConsolidatedUser format
- Manages authentication state updates

### 4. Axios Interceptors (`src/lib/axiosInterceptors.ts`)

- Automatically adds Authorization headers
- Handles token refresh on 401 errors
- Manages request queuing during token refresh

## Security Features

### 1. Secure Token Storage

- Access tokens: 15-minute expiry, secure cookies
- Refresh tokens: 7-day expiry, secure cookies
- No sensitive data in localStorage

### 2. Automatic Token Refresh

- Seamless token refresh without user intervention
- Request queuing during refresh process
- Automatic logout on refresh failure

### 3. CSRF Protection

- SameSite: 'Lax' cookie policy
- Secure cookies in production
- Proper CORS configuration

## Usage Examples

### 1. Accessing User Data

```typescript
const { user, isAuthenticated, isArtist, isAdmin } = useStore();

if (isAuthenticated && isArtist()) {
  // Show artist-specific content
}
```

### 2. Making Authenticated API Calls

```typescript
const { data } = useGetUserByEmail({
  email: user?.useremail || user?.email || '',
  enabled: !!(user?.useremail || user?.email) && isAuthenticated,
});
```

### 3. Logout

```typescript
const { logout } = useStore();
await logout(); // Clears cookies, store, and redirects to auth
```

## Migration from Old System

### What Changed

1. **Token Storage**: Moved from localStorage to secure cookies
2. **User Data**: Consolidated Supabase and backend user data
3. **Type Safety**: Proper TypeScript types for all user data
4. **Automatic Refresh**: Seamless token refresh handling

### Migration Process

1. **Storage Migration**: `src/lib/storageMigration.ts` handles old data cleanup
2. **Type Updates**: All components updated to use new ConsolidatedUser type
3. **API Integration**: Axios interceptors handle authentication automatically

## Best Practices

### 1. Always Use Store Helpers

```typescript
// ✅ Good
const { isAuthenticated, isArtist } = useStore();
if (isAuthenticated && isArtist()) { ... }

// ❌ Avoid
if (user?.role === 'artist') { ... }
```

### 2. Handle Loading States

```typescript
const { data, isLoading, error } = useGetUserByEmail({
  email: user?.useremail || user?.email || '',
  enabled: !!(user?.useremail || user?.email) && isAuthenticated,
});

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage />;
```

### 3. Use Proper Field Names

```typescript
// ✅ Use backend fields when available
const email = user?.useremail || user?.email;
const displayName = user?.displayName || user?.name;

// ❌ Don't assume field availability
const email = user?.useremail; // Might be undefined
```

## Troubleshooting

### Common Issues

1. **"Missing or invalid token" Error**
   - Check if Axios interceptors are properly set up
   - Verify token cookies are being set correctly
   - Ensure API client is using the correct instance

2. **Infinite Re-renders**
   - Avoid using function calls in useEffect dependencies
   - Use direct property access instead of helper functions
   - Check for circular state updates

3. **Type Errors**
   - Ensure all components use ConsolidatedUser type
   - Check if field names match between Supabase and backend
   - Verify optional vs required field types

### Debug Tools

1. **Store DevTools**: Use Zustand devtools for state inspection
2. **Network Tab**: Check API calls and token refresh
3. **Application Tab**: Verify cookie storage and localStorage cleanup

## File Structure

```
src/
├── types/
│   ├── store.ts              # Store type definitions
│   └── auth.ts               # Auth type definitions
├── stores/
│   └── store.ts              # Zustand store implementation
├── lib/
│   ├── authService.ts        # Authentication service
│   ├── cookieUtils.ts        # Cookie management utilities
│   ├── axiosInterceptors.ts  # Axios request/response interceptors
│   └── storageMigration.ts   # Migration from old storage system
├── components/auth/
│   └── AuthStateListener.tsx # Supabase auth state listener
└── hooks/
    ├── user/                 # User-related hooks
    └── login/                # Login-related hooks
```

This architecture provides a secure, scalable, and maintainable authentication system that handles both Supabase authentication and custom backend integration seamlessly.

# Authentication System

This directory contains the authentication system for the Uplist frontend application. The system provides token-based authentication with automatic token refresh and comprehensive error handling.

## Files Overview

### Core Files

- **`apiClient.ts`** - Axios instance with request/response interceptors for automatic token management
- **`authService.ts`** - Centralized authentication service with all auth-related operations
- **`../hooks/auth/`** - React hooks for authentication operations
- **`../components/auth/`** - Authentication components and guards

## Features

### 🔐 Token Management

- Automatic Bearer token injection in API requests
- Automatic token refresh on 401 errors
- Token expiration checking
- Secure token storage in Zustand store

### 🔄 Automatic Refresh

- Background token refresh every 15 minutes
- Retry failed requests with new tokens
- Graceful fallback to login on refresh failure

### 🛡️ Route Protection

- AuthGuard component for protecting routes
- Role-based access control
- Automatic redirects for unauthorized access

### 📱 User Experience

- Loading states during authentication checks
- Error handling with user-friendly messages
- Persistent authentication across browser sessions

## Usage

### Basic Setup

```typescript
import { apiClient } from '@/lib/apiClient';
import { authService } from '@/lib/authService';

// All API requests automatically include Bearer token
const response = await apiClient.get('/users/profile');
```

### Authentication Hooks

```typescript
import { useLogin, useRegister, useLogout, useAuthStatus } from '@/hooks/auth';

function LoginComponent() {
  const loginMutation = useLogin();
  const { user, isAuthenticated } = useStore();

  const handleLogin = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // User is now authenticated
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Login form */}
    </form>
  );
}
```

### Route Protection

```typescript
import AuthGuard from '@/components/auth/AuthGuard';

function ProtectedPage() {
  return (
    <AuthGuard requireAuth={true} allowedRoles={['user', 'artist']}>
      <div>This content is only visible to authenticated users</div>
    </AuthGuard>
  );
}
```

### Token Refresh

```typescript
import { useTokenRefresh } from '@/hooks/auth/useTokenRefresh';

function App() {
  // Automatically refresh tokens every 15 minutes
  useTokenRefresh({ interval: 15 * 60 * 1000 });

  return <div>Your app content</div>;
}
```

## API Endpoints

The authentication system expects the following API endpoints:

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `GET /auth/verify` - Token verification

### Expected Response Formats

#### Login/Register Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

#### Token Refresh Response

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token",
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```

## Configuration

### Environment Variables

```env
VITE_API_URL=https://your-api-url.com
```

### Store Configuration

The authentication state is managed by Zustand and persisted to localStorage:

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: 'user' | 'artist' | 'admin' | null;
  accessToken: string | null;
  refreshToken: string | null;
}
```

## Error Handling

The system handles various error scenarios:

1. **401 Unauthorized** - Automatically attempts token refresh
2. **Token Refresh Failure** - Clears auth state and redirects to login
3. **Network Errors** - Graceful degradation with user feedback
4. **Invalid Tokens** - Automatic cleanup and re-authentication

## Security Features

- **Secure Token Storage** - Tokens stored in memory with Zustand persistence
- **Automatic Cleanup** - Tokens cleared on logout or refresh failure
- **CSRF Protection** - Bearer token authentication
- **Token Validation** - Server-side token verification
- **Role-Based Access** - Granular permission control

## Best Practices

1. **Always use the provided hooks** instead of calling authService directly
2. **Wrap protected routes** with AuthGuard component
3. **Handle loading states** during authentication operations
4. **Provide user feedback** for authentication errors
5. **Use the token refresh hook** in your main App component

## Troubleshooting

### Common Issues

1. **Token not being sent** - Ensure you're using `apiClient` for API calls
2. **Infinite refresh loops** - Check your refresh token endpoint implementation
3. **Authentication state not persisting** - Verify Zustand persistence configuration
4. **Role-based access not working** - Ensure user roles are properly set in the store

### Debug Mode

Enable debug logging by setting:

```typescript
localStorage.setItem('debug', 'auth:*');
```

This will log all authentication-related operations to the console.

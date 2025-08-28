# Supabase Authentication Setup

This guide explains how to set up Supabase authentication for the Uplist project.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. The project dependencies installed (`npm install`)

## Step 1: Create a Supabase Project

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "uplist")
5. Enter a database password
6. Choose a region close to your users
7. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## Step 3: Configure Environment Variables

1. Create a `.env` file in the project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important**: Never commit your `.env` file to version control. It should already be in `.gitignore`.

## Step 4: Configure Authentication Settings

### Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Make sure **Email** is enabled
3. Configure email templates (optional but recommended)

### Enable Google OAuth

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** and click **Enable**
3. You'll need to set up a Google OAuth application:

#### Setting up Google OAuth Application

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Choose **Web application** as the application type
6. Add authorized redirect URIs:
   - For development: `http://localhost:5173/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`
7. Copy the **Client ID** and **Client Secret**

#### Configure Google Provider in Supabase

1. Back in your Supabase dashboard, go to **Authentication** > **Providers** > **Google**
2. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret
3. Click **Save**

### Email Templates (Optional)

1. Go to **Authentication** > **Email Templates**
2. Customize the templates for:
   - **Confirm signup**
   - **Reset password**
   - **Magic link**

### Redirect URLs (Optional)

If you want to use redirect-based authentication:

1. Go to **Authentication** > **URL Configuration**
2. Add your site URLs:
   - Site URL: `http://localhost:5173` (for development)
   - Redirect URLs: `http://localhost:5173/**`

## Step 5: Test the Setup

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173/login`

3. Test both authentication methods:
   - **Email/Password**: Try registering a new account
   - **Google OAuth**: Click "Continue with Google" and complete the OAuth flow

## Step 6: Database Schema (Optional)

If you want to store additional user data, you can create custom tables:

```sql
-- Create a profiles table to store additional user information
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  role TEXT CHECK (role IN ('user', 'artist', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', COALESCE(NEW.raw_user_meta_data->>'role', 'user'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

## Features Implemented

The Supabase authentication implementation includes:

- ✅ **Email/Password Authentication**: Users can register and login with email/password
- ✅ **Google OAuth Authentication**: Users can login with their Google account
- ✅ **Role-based Access**: Support for user, artist, and admin roles
- ✅ **Email Confirmation**: New accounts require email verification
- ✅ **Password Reset**: Users can reset passwords via email
- ✅ **Session Management**: Automatic session handling and persistence
- ✅ **Loading States**: Proper loading indicators during auth operations
- ✅ **Error Handling**: Comprehensive error messages for auth failures
- ✅ **User Profile Creation**: Automatic creation of user profiles for OAuth users

## Usage Examples

### Email/Password Login

```typescript
const { login } = useAuth();
await login(email, password);
```

### Google OAuth Login

```typescript
const { loginWithGoogle } = useAuth();
await loginWithGoogle();
```

### Register

```typescript
const { register } = useAuth();
await register(email, password, { name: "John Doe", role: "user" });
```

### Logout

```typescript
const { logout } = useAuth();
await logout();
```

### Password Reset

```typescript
const { resetPassword } = useAuth();
await resetPassword(email);
```

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure your `.env` file exists and contains the correct values
   - Restart your development server after adding environment variables

2. **"Invalid login credentials"**
   - Check that the user exists in your Supabase auth.users table
   - Verify the email is confirmed if email confirmation is enabled

3. **"Email not received"**
   - Check your spam folder
   - Verify email templates are configured in Supabase
   - Check the Supabase logs for email delivery issues

4. **Google OAuth errors**
   - Verify your Google OAuth credentials are correct
   - Check that redirect URIs are properly configured
   - Ensure the Google+ API is enabled in Google Cloud Console
   - Check that your domain is authorized in Google OAuth settings

5. **CORS errors**
   - Make sure your site URL is configured in Supabase Auth settings
   - Check that redirect URLs are properly set

6. **"Redirect URI mismatch"**
   - Ensure the redirect URI in your Google OAuth app matches exactly
   - For development: `http://localhost:5173/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Community](https://github.com/supabase/supabase/discussions)

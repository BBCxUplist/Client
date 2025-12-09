// pages/Auth.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import { resetPassword } from '@/lib/supabase';
import { useRegisterWithValidation } from '@/hooks/login/useRegister';
import { useLogin, useGoogleLogin } from '@/hooks/login/useLogin';
import { useRegisterAPI } from '@/hooks/login/useRegisterAPI';
import { useArtistSelection } from '@/hooks/login/useArtistSelection';
import MobileAuthLayout from '@/components/auth/MobileAuthLayout';
import DesktopAuthLayout from '@/components/auth/DesktopAuthLayout';
import ArtistSelectionModal from '@/components/auth/ArtistSelectionModal';
import { useStore } from '@/stores/store';
import type { FormData, AuthMode } from '@/components/auth/types';
import type { Role } from '@/types';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, authMode, setAuthMode, setAuth } = useStore();
  const [activeMode, setActiveMode] = useState<AuthMode>(authMode || 'signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isArtist: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationUserRole, setVerificationUserRole] = useState<
    'artist' | 'user'
  >('user');
  const [verificationDisplayName, setVerificationDisplayName] = useState('');
  const [showArtistSelection, setShowArtistSelection] = useState(false);
  const [pendingUserData, setPendingUserData] = useState<{
    user: any;
    accessToken: string;
    refreshToken: string;
  } | null>(null);

  // Initialize hooks
  const registerMutation = useRegisterWithValidation();
  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLogin();
  const registerAPIMutation = useRegisterAPI();
  const artistSelectionMutation = useArtistSelection();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear auth mode from store when component mounts (since we've used it to set initial state)
  useEffect(() => {
    if (authMode) {
      setAuthMode(null);
    }
  }, [authMode, setAuthMode]);

  // ... (keep all existing functions - handleInputChange, validateForm, handleSubmit, switchMode, onGoogleLogin, onForgotPassword)
  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (activeMode === 'register' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (activeMode === 'register') {
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError('');
    setSuccessMessage('');

    try {
      if (activeMode === 'signin') {
        const result = await loginMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
        });
        console.log('Login successful:', result);

        // Check if user already has a role set
        const userRole = result.user.user_metadata?.role;
        if (userRole) {
          // User already has a role, set auth state directly
          const userData = {
            id: result.user.id,
            email: result.user.email,
            name: result.user.user_metadata?.name || '',
            role: userRole,
            created_at: result.user.created_at,
            updated_at: result.user.updated_at,
          };
          setAuth(
            userData,
            result.session.access_token,
            result.session.refresh_token
          );
        } else {
          // User doesn't have a role, show artist selection modal
          setPendingUserData({
            user: {
              id: result.user.id,
              email: result.user.email,
              name: result.user.user_metadata?.name || '',
              role: 'user', // temporary
              created_at: result.user.created_at,
              updated_at: result.user.updated_at,
            },
            accessToken: result.session.access_token,
            refreshToken: result.session.refresh_token,
          });
          setShowArtistSelection(true);
        }
      } else {
        const role = formData.isArtist ? 'artist' : 'user';
        const result = await registerMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role,
        });

        if (result && result.user) {
          // Check if email verification is needed
          const emailVerified = result.user.user_metadata?.email_verified;

          // Check if this is a duplicate registration (email_verified not present)
          if (
            emailVerified === undefined &&
            result.user.identities?.length === 0
          ) {
            // This is likely a duplicate registration - call register API to get proper error

            if (result.session?.access_token) {
              try {
                const registerResult = await registerAPIMutation.mutateAsync({
                  data: {
                    useremail: formData.email,
                    role: formData.isArtist ? 'artist' : 'user',
                    displayName: formData.name,
                  },
                  token: result.session.access_token,
                });

                // Check if the API response indicates user already exists
                if (
                  registerResult.success === false &&
                  registerResult.message?.includes('User already exists')
                ) {
                  setError(
                    'An account with this email already exists. Please try signing in instead.'
                  );
                } else if (registerResult.success === true) {
                  // Auto-login and redirect user after successful duplicate registration resolution
                  const userData = {
                    id: result.user.id,
                    email: result.user.email,
                    name: formData.name,
                    role: (formData.isArtist ? 'artist' : 'user') as Role,
                    created_at: result.user.created_at,
                    updated_at: result.user.updated_at,
                  };

                  setAuth(
                    userData,
                    result.session.access_token,
                    result.session.refresh_token
                  );
                  setSuccessMessage(
                    'Welcome to UPLIST! Registration completed successfully.'
                  );

                  // Navigate to explore page after successful registration
                  setTimeout(() => {
                    navigate('/explore');
                  }, 1000);
                } else {
                  setError(
                    registerResult.message ||
                      'Registration failed. Please try again.'
                  );
                }
              } catch (apiError: any) {
                setError(
                  apiError.message || 'Registration failed. Please try again.'
                );
              }
            } else {
              setError('Registration failed. Please try again.');
            }
          } else if (emailVerified === false) {
            // Email not verified - show OTP verification
            // Register API will be called after OTP verification
            setVerificationEmail(formData.email);
            setVerificationUserRole(formData.isArtist ? 'artist' : 'user');
            setVerificationDisplayName(formData.name);
            setShowOTPVerification(true);
            setSuccessMessage('');
            setError('');
          } else {
            // Email already verified - call register API immediately and auto-login

            if (result.session?.access_token) {
              try {
                const registerResult = await registerAPIMutation.mutateAsync({
                  data: {
                    useremail: formData.email,
                    role: formData.isArtist ? 'artist' : 'user',
                    displayName: formData.name,
                  },
                  token: result.session.access_token,
                });

                if (registerResult.success === true) {
                  // Auto-login and redirect user after successful registration
                  const userData = {
                    id: result.user.id,
                    email: result.user.email,
                    name: formData.name,
                    role: (formData.isArtist ? 'artist' : 'user') as Role,
                    created_at: result.user.created_at,
                    updated_at: result.user.updated_at,
                  };

                  setAuth(
                    userData,
                    result.session.access_token,
                    result.session.refresh_token
                  );
                  setSuccessMessage(
                    'Welcome to UPLIST! Registration completed successfully.'
                  );

                  // Navigate to explore page after successful registration
                  setTimeout(() => {
                    navigate('/explore');
                  }, 1000);
                } else {
                  setError(
                    registerResult.message ||
                      'Registration failed. Please try again.'
                  );
                }
              } catch (apiError: any) {
                setError(
                  apiError.message || 'Registration failed. Please try again.'
                );
              }
            } else {
              // No session token available - likely needs email confirmation
              setSuccessMessage(
                'Registration successful! Please check your email to confirm your account.'
              );
              setActiveMode('signin');
            }
          }
        } else {
          // No user data returned - likely needs email confirmation
          setSuccessMessage(
            'Registration successful! Please check your email to confirm your account.'
          );
          setActiveMode('signin');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'An error occurred during authentication');
    }
  };

  const switchMode = (mode: 'signin' | 'register') => {
    setActiveMode(mode);
    setErrors({});
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isArtist: false,
    });
    setShowOTPVerification(false);
    setVerificationEmail('');
    setVerificationUserRole('user');
    setVerificationDisplayName('');
    setError('');
    setSuccessMessage('');
  };

  const handleOTPVerificationSuccess = async (
    userData?: any,
    accessToken?: string,
    refreshToken?: string
  ) => {
    console.log('OTP verification successful!');
    setShowOTPVerification(false);
    setVerificationEmail('');
    setVerificationUserRole('user');

    // If user data is provided, automatically sign them in and redirect
    if (userData && accessToken && refreshToken) {
      setAuth(userData, accessToken, refreshToken);
      setSuccessMessage(
        'Welcome to UPLIST! Registration completed successfully.'
      );

      // Navigate to explore page after successful registration
      setTimeout(() => {
        navigate('/explore');
      }, 1000);
    } else {
      setSuccessMessage('Email verified successfully! You can now sign in.');
      setActiveMode('signin');
    }
  };

  const handleOTPVerificationBack = () => {
    setShowOTPVerification(false);
    setVerificationEmail('');
    setVerificationUserRole('user');
    setVerificationDisplayName('');
    setError('');
    setSuccessMessage('');
  };

  const onGoogleLogin = async () => {
    setError('');
    setSuccessMessage('');

    try {
      await googleLoginMutation.mutateAsync();
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error.message || 'An error occurred during Google login');
    }
  };

  const onForgotPassword = async () => {
    const email = prompt('Enter your email address to reset your password:');
    if (!email) return;

    setError('');
    setSuccessMessage('');

    try {
      await resetPassword(email);
      setSuccessMessage('Password reset email sent! Please check your inbox.');
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while sending the reset email';
      setError(errorMessage);
    }
  };

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
      setSuccessMessage(
        'Welcome to UPLIST! Your account has been set up successfully.'
      );

      // Navigate to dashboard after successful artist selection
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('Artist selection error:', error);
      setError(
        error.message || 'Failed to set up your account. Please try again.'
      );
    }
  };

  const handleArtistSelectionClose = () => {
    setShowArtistSelection(false);
    setPendingUserData(null);
    setError('Please complete your account setup to continue.');
  };

  // Get loading state from mutations
  const isLoading =
    registerMutation.isPending ||
    loginMutation.isPending ||
    googleLoginMutation.isPending ||
    registerAPIMutation.isPending ||
    artistSelectionMutation.isPending;

  // Handle mutation errors
  const mutationError =
    registerMutation.error ||
    loginMutation.error ||
    googleLoginMutation.error ||
    registerAPIMutation.error ||
    artistSelectionMutation.error;
  const displayError = error || mutationError?.message || '';

  return (
    <div className='min-h-screen'>
      <Navbar />

      <div className='w-full'>
        {/* Mobile/Tablet Layout */}
        <MobileAuthLayout
          activeMode={activeMode}
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          displayError={displayError}
          successMessage={successMessage}
          showOTPVerification={showOTPVerification}
          verificationEmail={verificationEmail}
          verificationUserRole={verificationUserRole}
          verificationDisplayName={verificationDisplayName}
          onModeChange={switchMode}
          onInputChange={handleInputChange}
          onPasswordToggle={() => setShowPassword(!showPassword)}
          onConfirmPasswordToggle={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
          onSubmit={handleSubmit}
          onGoogleLogin={onGoogleLogin}
          onForgotPassword={onForgotPassword}
          onOTPVerificationSuccess={handleOTPVerificationSuccess}
          onOTPVerificationBack={handleOTPVerificationBack}
        />

        {/* Desktop Layout */}
        <DesktopAuthLayout
          activeMode={activeMode}
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          displayError={displayError}
          successMessage={successMessage}
          showOTPVerification={showOTPVerification}
          verificationEmail={verificationEmail}
          verificationUserRole={verificationUserRole}
          verificationDisplayName={verificationDisplayName}
          onModeChange={switchMode}
          onInputChange={handleInputChange}
          onPasswordToggle={() => setShowPassword(!showPassword)}
          onConfirmPasswordToggle={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
          onSubmit={handleSubmit}
          onGoogleLogin={onGoogleLogin}
          onForgotPassword={onForgotPassword}
          onOTPVerificationSuccess={handleOTPVerificationSuccess}
          onOTPVerificationBack={handleOTPVerificationBack}
        />
      </div>

      {/* Artist Selection Modal */}
      <ArtistSelectionModal
        isOpen={showArtistSelection}
        onClose={handleArtistSelectionClose}
        onSelect={handleArtistSelection}
        useremail={pendingUserData?.user?.email || ''}
        userName={pendingUserData?.user?.name || ''}
      />
    </div>
  );
};

export default Auth;

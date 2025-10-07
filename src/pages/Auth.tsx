// pages/Auth.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import { resetPassword } from '@/lib/supabase';
import { useRegisterWithValidation } from '@/hooks/login/useRegister';
import { useLogin, useGoogleLogin } from '@/hooks/login/useLogin';
import { useRegisterAPI } from '@/hooks/login/useRegisterAPI';
import AuthHeader from '@/components/auth/AuthHeader';
import ModeToggle from '@/components/auth/ModeToggle';
import AuthForm from '@/components/auth/AuthForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import AuthMessages from '@/components/auth/AuthMessages';
import AuthFooter from '@/components/auth/AuthFooter';
import DesktopBranding from '@/components/auth/DesktopBranding';
import OTPVerification from '@/components/auth/OTPVerification';
import { useStore } from '@/stores/store';
import type { FormData, AuthMode } from '@/components/auth/types';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStore();
  const [activeMode, setActiveMode] = useState<AuthMode>('signin');
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

  // Initialize hooks
  const registerMutation = useRegisterWithValidation();
  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLogin();
  const registerAPIMutation = useRegisterAPI();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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
        // Navigation will be handled by useEffect when isAuthenticated changes
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
                  setSuccessMessage(
                    'Registration successful! You can now sign in.'
                  );
                  setActiveMode('signin');
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
            // Email already verified - call register API immediately

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
                  setSuccessMessage(
                    'Registration successful! You can now sign in.'
                  );
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
              setSuccessMessage(
                'Registration successful! You can now sign in.'
              );
            }

            setActiveMode('signin');
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

  const handleOTPVerificationSuccess = () => {
    console.log('OTP verification successful!');
    setShowOTPVerification(false);
    setVerificationEmail('');
    setVerificationUserRole('user');
    setSuccessMessage('Email verified successfully! You can now sign in.');
    setActiveMode('signin');
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

  // Get loading state from mutations
  const isLoading =
    registerMutation.isPending ||
    loginMutation.isPending ||
    googleLoginMutation.isPending ||
    registerAPIMutation.isPending;

  // Handle mutation errors
  const mutationError =
    registerMutation.error ||
    loginMutation.error ||
    googleLoginMutation.error ||
    registerAPIMutation.error;
  const displayError = error || mutationError?.message || '';

  return (
    <div className='min-h-screen'>
      <Navbar />

      <div className='w-full'>
        {/* Mobile/Tablet Layout */}
        <div className='lg:hidden p-4 md:p-6 min-h-[calc(100vh-80px)] flex flex-col justify-center'>
          <div className='max-w-md mx-auto w-full'>
            {showOTPVerification ? (
              <OTPVerification
                email={verificationEmail}
                userRole={verificationUserRole}
                displayName={verificationDisplayName}
                onVerificationSuccess={handleOTPVerificationSuccess}
                onBack={handleOTPVerificationBack}
              />
            ) : (
              <>
                <AuthHeader activeMode={activeMode} />
                <ModeToggle activeMode={activeMode} onModeChange={switchMode} />

                <AuthForm
                  activeMode={activeMode}
                  formData={formData}
                  errors={errors}
                  isLoading={isLoading}
                  showPassword={showPassword}
                  showConfirmPassword={showConfirmPassword}
                  onInputChange={handleInputChange}
                  onPasswordToggle={() => setShowPassword(!showPassword)}
                  onConfirmPasswordToggle={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  onSubmit={handleSubmit}
                />

                <GoogleLoginButton
                  onClick={onGoogleLogin}
                  disabled={isLoading}
                />

                <AuthMessages
                  error={displayError}
                  successMessage={successMessage}
                />
                <AuthFooter
                  activeMode={activeMode}
                  onForgotPassword={onForgotPassword}
                />
              </>
            )}
          </div>
        </div>

        {/* Desktop Layout - Two Column */}
        <div className='hidden lg:block min-h-[calc(100vh-80px)]'>
          <div className='grid lg:grid-cols-2 h-full'>
            {/* Left Column - Branding & Marketing */}
            <DesktopBranding activeMode={activeMode} />

            {/* Right Column - Form */}
            <div className='p-8 xl:p-12 flex flex-col justify-center'>
              <div className='max-w-md mx-auto w-full'>
                {showOTPVerification ? (
                  <OTPVerification
                    email={verificationEmail}
                    userRole={verificationUserRole}
                    displayName={verificationDisplayName}
                    onVerificationSuccess={handleOTPVerificationSuccess}
                    onBack={handleOTPVerificationBack}
                  />
                ) : (
                  <>
                    {/* Form Header */}
                    <div className='text-center mb-8'>
                      <h2 className='font-mondwest text-3xl xl:text-4xl font-bold text-white mb-4'>
                        {activeMode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                      </h2>
                      <p className='text-white/70'>
                        {activeMode === 'signin'
                          ? 'Access your dashboard'
                          : 'Start your journey today'}
                      </p>
                    </div>

                    <ModeToggle
                      activeMode={activeMode}
                      onModeChange={switchMode}
                      className='mb-8'
                    />

                    <AuthForm
                      activeMode={activeMode}
                      formData={formData}
                      errors={errors}
                      isLoading={isLoading}
                      showPassword={showPassword}
                      showConfirmPassword={showConfirmPassword}
                      onInputChange={handleInputChange}
                      onPasswordToggle={() => setShowPassword(!showPassword)}
                      onConfirmPasswordToggle={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      onSubmit={handleSubmit}
                      className='space-y-5'
                    />

                    <GoogleLoginButton
                      onClick={onGoogleLogin}
                      disabled={isLoading}
                      className='mt-5'
                    />

                    <AuthMessages
                      error={displayError}
                      successMessage={successMessage}
                    />

                    {/* Additional Links */}
                    <div className='mt-6 text-center space-y-3'>
                      {activeMode === 'signin' && (
                        <button
                          type='button'
                          onClick={onForgotPassword}
                          className='block text-white/60 hover:text-orange-500 transition-colors text-sm w-full'
                        >
                          Forgot your password?
                        </button>
                      )}

                      <a
                        href='/'
                        className='block text-white/60 hover:text-white transition-colors text-sm'
                      >
                        ← Back to Home
                      </a>
                    </div>

                    {/* Footer Info */}
                    <div className='mt-8 pt-6 border-t border-dashed border-white/20 text-center'>
                      <p className='text-white/40 text-xs'>
                        By{' '}
                        {activeMode === 'signin'
                          ? 'signing in'
                          : 'creating an account'}
                        , you agree to our{' '}
                        <a
                          href='/terms'
                          className='text-orange-500 hover:underline'
                        >
                          Terms
                        </a>{' '}
                        and{' '}
                        <a
                          href='/privacy'
                          className='text-orange-500 hover:underline'
                        >
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

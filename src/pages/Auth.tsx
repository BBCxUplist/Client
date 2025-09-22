// pages/Auth.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import {
  login,
  loginWithGoogle,
  register,
  resetPassword,
} from '@/lib/supabase';
import AuthHeader from '@/components/auth/AuthHeader';
import ModeToggle from '@/components/auth/ModeToggle';
import AuthForm from '@/components/auth/AuthForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import AuthMessages from '@/components/auth/AuthMessages';
import AuthFooter from '@/components/auth/AuthFooter';
import DesktopBranding from '@/components/auth/DesktopBranding';
import type { FormData, AuthMode } from '@/components/auth/types';

const Auth = () => {
  const navigate = useNavigate();
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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (activeMode === 'signin') {
        await login(formData.email, formData.password);
        navigate('/explore');
      } else {
        const role = formData.isArtist ? 'artist' : 'user';
        const result = await register(formData.email, formData.password, {
          name: formData.name,
          role,
        });

        if (result && 'needsConfirmation' in result) {
          setSuccessMessage(
            'Please check your email to confirm your account before signing in.'
          );
          setActiveMode('signin');
        } else {
          navigate('/explore');
        }
      }
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred during authentication';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
  };

  const onGoogleLogin = async () => {
    setError('');
    setSuccessMessage('');

    try {
      await loginWithGoogle();
    } catch (error: unknown) {
      console.error('Google login error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred during Google login';
      setError(errorMessage);
    }
  };

  const onForgotPassword = async () => {
    const email = prompt('Enter your email address to reset your password:');
    if (!email) return;

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen'>
      <Navbar />

      <div className='w-full'>
        {/* Mobile/Tablet Layout */}
        <div className='lg:hidden p-4 md:p-6'>
          <div className='max-w-md mx-auto'>
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

            <GoogleLoginButton onClick={onGoogleLogin} disabled={isLoading} />

            <AuthMessages error={error} successMessage={successMessage} />
            <AuthFooter
              activeMode={activeMode}
              onForgotPassword={onForgotPassword}
            />
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

                <AuthMessages error={error} successMessage={successMessage} />

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

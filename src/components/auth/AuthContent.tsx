import AuthForm from '@/components/auth/AuthForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import AuthMessages from '@/components/auth/AuthMessages';
import AuthFooter from '@/components/auth/AuthFooter';
import ModeToggle from '@/components/auth/ModeToggle';
import type { FormData, AuthMode } from '@/components/auth/types';

interface AuthContentProps {
  activeMode: AuthMode;
  formData: FormData;
  errors: Partial<FormData>;
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  displayError: string;
  successMessage: string;
  onModeChange: (mode: 'signin' | 'register') => void;
  onInputChange: (field: keyof FormData, value: string | boolean) => void;
  onPasswordToggle: () => void;
  onConfirmPasswordToggle: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
  onForgotPassword: () => void;
  variant?: 'mobile' | 'desktop';
}

const AuthContent = ({
  activeMode,
  formData,
  errors,
  isLoading,
  showPassword,
  showConfirmPassword,
  displayError,
  successMessage,
  onModeChange,
  onInputChange,
  onPasswordToggle,
  onConfirmPasswordToggle,
  onSubmit,
  onGoogleLogin,
  onForgotPassword,
  variant = 'mobile',
}: AuthContentProps) => {
  const isDesktop = variant === 'desktop';

  return (
    <>
      {/* Header - Desktop only shows this here, mobile shows it separately */}
      {isDesktop && (
        <div className='text-center mb-8'>
          <h2 className='font-mondwest text-3xl xl:text-4xl font-bold text-white mb-4'>
            {activeMode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h2>
        </div>
      )}

      <ModeToggle
        activeMode={activeMode}
        onModeChange={onModeChange}
        className={isDesktop ? 'mb-8' : undefined}
      />

      <AuthForm
        activeMode={activeMode}
        formData={formData}
        errors={errors}
        isLoading={isLoading}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        onInputChange={onInputChange}
        onPasswordToggle={onPasswordToggle}
        onConfirmPasswordToggle={onConfirmPasswordToggle}
        onSubmit={onSubmit}
        className={isDesktop ? 'space-y-5' : undefined}
      />

      <p className='py-2 text-center'>or</p>

      <GoogleLoginButton onClick={onGoogleLogin} disabled={isLoading} />

      <AuthMessages error={displayError} successMessage={successMessage} />

      {/* Footer - Different for desktop vs mobile */}
      {isDesktop ? (
        <>
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
              {activeMode === 'signin' ? 'signing in' : 'creating an account'},
              you agree to our{' '}
              <a href='/terms' className='text-orange-500 hover:underline'>
                Terms
              </a>{' '}
              and{' '}
              <a href='/privacy' className='text-orange-500 hover:underline'>
                Privacy Policy
              </a>
            </p>
          </div>
        </>
      ) : (
        <AuthFooter
          activeMode={activeMode}
          onForgotPassword={onForgotPassword}
        />
      )}
    </>
  );
};

export default AuthContent;

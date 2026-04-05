import AuthHeader from '@/components/auth/AuthHeader';
import AuthContent from '@/components/auth/AuthContent';
import OTPVerification from '@/components/auth/OTPVerification';
import ForgotPasswordView from '@/components/auth/ForgotPasswordView';
import ResetPasswordOTP from '@/components/auth/ResetPasswordOTP';
import type { FormData, AuthMode } from '@/components/auth/types';

interface MobileAuthLayoutProps {
  activeMode: AuthMode;
  formData: FormData;
  errors: Partial<FormData>;
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  displayError: string;
  successMessage: string;
  showOTPVerification: boolean;
  verificationEmail: string;
  verificationUserRole: 'artist' | 'user';
  verificationDisplayName: string;
  showForgotPassword: boolean;
  showResetPasswordOTP: boolean;
  forgotPasswordEmail: string;
  onModeChange: (mode: 'signin' | 'register') => void;
  onInputChange: (field: keyof FormData, value: string | boolean) => void;
  onPasswordToggle: () => void;
  onConfirmPasswordToggle: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
  onForgotPassword: () => void;
  onForgotPasswordSuccess: (email: string) => void;
  onForgotPasswordBack: () => void;
  onResetOTPBack: () => void;
  onOTPVerificationSuccess: (
    userData?: any,
    accessToken?: string,
    refreshToken?: string
  ) => void;
  onOTPVerificationBack: () => void;
}

const MobileAuthLayout = ({
  activeMode,
  formData,
  errors,
  isLoading,
  showPassword,
  showConfirmPassword,
  displayError,
  successMessage,
  showOTPVerification,
  verificationEmail,
  verificationUserRole,
  verificationDisplayName,
  showForgotPassword,
  showResetPasswordOTP,
  forgotPasswordEmail,
  onModeChange,
  onInputChange,
  onPasswordToggle,
  onConfirmPasswordToggle,
  onSubmit,
  onGoogleLogin,
  onForgotPassword,
  onForgotPasswordSuccess,
  onForgotPasswordBack,
  onResetOTPBack,
  onOTPVerificationSuccess,
  onOTPVerificationBack,
}: MobileAuthLayoutProps) => {
  return (
    <div className='lg:hidden p-4 md:p-6 min-h-[calc(100vh-80px)] flex flex-col justify-center'>
      <div className='max-w-md mx-auto w-full'>
        {showOTPVerification ? (
          <OTPVerification
            email={verificationEmail}
            userRole={verificationUserRole}
            displayName={verificationDisplayName}
            onVerificationSuccess={onOTPVerificationSuccess}
            onBack={onOTPVerificationBack}
          />
        ) : showForgotPassword ? (
          <ForgotPasswordView
            onBack={onForgotPasswordBack}
            onSuccess={onForgotPasswordSuccess}
          />
        ) : showResetPasswordOTP ? (
          <ResetPasswordOTP
            email={forgotPasswordEmail}
            onBack={onResetOTPBack}
          />
        ) : (
          <>
            <AuthHeader activeMode={activeMode} />
            <AuthContent
              activeMode={activeMode}
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              displayError={displayError}
              successMessage={successMessage}
              onModeChange={onModeChange}
              onInputChange={onInputChange}
              onPasswordToggle={onPasswordToggle}
              onConfirmPasswordToggle={onConfirmPasswordToggle}
              onSubmit={onSubmit}
              onGoogleLogin={onGoogleLogin}
              onForgotPassword={onForgotPassword}
              variant='mobile'
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MobileAuthLayout;

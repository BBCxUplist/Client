import { useState } from 'react';
import { Chrome } from 'lucide-react';

interface GoogleLoginButtonProps {
  onLogin: () => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const GoogleLoginButton = ({ onLogin, isLoading = false, className = '' }: GoogleLoginButtonProps) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await onLogin();
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isButtonLoading = isLoading || isGoogleLoading;

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isButtonLoading}
      className={`w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 font-semibold hover:bg-neutral-50 focus:outline-none focus:ring-4 focus:ring-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${className}`}
    >
      {isButtonLoading ? (
        <div className="w-5 h-5 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <Chrome className="h-5 w-5 text-red-500" />
      )}
      <span>
        {isButtonLoading ? 'Signing in...' : 'Continue with Google'}
      </span>
    </button>
  );
};

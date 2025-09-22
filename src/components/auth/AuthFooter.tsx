import { Link } from 'react-router-dom';
import type { AuthMode } from './types';

interface AuthFooterProps {
  activeMode: AuthMode;
  onForgotPassword: () => void;
  className?: string;
}

const AuthFooter = ({
  activeMode,
  onForgotPassword,
  className = '',
}: AuthFooterProps) => {
  return (
    <div className={`mt-8 text-center space-y-4 ${className}`}>
      {activeMode === 'signin' && (
        <button
          type='button'
          onClick={onForgotPassword}
          className='block text-white/60 hover:text-orange-500 transition-colors text-sm'
        >
          Forgot your password?
        </button>
      )}

      <div className='flex items-center gap-4'>
        <div className='flex-1 h-px bg-white/10' />
        <span className='text-white/50 text-xs'>OR</span>
        <div className='flex-1 h-px bg-white/10' />
      </div>

      <Link
        to='/'
        className='block text-white/60 hover:text-white transition-colors text-sm'
      >
        ← Back to Home
      </Link>

      {/* Footer Info */}
      <div className='mt-12 pt-8 border-t border-dashed border-white/20 text-center'>
        <p className='text-white/40 text-xs'>
          By {activeMode === 'signin' ? 'signing in' : 'creating an account'},
          you agree to our{' '}
          <Link to='/terms' className='text-orange-500 hover:underline'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to='/privacy' className='text-orange-500 hover:underline'>
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthFooter;

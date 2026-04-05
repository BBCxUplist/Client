import { useState } from 'react';
import { motion } from 'framer-motion';
import { resetPassword } from '@/lib/supabase';

interface ForgotPasswordViewProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
  className?: string;
}

const ForgotPasswordView = ({
  onBack,
  onSuccess,
  className = '',
}: ForgotPasswordViewProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(email.trim());
      onSuccess(email.trim());
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      key='forgot-password'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`min-h-[calc(100vh-200px)] flex flex-col justify-center ${className}`}
    >
      <div className='space-y-6'>
        {/* Header */}
        <div className='text-center'>
          <h2 className='font-mondwest text-2xl xl:text-3xl font-bold text-white mb-2'>
            FORGOT PASSWORD
          </h2>
          <p className='text-white/70 text-sm'>
            Enter your email address and we'll send you a recovery code.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Email Address
            </label>
            <input
              type='email'
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className={`w-full bg-white/5 border ${
                error ? 'border-red-500' : 'border-white/20'
              } text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors`}
              placeholder='Enter your email address'
              autoFocus
              disabled={isLoading}
            />
            {error && <p className='text-red-400 text-xs mt-1'>{error}</p>}
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-medium transition-colors'
          >
            {isLoading ? 'Sending...' : 'Send Recovery Code'}
          </button>
        </form>

        {/* Back link */}
        <div className='text-center'>
          <button
            type='button'
            onClick={onBack}
            className='text-white/60 hover:text-white transition-colors text-sm'
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordView;

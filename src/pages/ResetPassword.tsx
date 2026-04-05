import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/landing/Navbar';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Ensure we have an active recovery session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        // No active session — redirect to auth
        navigate('/auth');
      }
    });
  }, [navigate]);

  const validate = (): string => {
    if (!password.trim()) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!confirmPassword.trim()) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen'>
      <Navbar />

      <div className='w-full p-4 md:p-6 min-h-[calc(100vh-80px)] flex flex-col justify-center'>
        <div className='max-w-md mx-auto w-full'>
          {success ? (
            <div className='text-center space-y-4'>
              <div className='text-6xl mb-4'>✓</div>
              <h2 className='font-mondwest text-2xl xl:text-3xl font-bold text-white'>
                PASSWORD UPDATED
              </h2>
              <p className='text-white/70 text-sm'>
                Your password has been reset successfully. Redirecting you home...
              </p>
            </div>
          ) : (
            <div className='space-y-6'>
              {/* Header */}
              <div className='text-center'>
                <h2 className='font-mondwest text-2xl xl:text-3xl font-bold text-white mb-2'>
                  SET NEW PASSWORD
                </h2>
                <p className='text-white/70 text-sm'>
                  Enter and confirm your new password below.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className='space-y-5'>
                {/* New Password */}
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    New Password *
                  </label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors pr-12'
                      placeholder='Enter new password'
                      disabled={isLoading}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors text-sm'
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Confirm New Password *
                  </label>
                  <div className='relative'>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => {
                        setConfirmPassword(e.target.value);
                        if (error) setError('');
                      }}
                      className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors pr-12'
                      placeholder='Confirm new password'
                      disabled={isLoading}
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors text-sm'
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className='text-red-400 text-sm'>{error}</p>
                )}

                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-medium transition-colors'
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

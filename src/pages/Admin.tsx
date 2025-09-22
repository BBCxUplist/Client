// pages/Admin.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/lib/supabase';

interface AdminFormData {
  email: string;
  password: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AdminFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof AdminFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use your existing login function or create admin-specific login
      await login(formData.email, formData.password);

      // Check if user has admin role here
      // You might want to verify admin permissions before redirecting

      navigate('/admin/dashboard'); // Redirect to admin dashboard
    } catch (error: unknown) {
      console.error('Admin login error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid credentials';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md p-4'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='mb-8'>
            <Link to='/' className='inline-block'>
              <div className='relative'>
                <p className='font-mondwest text-2xl md:text-3xl font-bold text-white py-3 px-6 border border-white/20'>
                  UPLIST
                </p>
                <span className='absolute top-0 right-0 w-2 h-2 border-t border-r border-orange-500'></span>
                <span className='absolute top-0 left-0 w-2 h-2 border-t border-l border-orange-500'></span>
                <span className='absolute bottom-0 right-0 w-2 h-2 border-b border-r border-orange-500'></span>
                <span className='absolute bottom-0 left-0 w-2 h-2 border-b border-l border-orange-500'></span>
              </div>
            </Link>
          </div>

          <h1 className='font-mondwest text-4xl md:text-5xl font-bold text-white mb-4'>
            ADMIN ACCESS
          </h1>
          <p className='text-white/60 text-lg'>Administrative login required</p>
        </div>

        {/* Admin Badge */}
        <div className='bg-orange-500/10 border border-orange-500/30 p-4 mb-8 text-center'>
          <div className='flex items-center justify-center gap-2 mb-2'>
            <div className='w-3 h-3 bg-orange-500'></div>
            <p className='text-orange-400 font-semibold text-sm uppercase tracking-wider'>
              RESTRICTED ACCESS
            </p>
            <div className='w-3 h-3 bg-orange-500'></div>
          </div>
          <p className='text-white/70 text-xs'>
            Only authorized administrators can access this portal
          </p>
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className='space-y-6'
        >
          {/* Email Field */}
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Admin Email *
            </label>
            <input
              type='email'
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-4 focus:border-orange-500 focus:outline-none transition-colors'
              placeholder='Enter your admin email'
              autoComplete='username'
            />
          </div>

          {/* Password Field */}
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Admin Password *
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                className='w-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-4 pr-12 focus:border-orange-500 focus:outline-none transition-colors'
                placeholder='Enter your password'
                autoComplete='current-password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors'
              >
                {showPassword ? (
                  <img
                    src='/icons/eyeOpen.png'
                    alt='eye'
                    className='w-5 h-5 invert'
                  />
                ) : (
                  <img
                    src='/icons/eyeClosed.png'
                    alt='eye-off'
                    className='w-5 h-5 invert'
                  />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm'
            >
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isLoading}
            className={`w-full py-4 font-semibold transition-all duration-300 ${
              isLoading
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-orange-500 text-black hover:bg-orange-600'
            }`}
          >
            {isLoading ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='w-5 h-5 border-2 border-white/20 border-t-white animate-spin' />
                AUTHENTICATING...
              </div>
            ) : (
              'ACCESS ADMIN PANEL'
            )}
          </button>
        </motion.form>

        {/* Security Notice */}
        <div className='mt-8 p-4 border border-white/10 bg-white/5'>
          <div className='flex items-start gap-3'>
            <div className='w-2 h-2 bg-orange-500 mt-2 flex-shrink-0'></div>
            <div>
              <p className='text-white/80 text-sm mb-2 font-semibold'>
                Security Notice
              </p>
              <p className='text-white/60 text-xs leading-relaxed'>
                All admin access attempts are logged and monitored. Unauthorized
                access attempts will be reported to system administrators.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className='mt-8 text-center space-y-4'>
          <div className='flex items-center gap-4'>
            <div className='flex-1 h-px bg-white/10' />
            <span className='text-white/50 text-xs'>NEED HELP?</span>
            <div className='flex-1 h-px bg-white/10' />
          </div>

          <div className='space-y-2'>
            <p className='text-white/60 text-sm'>
              Contact system administrator for access issues
            </p>
            <Link
              to='/'
              className='block text-orange-500 hover:text-orange-400 transition-colors text-sm'
            >
              ← Back to Main Site
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-12 pt-6 border-t border-dashed border-white/20 text-center'>
          <p className='text-white/40 text-xs'>
            © UPLIST 2025 • Administrative Portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, X, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/stores/store';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const { user } = useStore();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  // Check if user is a Google OAuth user
  const checkAuthProvider = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (
        authUser?.app_metadata?.provider === 'google' ||
        authUser?.user_metadata?.provider === 'google' ||
        !authUser?.email_confirmed_at
      ) {
        setIsGoogleUser(true);
      }
    } catch (error) {
      console.error('Error checking auth provider:', error);
    }
  };

  // Check auth provider when modal opens
  useEffect(() => {
    if (isOpen) {
      checkAuthProvider();
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordReset = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!user?.email) {
        throw new Error('User email not found');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate passwords match
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      // Validate password strength
      if (formData.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // For Google users or users without current password, use password reset flow
      if (isGoogleUser || !formData.currentPassword) {
        await handlePasswordReset();
        return;
      }

      // First, verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: formData.currentPassword,
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) throw error;

      setSuccess('Password updated successfully!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className='bg-neutral-900 border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto'
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold text-white font-mondwest'>
                Change Password
              </h3>
              <button
                onClick={onClose}
                className='text-white/60 hover:text-white transition-colors'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className='bg-green-500/10 border border-green-500/30 rounded p-3 mb-4'>
                <p className='text-green-400 text-sm'>{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className='bg-red-500/10 border border-red-500/30 rounded p-3 mb-4'>
                <p className='text-red-400 text-sm'>{error}</p>
              </div>
            )}

            {/* Google User Notice */}
            {isGoogleUser && (
              <div className='bg-blue-500/10 border border-blue-500/30 rounded p-4 mb-6'>
                <div className='flex items-start gap-3'>
                  <Mail className='w-5 h-5 text-blue-400 mt-0.5' />
                  <div>
                    <p className='text-blue-400 font-semibold text-sm mb-1'>
                      Google Account Detected
                    </p>
                    <p className='text-white/70 text-sm mb-3'>
                      Since you signed up with Google, we'll send you a password
                      reset email to set up a new password.
                    </p>
                    <button
                      onClick={handlePasswordReset}
                      disabled={isLoading}
                      className='bg-blue-500 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50'
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Email'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Password Form - Only show for non-Google users */}
            {!isGoogleUser && (
              <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Current Password */}
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Current Password
                  </label>
                  <div className='relative'>
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name='currentPassword'
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className='w-full bg-white/5 border border-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:border-orange-500/50 pr-12'
                      placeholder='Enter current password'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => togglePasswordVisibility('current')}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70'
                    >
                      {showPasswords.current ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    New Password
                  </label>
                  <div className='relative'>
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name='newPassword'
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className='w-full bg-white/5 border border-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:border-orange-500/50 pr-12'
                      placeholder='Enter new password'
                      required
                      minLength={6}
                    />
                    <button
                      type='button'
                      onClick={() => togglePasswordVisibility('new')}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70'
                    >
                      {showPasswords.new ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                  <p className='text-white/50 text-xs mt-1'>
                    Password must be at least 6 characters long
                  </p>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Confirm New Password
                  </label>
                  <div className='relative'>
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name='confirmPassword'
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className='w-full bg-white/5 border border-white/10 p-3 text-white placeholder-white/50 focus:outline-none focus:border-orange-500/50 pr-12'
                      placeholder='Confirm new password'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => togglePasswordVisibility('confirm')}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70'
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3 pt-4'>
                  <button
                    type='button'
                    onClick={onClose}
                    className='flex-1 bg-white/10 border border-white/30 text-white px-4 py-3 font-semibold hover:bg-white/20 transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='flex-1 bg-orange-500 text-black px-4 py-3 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50'
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}

            {/* Alternative Action for Google Users */}
            {!isGoogleUser && (
              <div className='mt-6 pt-4 border-t border-white/10'>
                <p className='text-white/60 text-sm mb-3'>
                  Forgot your current password?
                </p>
                <button
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                  className='w-full bg-white/5 border border-white/20 text-white px-4 py-2 text-sm hover:bg-white/10 transition-colors disabled:opacity-50'
                >
                  Send Reset Email Instead
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChangePasswordModal;

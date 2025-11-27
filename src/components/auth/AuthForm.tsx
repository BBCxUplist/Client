import { motion } from 'framer-motion';
import type { FormData, AuthMode } from './types';

interface AuthFormProps {
  activeMode: AuthMode;
  formData: FormData;
  errors: Partial<FormData>;
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onInputChange: (field: keyof FormData, value: string | boolean) => void;
  onPasswordToggle: () => void;
  onConfirmPasswordToggle: () => void;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

const AuthForm = ({
  activeMode,
  formData,
  errors,
  isLoading,
  showPassword,
  showConfirmPassword,
  onInputChange,
  onPasswordToggle,
  onConfirmPasswordToggle,
  onSubmit,
  className = 'space-y-6',
}: AuthFormProps) => {
  return (
    <motion.form
      key={activeMode}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={onSubmit}
      className={className}
    >
      {/* Name Field (Register Only) */}
      {activeMode === 'register' && (
        <div>
          <label className='block text-white/70 text-sm mb-2'>
            Full Name *
          </label>
          <input
            type='text'
            value={formData.name}
            onChange={e => onInputChange('name', e.target.value)}
            className={`w-full bg-white/5 border ${
              errors.name ? 'border-red-500' : 'border-white/20'
            } text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors`}
            placeholder='Enter your full name'
          />
          {errors.name && (
            <p className='text-red-400 text-xs mt-1'>{errors.name}</p>
          )}
        </div>
      )}

      {/* Email Field */}
      <div>
        <label className='block text-white/70 text-sm mb-2'>
          Email Address *
        </label>
        <input
          type='email'
          value={formData.email}
          onChange={e => onInputChange('email', e.target.value)}
          className={`w-full bg-white/5 border ${
            errors.email ? 'border-red-500' : 'border-white/20'
          } text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors`}
          placeholder='Enter your email'
        />
        {errors.email && (
          <p className='text-red-400 text-xs mt-1'>{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className='block text-white/70 text-sm mb-2'>Password *</label>
        <div className='relative'>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={e => onInputChange('password', e.target.value)}
            className={`w-full bg-white/5 border ${
              errors.password ? 'border-red-500' : 'border-white/20'
            } text-white placeholder:text-white/50 p-3 pr-12 focus:border-orange-500 focus:outline-none transition-colors`}
            placeholder='Enter your password'
          />
          <button
            type='button'
            onClick={onPasswordToggle}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors'
          >
            {showPassword ? (
              <img
                src='/icons/eyeClosed.png'
                alt='eye-off'
                className='w-5 h-5 invert'
              />
            ) : (
              <img
                src='/icons/eyeOpen.png'
                alt='eye'
                className='w-5 h-5 invert'
              />
            )}
          </button>
        </div>
        {errors.password && (
          <p className='text-red-400 text-xs mt-1'>{errors.password}</p>
        )}
      </div>

      {/* Confirm Password Field (Register Only) */}
      {activeMode === 'register' && (
        <>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Confirm Password *
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={e => onInputChange('confirmPassword', e.target.value)}
                className={`w-full bg-white/5 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-white/20'
                } text-white placeholder:text-white/50 p-3 pr-12 focus:border-orange-500 focus:outline-none transition-colors`}
                placeholder='Confirm your password'
              />
              <button
                type='button'
                onClick={onConfirmPasswordToggle}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors'
              >
                {showConfirmPassword ? (
                  <img
                    src='/icons/eyeClosed.png'
                    alt='eye'
                    className='w-5 h-5 invert'
                  />
                ) : (
                  <img
                    src='/icons/eyeOpen.png'
                    alt='eye-off'
                    className='w-5 h-5 invert'
                  />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='text-red-400 text-xs mt-1'>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Artist Toggle */}
          <div className='bg-white/5 p-4 border border-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-white font-semibold text-sm mb-1'>
                  Join as an Artist
                </p>
                <p className='text-white/60 text-xs'>
                  Get verified and receive booking opportunities
                </p>
              </div>
              <button
                type='button'
                onClick={() => onInputChange('isArtist', !formData.isArtist)}
                className={`relative w-12 h-6 border transition-all duration-300 ${
                  formData.isArtist
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white/10 border-white/30'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white transition-all duration-300 ${
                    formData.isArtist ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {formData.isArtist && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className='mt-4 p-3 bg-orange-500/10 border border-orange-500/20'
              >
                <p className='text-orange-400 text-xs'>
                  Upload music and set up your account anytime. Complete your
                  profile and get approved to start receiving booking requests.
                </p>
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* Submit Button */}
      <button
        type='submit'
        disabled={isLoading}
        className={`w-full py-3 font-semibold transition-all duration-300 ${
          isLoading
            ? 'bg-white/10 text-white/50 cursor-not-allowed'
            : 'bg-orange-500 text-black hover:bg-orange-600'
        }`}
      >
        {isLoading ? (
          <div className='flex items-center justify-center gap-2'>
            <div className='w-4 h-4 border-2 border-white/20 border-t-white animate-spin' />
            {activeMode === 'signin' ? 'SIGNING IN...' : 'CREATING ACCOUNT...'}
          </div>
        ) : activeMode === 'signin' ? (
          'SIGN IN'
        ) : (
          'CREATE ACCOUNT'
        )}
      </button>
    </motion.form>
  );
};

export default AuthForm;

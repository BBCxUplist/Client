import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRegisterAPI } from '@/hooks/useRegisterAPI';

interface OTPVerificationProps {
  email: string;
  userRole: 'artist' | 'user';
  onVerificationSuccess: () => void;
  onBack: () => void;
  className?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  userRole,
  onVerificationSuccess,
  onBack,
  className = '',
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize register API hook
  const registerAPIMutation = useRegisterAPI();

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedOtp = text.replace(/\D/g, '').slice(0, 6);
        if (pastedOtp.length === 6) {
          const newOtp = pastedOtp.split('');
          setOtp(newOtp);
          setError('');
          // Focus last input
          inputRefs.current[5]?.focus();
        }
      });
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Step 1: Verify OTP with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpString,
        type: 'email',
      });

      if (error) {
        throw error;
      }

      // Step 2: Call your register API with the access token
      if (data.session?.access_token) {
        try {
          await registerAPIMutation.mutateAsync({
            data: {
              useremail: email,
              role: userRole,
            },
            token: data.session.access_token,
          });
        } catch (apiError: any) {
          // Don't throw here - OTP verification was successful
          console.error('Register API error:', apiError);
        }
      }

      onVerificationSuccess();
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setError(error.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsVerifying(true);
    setError('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        throw error;
      }

      setResendCooldown(60); // 60 seconds cooldown
      setError('');
      // Clear OTP inputs
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      setError(error.message || 'Failed to resend verification code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendMagicLink = async () => {
    setIsVerifying(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?verified=true`,
        },
      });

      if (error) {
        throw error;
      }

      setIsMagicLinkSent(true);
      setResendCooldown(60); // 60 seconds cooldown
    } catch (error: any) {
      console.error('Magic link error:', error);
      setError(error.message || 'Failed to send magic link');
    } finally {
      setIsVerifying(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');
  const isLoading = registerAPIMutation.isPending;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className='text-center'>
        <h2 className='font-mondwest text-2xl xl:text-3xl font-bold text-white mb-2'>
          VERIFY YOUR EMAIL
        </h2>
        <p className='text-white/70 text-sm'>
          We've sent a 6-digit verification code to
        </p>
        <p className='text-orange-500 font-medium'>{email}</p>
      </div>

      {/* OTP Input Boxes */}
      <div className='flex justify-center space-x-3'>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => {
              inputRefs.current[index] = el;
            }}
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
            maxLength={1}
            value={digit}
            onChange={e => handleOtpChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            className='w-12 h-12 text-center text-xl font-bold border-2 border-white/30 rounded-lg bg-transparent text-white focus:border-orange-500 focus:outline-none transition-colors'
            disabled={isLoading || isVerifying}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className='text-center'>
          <p className='text-red-400 text-sm'>{error}</p>
        </div>
      )}

      {/* Magic Link Sent Message */}
      {isMagicLinkSent && (
        <div className='text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg'>
          <p className='text-green-400 text-sm'>
            Magic link sent! Check your email and click the link to verify your
            account.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className='space-y-3'>
        <button
          onClick={handleVerifyOtp}
          disabled={!isOtpComplete || isLoading || isVerifying}
          className='w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors'
        >
          {isLoading || isVerifying ? 'Verifying...' : 'Verify Code'}
        </button>

        <div className='flex space-x-3'>
          <button
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || isLoading}
            className='flex-1 py-2 px-4 border border-white/30 hover:border-white/50 disabled:border-white/20 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors'
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : 'Resend Code'}
          </button>

          <button
            onClick={handleSendMagicLink}
            disabled={resendCooldown > 0 || isLoading}
            className='flex-1 py-2 px-4 border border-white/30 hover:border-white/50 disabled:border-white/20 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors'
          >
            {resendCooldown > 0
              ? `Send Link in ${resendCooldown}s`
              : 'Send Magic Link'}
          </button>
        </div>

        <button
          onClick={onBack}
          disabled={isLoading}
          className='w-full py-2 px-4 text-white/60 hover:text-white text-sm transition-colors'
        >
          ← Back to Registration
        </button>
      </div>

      {/* Help Text */}
      <div className='text-center'>
        <p className='text-white/40 text-xs'>
          Didn't receive the code? Check your spam folder or try the magic link
          option.
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;

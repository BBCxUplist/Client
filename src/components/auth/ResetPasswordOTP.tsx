import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface ResetPasswordOTPProps {
  email: string;
  onBack: () => void;
  className?: string;
}

const ResetPasswordOTP: React.FC<ResetPasswordOTPProps> = ({
  email,
  onBack,
  className = '',
}) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedOtp = text.replace(/\D/g, '').slice(0, 6);
        if (pastedOtp.length === 6) {
          const newOtp = pastedOtp.split('');
          setOtp(newOtp);
          setError('');
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
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpString,
        type: 'recovery',
      });

      if (error) throw error;

      // Navigate to reset password page — Supabase session is set after verifyOtp
      navigate('/reset-password');
    } catch (err: any) {
      console.error('Recovery OTP error:', err);
      setError(err.message || 'Invalid recovery code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsVerifying(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.message || 'Failed to resend recovery code');
    } finally {
      setIsVerifying(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className={`min-h-[calc(100vh-200px)] flex flex-col justify-center ${className}`}>
      <div className='space-y-6'>
        {/* Header */}
        <div className='text-center'>
          <h2 className='font-mondwest text-2xl xl:text-3xl font-bold text-white mb-2'>
            CHECK YOUR EMAIL
          </h2>
          <p className='text-white/70 text-sm'>
            We've sent a 6-digit recovery code to
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
              className='w-12 h-12 text-center text-xl font-bold border-2 border-white/30 bg-transparent text-white focus:border-orange-500 focus:outline-none transition-colors'
              disabled={isVerifying}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className='text-center'>
            <p className='text-red-400 text-sm'>{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className='space-y-3'>
          <button
            onClick={handleVerifyOtp}
            disabled={!isOtpComplete || isVerifying}
            className='w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 disabled:cursor-not-allowed text-white font-medium transition-colors'
          >
            {isVerifying ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className='flex space-x-3'>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isVerifying}
              className='flex-1 py-2 px-4 border border-white/30 hover:border-white/50 disabled:border-white/20 disabled:cursor-not-allowed text-white text-sm transition-colors'
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </button>

            <button
              onClick={onBack}
              disabled={isVerifying}
              className='flex-1 py-2 px-4 border border-white/30 hover:border-white/50 disabled:border-white/20 disabled:cursor-not-allowed text-white text-sm transition-colors'
            >
              Back
            </button>
          </div>
        </div>

        <p className='text-white/40 text-xs text-center'>
          Didn't receive the email? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordOTP;

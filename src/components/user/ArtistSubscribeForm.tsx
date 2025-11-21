import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, User } from 'lucide-react';
import { useSubscribeToArtistById } from '@/services/mailchimpService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FieldError } from '@/components/ui/ErrorMessage';

interface ArtistSubscribeFormProps {
  artistId: string;
  artistName: string;
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
  onSubscribeSuccess?: () => void;
}

export const ArtistSubscribeForm: React.FC<ArtistSubscribeFormProps> = ({
  artistId,
  artistName,
  className = '',
  variant = 'default',
  onSubscribeSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const subscribeToArtist = useSubscribeToArtistById();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear previous errors when user starts typing
    if (fieldError) setFieldError('');

    // Real-time validation
    if (value.trim() && !validateEmail(value)) {
      setFieldError('Please enter a valid email address');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // Client-side validation
    if (!trimmedEmail) {
      setFieldError('Email address is required');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setFieldError('Please enter a valid email address');
      return;
    }

    try {
      setFieldError('');

      await subscribeToArtist.mutateAsync({ artistId, email: trimmedEmail });

      setIsSubscribed(true);
      setEmail('');
      onSubscribeSuccess?.();
    } catch (err) {
      // Error handling is done by the hook with toast notifications
      console.error('Subscription error:', err);
    }
  };

  // Success state
  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`${
          variant === 'compact' ? 'p-4' : 'p-6'
        } bg-green-500/10 border border-green-500/40 rounded-lg ${className}`}
      >
        <div className='text-center'>
          <div className='bg-green-500/20 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center'>
            <CheckCircle className='w-6 h-6 text-green-400' />
          </div>
          <h3
            className={`font-semibold text-green-400 mb-2 ${variant === 'compact' ? 'text-base' : 'text-lg'}`}
          >
            Successfully Subscribed!
          </h3>
          <p
            className={`text-green-400/80 ${variant === 'compact' ? 'text-sm' : 'text-base'}`}
          >
            You've been added to{' '}
            <span className='font-medium'>{artistName}</span>'s newsletter. Stay
            tuned for updates!
          </p>
          <button
            onClick={() => setIsSubscribed(false)}
            className='mt-4 text-green-400/80 hover:text-green-400 text-sm underline transition-colors'
          >
            Subscribe another email
          </button>
        </div>
      </motion.div>
    );
  }

  // Compact inline variant
  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <div className='flex-1'>
          <input
            type='email'
            value={email}
            onChange={handleEmailChange}
            placeholder='Enter your email'
            disabled={subscribeToArtist.isPending}
            className='w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-0 focus:border-orange-500 transition-colors disabled:opacity-50'
          />
          <FieldError message={fieldError} />
        </div>
        <button
          type='submit'
          disabled={
            subscribeToArtist.isPending || !email.trim() || !!fieldError
          }
          className='px-6 py-3 bg-orange-500 text-black font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
        >
          {subscribeToArtist.isPending ? (
            <LoadingSpinner size='sm' color='white' />
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
    );
  }

  // Default and compact variants
  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-lg ${
        variant === 'compact' ? 'p-4' : 'p-6'
      } ${className}`}
    >
      <div className='text-center mb-6'>
        <div className='bg-orange-500/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center'>
          <Mail className='w-6 h-6 text-orange-400' />
        </div>

        <h3
          className={`font-semibold text-white mb-2 font-mondwest ${
            variant === 'compact' ? 'text-lg' : 'text-xl'
          }`}
        >
          Stay Updated with {artistName}
        </h3>

        <p
          className={`text-white/60 ${variant === 'compact' ? 'text-sm' : 'text-base'}`}
        >
          Subscribe to get the latest news, music releases, and tour dates from{' '}
          {artistName}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <div className='relative'>
            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40' />
            <input
              type='email'
              value={email}
              onChange={handleEmailChange}
              placeholder='Enter your email address'
              disabled={subscribeToArtist.isPending}
              className='w-full pl-11 pr-4 py-4 bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-0 focus:border-orange-500 transition-colors disabled:opacity-50 rounded-lg'
            />
          </div>
          <FieldError message={fieldError} />
        </div>

        <button
          type='submit'
          disabled={
            subscribeToArtist.isPending || !email.trim() || !!fieldError
          }
          className='w-full py-4 bg-orange-500 text-black font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center'
        >
          {subscribeToArtist.isPending ? (
            <>
              <LoadingSpinner size='sm' color='white' className='mr-2' />
              Subscribing...
            </>
          ) : (
            <>
              <User className='w-4 h-4 mr-2' />
              Subscribe to Newsletter
            </>
          )}
        </button>

        <div className='text-xs text-white/40 text-center'>
          By subscribing, you agree to receive email updates from {artistName}.
          You can unsubscribe at any time.
        </div>
      </form>
    </div>
  );
};

// Simplified version for embedding in artist profiles
export const ArtistSubscribeWidget: React.FC<{
  artistId: string;
  artistName: string;
  className?: string;
}> = ({ artistId, artistName, className = '' }) => {
  return (
    <ArtistSubscribeForm
      artistId={artistId}
      artistName={artistName}
      variant='compact'
      className={className}
    />
  );
};

// Inline version for quick subscription
export const ArtistSubscribeInline: React.FC<{
  artistId: string;
  artistName: string;
  className?: string;
  onSubscribeSuccess?: () => void;
}> = ({ artistId, artistName, className = '', onSubscribeSuccess }) => {
  return (
    <div className={`${className}`}>
      <div className='mb-3'>
        <h4 className='text-white font-medium text-sm'>
          Subscribe to {artistName}'s Newsletter
        </h4>
        <p className='text-white/60 text-xs'>
          Get updates about new music and shows
        </p>
      </div>
      <ArtistSubscribeForm
        artistId={artistId}
        artistName={artistName}
        variant='inline'
        onSubscribeSuccess={onSubscribeSuccess}
      />
    </div>
  );
};

export default ArtistSubscribeForm;

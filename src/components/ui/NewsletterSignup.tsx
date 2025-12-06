import { useState, type FormEvent, useEffect } from 'react';
import { Mail, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
  useSubscribeToArtist,
  handleMailchimpError,
} from '@/hooks/useMailchimp';
import type {
  NewsletterSignupProps,
  SubscriptionStatus,
} from '@/types/mailchimp';
import toast from 'react-hot-toast';

const NewsletterSignup = ({
  artistId,
  className = '',
  showSubscriberCount = false,
  minimal = false,
  onSubscribe,
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus>('idle');
  const subscriberCount: number | null = null; // Not implemented yet

  const subscribeToArtistMutation = useSubscribeToArtist();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      const response = await subscribeToArtistMutation.mutateAsync({
        artistId,
        email_address: email,
      });

      if (response.success) {
        if (response.message === 'you already subscribe this artist') {
          setStatus('already_subscribed');
          toast("You're already subscribed to this newsletter!");
        } else {
          setStatus('success');
          toast.success('Successfully subscribed to newsletter!');
          onSubscribe?.(email);
        }
        setEmail(''); // Clear form on success
      } else {
        setStatus('error');
        toast.error(handleMailchimpError(response));
      }
    } catch (error: any) {
      setStatus('error');
      toast.error(handleMailchimpError(error));
    }
  };

  // Reset status after a delay
  useEffect(() => {
    if (
      status === 'success' ||
      status === 'already_subscribed' ||
      status === 'error'
    ) {
      const timer = setTimeout(() => setStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className='w-5 h-5 animate-spin text-orange-500' />;
      case 'success':
        return <CheckCircle className='w-5 h-5 text-green-500' />;
      case 'already_subscribed':
        return <CheckCircle className='w-5 h-5 text-blue-500' />;
      case 'error':
        return <AlertCircle className='w-5 h-5 text-red-500' />;
      default:
        return <Mail className='w-5 h-5 text-white/70' />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return 'Subscribing...';
      case 'success':
        return 'Welcome to the newsletter!';
      case 'already_subscribed':
        return "You're already subscribed";
      case 'error':
        return 'Please try again';
      default:
        return 'Get updates on new music & shows';
    }
  };

  const getButtonText = () => {
    switch (status) {
      case 'loading':
        return 'Subscribing...';
      case 'success':
        return 'Subscribed!';
      case 'already_subscribed':
        return 'Already Subscribed';
      default:
        return 'Subscribe';
    }
  };

  const getButtonClassName = () => {
    const baseClasses = 'w-full font-semibold transition-all';
    const sizeClasses = minimal
      ? 'rounded px-3 py-2 text-sm'
      : 'rounded-lg px-4 py-2.5';

    let statusClasses = '';
    if (status === 'success' || status === 'already_subscribed') {
      statusClasses =
        'bg-green-500/20 text-green-400 border border-green-500/40';
    } else if (status === 'error') {
      statusClasses =
        'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30';
    } else {
      statusClasses =
        'bg-orange-500 text-black hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed';
    }

    return `${baseClasses} ${sizeClasses} ${statusClasses}`;
  };

  const isButtonDisabled =
    status === 'loading' ||
    status === 'success' ||
    status === 'already_subscribed';

  const getInputClassName = () => {
    const baseClasses =
      'w-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-orange-500 focus:bg-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed';
    const sizeClasses = minimal
      ? 'rounded px-3 py-2 text-sm'
      : 'rounded-lg px-4 py-2.5';
    return `${baseClasses} ${sizeClasses}`;
  };

  const containerClassName = minimal
    ? 'bg-white/5 border border-white/10 rounded p-3'
    : 'bg-white/5 border border-white/10 rounded-lg p-4';

  return (
    <div className={`${containerClassName} ${className}`}>
      {/* Header */}
      {!minimal && (
        <div className='flex items-center gap-3 mb-3'>
          <div className='flex items-center justify-center w-10 h-10 bg-orange-500/20 rounded-full'>
            {getStatusIcon()}
          </div>
          <div className='flex-1'>
            <h3 className='text-white font-semibold text-lg'>Newsletter</h3>
            <p className='text-white/70 text-sm'>{getStatusMessage()}</p>
          </div>
          {showSubscriberCount && subscriberCount && (
            <div className='flex items-center gap-1 text-orange-400 text-sm'>
              <Users className='w-4 h-4' />
              <span>{(subscriberCount as number).toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {/* Minimal Header */}
      {minimal && (
        <div className='flex items-center gap-2 mb-2'>
          <Mail className='w-4 h-4 text-orange-500' />
          <span className='text-white text-sm font-medium'>Newsletter</span>
          {showSubscriberCount && subscriberCount && (
            <div className='flex items-center gap-1 text-orange-400 text-xs ml-auto'>
              <Users className='w-3 h-3' />
              <span>{(subscriberCount as number).toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className={minimal ? 'space-y-2' : 'space-y-3'}
      >
        <div className='relative'>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={
              minimal ? 'Enter your email' : 'Enter your email address'
            }
            disabled={isButtonDisabled}
            className={getInputClassName()}
          />
        </div>

        <button
          type='submit'
          disabled={isButtonDisabled}
          className={getButtonClassName()}
        >
          {getButtonText()}
        </button>
      </form>

      {/* Privacy note */}
      {!minimal && (
        <p className='text-white/50 text-xs mt-2'>
          We respect your privacy. Unsubscribe at any time.
        </p>
      )}
    </div>
  );
};

export default NewsletterSignup;

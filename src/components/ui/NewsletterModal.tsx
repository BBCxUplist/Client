import { useState, type FormEvent } from 'react';
import { Mail, X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import {
  useSubscribeToArtist,
  handleMailchimpError,
} from '@/hooks/useMailchimp';
import type { SubscriptionStatus } from '@/types/mailchimp';
import { useStore } from '@/stores/store';
import toast from 'react-hot-toast';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistId: string;
  artistName: string;
}

const NewsletterModal = ({
  isOpen,
  onClose,
  artistId,
  artistName,
}: NewsletterModalProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscriptionStatus>('idle');
  const { addNewsletterSubscription, newsletterSubscriptions } = useStore();

  const subscribeToArtistMutation = useSubscribeToArtist();

  // Check if already subscribed
  const isAlreadySubscribed = newsletterSubscriptions.includes(artistId);

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
          // Add to store
          addNewsletterSubscription(artistId);
        }
        setEmail(''); // Clear form on success

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
        toast.error(handleMailchimpError(response));
      }
    } catch (error: any) {
      setStatus('error');
      toast.error(handleMailchimpError(error));
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className='w-8 h-8 animate-spin text-orange-500' />;
      case 'success':
        return <CheckCircle className='w-8 h-8 text-green-500' />;
      case 'already_subscribed':
        return <CheckCircle className='w-8 h-8 text-blue-500' />;
      case 'error':
        return <AlertCircle className='w-8 h-8 text-red-500' />;
      default:
        return <Mail className='w-8 h-8 text-orange-500' />;
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
        return `Subscribe to ${artistName}'s newsletter for updates on new music & shows`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-neutral-900/95 border border-white/20 rounded-lg max-w-md w-full p-6 shadow-2xl'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold text-white font-mondwest'>
            Newsletter
          </h2>
          <button
            onClick={onClose}
            className='text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Already Subscribed State */}
        {isAlreadySubscribed ? (
          <div className='text-center py-8'>
            <div className='w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CheckCircle className='w-8 h-8 text-green-400' />
            </div>
            <h3 className='text-lg font-semibold text-green-400 mb-2 font-mondwest'>
              Already Subscribed!
            </h3>
            <p className='text-white/70 mb-6 leading-relaxed'>
              You're already subscribed to {artistName}'s newsletter.
            </p>
            <button
              onClick={onClose}
              className='bg-green-500/20 border border-green-500/40 text-green-400 px-6 py-3 rounded-lg font-semibold hover:bg-green-500/30 transition-colors'
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Status Icon and Message */}
            <div className='text-center mb-6'>
              <div className='w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                {getStatusIcon()}
              </div>
              <p className='text-white/80 leading-relaxed'>
                {getStatusMessage()}
              </p>
            </div>

            {/* Success/Error States */}
            {status === 'success' ||
            status === 'already_subscribed' ||
            status === 'error' ? (
              <div className='text-center py-6'>
                <button
                  onClick={onClose}
                  className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                    status === 'success' || status === 'already_subscribed'
                      ? 'bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30'
                      : 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  Close
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                  <input
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Enter your email address'
                    disabled={status === 'loading'}
                    className='w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-orange-500 focus:bg-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    autoFocus
                  />
                </div>

                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={onClose}
                    className='flex-1 bg-white/10 border border-white/30 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={status === 'loading'}
                    className='flex-1 bg-orange-500 text-black py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
              </form>
            )}

            {/* Privacy note */}
            <p className='text-white/50 text-xs text-center mt-4'>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsletterModal;

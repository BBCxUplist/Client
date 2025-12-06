import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

const MailchimpCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing'
  );
  const [message, setMessage] = useState('Processing Mailchimp connection...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      // Get the return URL from session storage
      const returnUrl =
        sessionStorage.getItem('mailchimp_return_url') || '/dashboard';

      if (error) {
        setStatus('error');
        setMessage(`Authorization failed: ${error}`);
        toast.error(`Mailchimp connection failed: ${error}`);

        setTimeout(() => {
          sessionStorage.removeItem('mailchimp_return_url');
          navigate(returnUrl, { replace: true });
        }, 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received');
        toast.error('Invalid callback - no authorization code');

        setTimeout(() => {
          sessionStorage.removeItem('mailchimp_return_url');
          navigate(returnUrl, { replace: true });
        }, 3000);
        return;
      }

      try {
        // The backend should handle the OAuth code exchange
        // This endpoint should process the code and return success/error
        const response = await apiClient.post('/mailchimp/callback', {
          code,
          state,
        });

        if (response.data.success) {
          setStatus('success');
          setMessage('Mailchimp connected successfully!');
          toast.success('Mailchimp connected successfully!');

          // Redirect back to the dashboard with success parameter
          setTimeout(() => {
            sessionStorage.removeItem('mailchimp_return_url');
            navigate(`${returnUrl}?mailchimp_success=true`, { replace: true });
          }, 2000);
        } else {
          throw new Error(response.data.message || 'Connection failed');
        }
      } catch (error: any) {
        console.error('Mailchimp callback error:', error);
        setStatus('error');
        setMessage(
          error.response?.data?.message || 'Failed to complete connection'
        );
        toast.error('Failed to complete Mailchimp connection');

        setTimeout(() => {
          sessionStorage.removeItem('mailchimp_return_url');
          navigate(
            `${returnUrl}?mailchimp_error=${encodeURIComponent(error.message)}`,
            { replace: true }
          );
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const getIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className='w-16 h-16 animate-spin text-orange-500' />;
      case 'success':
        return <CheckCircle className='w-16 h-16 text-green-500' />;
      case 'error':
        return <AlertCircle className='w-16 h-16 text-red-500' />;
      default:
        return <Loader2 className='w-16 h-16 animate-spin text-orange-500' />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-orange-500';
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4'>
      <div className='text-center max-w-md'>
        <div className='mb-6'>{getIcon()}</div>

        <h1 className='text-2xl font-bold mb-4 font-mondwest'>
          {status === 'processing' && 'Connecting Mailchimp'}
          {status === 'success' && 'Connection Successful'}
          {status === 'error' && 'Connection Failed'}
        </h1>

        <p className={`mb-6 ${getStatusColor()}`}>{message}</p>

        {status === 'processing' && (
          <div className='text-white/60 text-sm'>
            Please wait while we complete the setup...
          </div>
        )}

        {status === 'success' && (
          <div className='text-white/60 text-sm'>
            Redirecting you back to your dashboard...
          </div>
        )}

        {status === 'error' && (
          <div className='space-y-4'>
            <div className='text-white/60 text-sm'>
              You will be redirected back to your dashboard shortly.
            </div>
            <button
              onClick={() => {
                const returnUrl =
                  sessionStorage.getItem('mailchimp_return_url') ||
                  '/dashboard';
                sessionStorage.removeItem('mailchimp_return_url');
                navigate(returnUrl, { replace: true });
              }}
              className='bg-orange-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors'
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailchimpCallback;

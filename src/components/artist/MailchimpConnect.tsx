import React, { useEffect } from 'react';
import { Mail, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';
import {
  useMailchimpConnection,
  useConnectMailchimp,
  useDisconnectMailchimp,
} from '@/services/mailchimpService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface MailchimpConnectProps {
  onConnectionChange?: (connected: boolean) => void;
}

export const MailchimpConnect: React.FC<MailchimpConnectProps> = ({
  onConnectionChange,
}) => {
  const {
    data: connectionStatus,
    isLoading: isCheckingStatus,
    error,
  } = useMailchimpConnection();
  const connectMutation = useConnectMailchimp();
  const disconnectMutation = useDisconnectMailchimp();

  // Update parent component when connection status changes
  useEffect(() => {
    onConnectionChange?.(!!connectionStatus);
  }, [connectionStatus, onConnectionChange]);

  const handleConnect = () => {
    connectMutation.mutate();
  };

  const handleDisconnect = () => {
    if (
      !window.confirm(
        'Are you sure you want to disconnect your Mailchimp account?'
      )
    ) {
      return;
    }
    disconnectMutation.mutate();
  };

  if (isCheckingStatus) {
    return (
      <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
        <div className='flex items-center justify-center py-8'>
          <LoadingSpinner size='lg' />
          <span className='ml-3 text-white'>
            Checking Mailchimp connection...
          </span>
        </div>
      </div>
    );
  }

  if (connectionStatus) {
    return (
      <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center'>
            <div className='bg-green-500/20 p-2 rounded-lg'>
              <CheckCircle className='w-6 h-6 text-green-400' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-white font-mondwest'>
                Mailchimp Connected
              </h3>
              <p className='text-white/60 text-sm'>
                Your newsletter is ready to go!
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              connectionStatus.isActive
                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
            }`}
          >
            {connectionStatus.isActive ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className='space-y-3 mb-6'>
          <div className='flex justify-between py-2 border-b border-white/10'>
            <span className='text-white/60 text-sm'>Account Name</span>
            <span className='text-white text-sm font-medium'>
              {connectionStatus.accountName}
            </span>
          </div>
          <div className='flex justify-between py-2 border-b border-white/10'>
            <span className='text-white/60 text-sm'>Datacenter</span>
            <span className='text-white text-sm font-medium'>
              {connectionStatus.datacenter}
            </span>
          </div>
          <div className='flex justify-between py-2 border-b border-white/10'>
            <span className='text-white/60 text-sm'>List ID</span>
            <span className='text-white text-sm font-medium font-mono'>
              {connectionStatus.listId}
            </span>
          </div>
          <div className='flex justify-between py-2'>
            <span className='text-white/60 text-sm'>Connected</span>
            <span className='text-white text-sm font-medium'>
              {connectionStatus.createdAt
                ? new Date(connectionStatus.createdAt).toLocaleDateString()
                : 'Unknown'}
            </span>
          </div>
        </div>

        {error && (
          <ErrorMessage
            message={error instanceof Error ? error.message : String(error)}
            onClose={() => {}}
            className='mb-4'
          />
        )}

        <div className='flex gap-3'>
          <button
            onClick={() =>
              window.open('https://mailchimp.com/dashboard', '_blank')
            }
            className='flex-1 bg-white/10 text-white py-3 px-4 border border-white/20 hover:bg-white/20 transition-colors font-medium flex items-center justify-center'
            disabled={connectMutation.isPending || disconnectMutation.isPending}
          >
            <ExternalLink className='w-4 h-4 mr-2' />
            Open Mailchimp
          </button>
          <button
            onClick={handleDisconnect}
            className='flex-1 bg-red-500/20 text-red-400 py-3 px-4 border border-red-500/40 hover:bg-red-500/30 transition-colors font-medium disabled:opacity-50'
            disabled={connectMutation.isPending || disconnectMutation.isPending}
          >
            {disconnectMutation.isPending ? (
              <>
                <LoadingSpinner size='sm' color='white' className='mr-2' />
                Disconnecting...
              </>
            ) : (
              'Disconnect'
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
      <div className='text-center'>
        <div className='bg-orange-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center'>
          <Mail className='w-8 h-8 text-orange-400' />
        </div>

        <h3 className='text-xl font-semibold text-white mb-2 font-mondwest'>
          Connect Your Mailchimp Account
        </h3>
        <p className='text-white/60 text-sm mb-6 max-w-md mx-auto'>
          Link your Mailchimp account to start building and managing your fan
          newsletter. Collect email subscribers and keep your audience engaged
          with updates about your music.
        </p>

        {error && (
          <ErrorMessage
            message={error instanceof Error ? error.message : String(error)}
            onClose={() => {}}
            className='mb-4'
          />
        )}

        <div className='space-y-4'>
          <button
            onClick={handleConnect}
            disabled={connectMutation.isPending}
            className='w-full bg-orange-500 text-black py-4 px-6 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
          >
            {connectMutation.isPending ? (
              <>
                <LoadingSpinner size='sm' color='white' className='mr-2' />
                Connecting to Mailchimp...
              </>
            ) : (
              <>
                <Mail className='w-5 h-5 mr-2' />
                Connect Mailchimp Account
              </>
            )}
          </button>

          <div className='flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/40 rounded-lg text-left'>
            <AlertCircle className='w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0' />
            <div className='text-sm text-blue-400'>
              <p className='font-medium mb-1'>What happens next:</p>
              <ul className='text-xs space-y-1 text-blue-400/80'>
                <li>
                  • You'll be redirected to Mailchimp to authorize the
                  connection
                </li>
                <li>
                  • Select the audience list you want to use for your newsletter
                </li>
                <li>• Return here to start collecting subscribers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailchimpConnect;

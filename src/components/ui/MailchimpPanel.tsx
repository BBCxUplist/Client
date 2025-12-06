import { useState, useEffect } from 'react';
import {
  Mail,
  Settings,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Power,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import {
  useMailchimpConnection,
  useConnectMailchimp,
  useDisconnectMailchimp,
  // useUpdateMailchimpSettings,
  useMailchimpLists,
  useMailchimpSubscribers,
} from '@/hooks/useMailchimp';
import type { MailchimpList } from '@/types/mailchimp';
import toast from 'react-hot-toast';

const MailchimpPanel = () => {
  // const [selectedListId, setSelectedListId] = useState<string>('');
  const [showSubscribers, setShowSubscribers] = useState(false);

  // Queries and mutations
  const {
    data: connection,
    isLoading: connectionLoading,
    refetch: refetchConnection,
  } = useMailchimpConnection();
  const { data: lists, refetch: fetchLists } = useMailchimpLists();
  const { data: subscribersData, refetch: fetchSubscribers } =
    useMailchimpSubscribers({
      status: 'subscribed',
      count: 50,
      offset: 0,
    });

  const connectMutation = useConnectMailchimp();
  const disconnectMutation = useDisconnectMailchimp();
  // const updateSettingsMutation = useUpdateMailchimpSettings();

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('mailchimp_success');
    const error = urlParams.get('mailchimp_error');

    if (success) {
      toast.success('Mailchimp connected successfully!');
      refetchConnection();
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      toast.error(`Connection failed: ${decodeURIComponent(error)}`);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [refetchConnection]); // Fetch lists when connection is established
  useEffect(() => {
    if (connection?.isConnected) {
      fetchLists();
    }
  }, [connection?.isConnected, fetchLists]);

  // Set selected list when connection data loads
  // useEffect(() => {
  //   if (connection?.defaultListId) {
  //     setSelectedListId(connection.defaultListId);
  //   }
  // }, [connection?.defaultListId]);

  const handleConnect = () => {
    connectMutation.mutate();
  };

  const handleDisconnect = () => {
    // Show confirmation toast
    toast(
      t => (
        <div className='flex items-center gap-3'>
          <span>Are you sure you want to disconnect Mailchimp?</span>
          <div className='flex gap-2'>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                disconnectMutation.mutate();
              }}
              className='bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold'
            >
              Yes, Disconnect
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className='bg-gray-500 text-white px-3 py-1 rounded text-sm font-semibold'
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151',
        },
      }
    );
  };

  // const handleUpdateSettings = () => {
  //   if (!selectedListId) {
  //     toast.error('Please select an audience first');
  //     return;
  //   }

  //   updateSettingsMutation.mutate({
  //     list_id: selectedListId,
  //     is_active: true,
  //   });
  // };

  // const handleToggleActive = () => {
  //   updateSettingsMutation.mutate({
  //     is_active: !connection?.isActive,
  //   });
  // };

  const handleViewSubscribers = () => {
    if (!connection?.isConnected) return;

    setShowSubscribers(true);
    fetchSubscribers();
  };

  if (connectionLoading) {
    return (
      <div className='bg-white/5 border border-white/10 rounded-lg p-6'>
        <div className='flex items-center justify-center py-8'>
          <Loader2 className='w-6 h-6 animate-spin text-orange-500' />
          <span className='ml-2 text-white/70'>
            Loading Mailchimp status...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Connection Status */}
      <div className='bg-white/5 border border-white/10 rounded-lg p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-white font-mondwest'>
            Newsletter Integration
          </h3>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              connection?.isConnected
                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {connection?.isConnected ? (
              <>
                <CheckCircle className='w-4 h-4' />
                Connected
              </>
            ) : (
              <>
                <AlertCircle className='w-4 h-4' />
                Not Connected
              </>
            )}
          </div>
        </div>

        {connection?.isConnected ? (
          <div className='space-y-4'>
            {/* Success Message with Navigation */}
            <div className='bg-green-500/10 border border-green-500/30 rounded-lg p-4'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                <CheckCircle className='w-5 h-5 text-green-400 flex-shrink-0' />
                <div className='flex-1'>
                  <p className='text-green-400 font-semibold'>
                    Mailchimp Connected!
                  </p>
                  <p className='text-white/70 text-sm'>
                    You can now send newsletters through your Mailchimp account.
                  </p>
                </div>
                <button
                  onClick={() =>
                    window.open(
                      'https://mailchimp.com/features/email-campaigns/',
                      '_blank'
                    )
                  }
                  className='bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded-lg font-semibold hover:bg-green-500/30 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start'
                >
                  <ExternalLink className='w-4 h-4' />
                  Go to Mailchimp
                </button>
                \n{' '}
              </div>
              \n{' '}
            </div>

            {/* Actions */}
            <div className='flex flex-wrap gap-3 pt-2'>
              <button
                onClick={handleViewSubscribers}
                className='flex items-center gap-2 bg-white/10 border border-white/30 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-colors'
              >
                <Users className='w-4 h-4' />
                View Subscribers
              </button>

              <button
                onClick={() => refetchConnection()}
                className='flex items-center gap-2 bg-white/10 border border-white/30 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-colors'
              >
                <RefreshCw className='w-4 h-4' />
                Refresh
              </button>

              <button
                onClick={handleDisconnect}
                disabled={disconnectMutation.isPending}
                className='flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/40 px-4 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50'
              >
                <Power className='w-4 h-4' />
                {disconnectMutation.isPending
                  ? 'Disconnecting...'
                  : 'Disconnect'}
              </button>
            </div>
          </div>
        ) : (
          <div className='text-center py-6'>
            <Mail className='w-16 h-16 text-white/30 mx-auto mb-4' />
            <h4 className='text-white font-semibold mb-2'>
              Connect Your Mailchimp Account
            </h4>
            <p className='text-white/70 mb-6'>
              Enable newsletter signups for your fans by connecting your
              Mailchimp account.
            </p>
            <button
              onClick={handleConnect}
              disabled={connectMutation.isPending}
              className='bg-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto'
            >
              {connectMutation.isPending ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Connecting...
                </>
              ) : (
                <>
                  <Mail className='w-4 h-4' />
                  Connect Mailchimp
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {connection?.isConnected && connection.defaultListId && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
            <div className='flex items-center gap-3'>
              <Users className='w-8 h-8 text-orange-500' />
              <div>
                <p className='text-white/70 text-sm'>Total Subscribers</p>
                <p className='text-white font-semibold text-lg'>
                  {subscribersData?.total_items
                    ? subscribersData.total_items.toLocaleString()
                    : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
            <div className='flex items-center gap-3'>
              <TrendingUp className='w-8 h-8 text-green-500' />
              <div>
                <p className='text-white/70 text-sm'>Active Status</p>
                <p
                  className={`font-semibold text-lg ${
                    connection.isActive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {connection.isActive ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
            <div className='flex items-center gap-3'>
              <Settings className='w-8 h-8 text-blue-500' />
              <div>
                <p className='text-white/70 text-sm'>Default List</p>
                <p className='text-white font-semibold text-sm'>
                  {lists?.find(
                    (list: MailchimpList) =>
                      list.id === connection.defaultListId
                  )?.name || 'Not Set'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscribers Modal/Panel - Simple implementation */}
      {showSubscribers && (
        <div className='bg-white/5 border border-white/10 rounded-lg p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-white'>
              Recent Subscribers
            </h3>
            <button
              onClick={() => setShowSubscribers(false)}
              className='text-white/60 hover:text-white'
            >
              ×
            </button>
          </div>

          {subscribersData ? (
            <div className='space-y-2'>
              {subscribersData.members?.slice(0, 10).map(subscriber => (
                <div
                  key={subscriber.id}
                  className='flex items-center justify-between py-2 border-b border-white/10'
                >
                  <div>
                    <p className='text-white font-medium'>
                      {subscriber.email_address}
                    </p>
                    <p className='text-white/60 text-sm'>
                      {subscriber.merge_fields.FNAME}{' '}
                      {subscriber.merge_fields.LNAME}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      subscriber.status === 'subscribed'
                        ? 'bg-green-500/20 text-green-400'
                        : subscriber.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {subscriber.status}
                  </div>
                </div>
              ))}
              <p className='text-white/60 text-sm text-center pt-2'>
                Showing 10 of{' '}
                {subscribersData.total_items
                  ? subscribersData.total_items.toLocaleString()
                  : '0'}{' '}
                subscribers
              </p>
            </div>
          ) : (
            <div className='text-center py-4'>
              <Loader2 className='w-6 h-6 animate-spin text-orange-500 mx-auto' />
              <p className='text-white/70 mt-2'>Loading subscribers...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MailchimpPanel;

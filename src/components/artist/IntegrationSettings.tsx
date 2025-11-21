import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Save,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  List,
  User,
  Clock,
  Globe,
} from 'lucide-react';
import {
  useMailchimpLists,
  useUpdateMailchimpSettings,
  type MailchimpAccount,
  type MailchimpSettings,
} from '@/services/mailchimpService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface IntegrationSettingsProps {
  isConnected: boolean;
  account?: MailchimpAccount | null;
  onSettingsChange?: (settings: MailchimpAccount) => void;
}

export const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({
  isConnected,
  account,
  onSettingsChange,
}) => {
  const [settings, setSettings] = useState<MailchimpSettings>({
    list_id: account?.listId,
    is_active: account?.isActive || false,
  });

  // Use hooks
  const { data: availableLists, isLoading: listsLoading } = useMailchimpLists();
  const updateSettingsMutation = useUpdateMailchimpSettings();

  useEffect(() => {
    if (isConnected && account) {
      setSettings({
        list_id: account.listId,
        is_active: account.isActive,
      });
    }
  }, [isConnected, account]);

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings, {
      onSuccess: updatedAccount => {
        onSettingsChange?.(updatedAccount);
      },
    });
  };

  const handleToggleActive = () => {
    setSettings(prev => ({
      ...prev,
      is_active: !prev.is_active,
    }));
  };

  const handleListChange = (listId: string) => {
    setSettings(prev => ({
      ...prev,
      list_id: listId,
    }));
  };

  // Check if settings have changed from current account settings
  const hasUnsavedChanges =
    account &&
    (settings.list_id !== account.listId ||
      settings.is_active !== account.isActive);

  if (!isConnected || !account) {
    return (
      <div className='bg-white/5 border border-white/10 p-8 rounded-lg text-center'>
        <Settings className='w-12 h-12 text-white/40 mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-white mb-2 font-mondwest'>
          Connect Mailchimp First
        </h3>
        <p className='text-white/60 text-sm'>
          Connect your Mailchimp account to access integration settings.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Account Information */}
      <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
        <h3 className='text-xl font-semibold text-white mb-4 font-mondwest flex items-center'>
          <Settings className='w-5 h-5 mr-2' />
          Integration Settings
        </h3>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Account Details */}
          <div className='space-y-4'>
            <div>
              <label className='block text-white/60 text-sm mb-2'>
                Account Information
              </label>
              <div className='space-y-3'>
                <div className='flex justify-between py-2 border-b border-white/10'>
                  <span className='text-white/60 text-sm flex items-center'>
                    <User className='w-4 h-4 mr-2' />
                    Account Name
                  </span>
                  <span className='text-white text-sm font-medium'>
                    {account.accountName}
                  </span>
                </div>
                <div className='flex justify-between py-2 border-b border-white/10'>
                  <span className='text-white/60 text-sm flex items-center'>
                    <Globe className='w-4 h-4 mr-2' />
                    Datacenter
                  </span>
                  <span className='text-white text-sm font-medium'>
                    {account.datacenter}
                  </span>
                </div>
                <div className='flex justify-between py-2'>
                  <span className='text-white/60 text-sm flex items-center'>
                    <Clock className='w-4 h-4 mr-2' />
                    Last Sync
                  </span>
                  <span className='text-white text-sm font-medium'>
                    {account.createdAt
                      ? new Date(account.createdAt).toLocaleDateString()
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className='space-y-4'>
            {/* Integration Status */}
            <div>
              <label className='block text-white/60 text-sm mb-2'>
                Integration Status
              </label>
              <div
                onClick={handleToggleActive}
                className='flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors'
              >
                <div className='flex items-center'>
                  <div
                    className={`p-2 rounded-lg mr-3 ${
                      settings.is_active
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {settings.is_active ? (
                      <ToggleRight className='w-5 h-5' />
                    ) : (
                      <ToggleLeft className='w-5 h-5' />
                    )}
                  </div>
                  <div>
                    <p className='text-white font-medium'>
                      Newsletter Integration
                    </p>
                    <p className='text-white/60 text-sm'>
                      {settings.is_active
                        ? 'Active - Collecting subscribers'
                        : 'Inactive - Not collecting subscribers'}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    settings.is_active
                      ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                  }`}
                >
                  {settings.is_active ? 'On' : 'Off'}
                </div>
              </div>
            </div>

            {/* Audience List Selection */}
            <div>
              <label className='flex items-center text-white/60 text-sm mb-2'>
                <List className='w-4 h-4 mr-2' />
                Mailchimp Audience List
              </label>
              {listsLoading ? (
                <div className='flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-lg'>
                  <LoadingSpinner size='sm' className='mr-2' />
                  <span className='text-white/60'>Loading lists...</span>
                </div>
              ) : availableLists && availableLists.length > 0 ? (
                <select
                  value={settings.list_id || ''}
                  onChange={e => handleListChange(e.target.value)}
                  className='w-full p-3 bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-0 focus:border-orange-500 transition-colors'
                >
                  <option value='' disabled className='bg-gray-800'>
                    Select an audience list
                  </option>
                  {availableLists &&
                    availableLists.map(list => (
                      <option
                        key={list.id}
                        value={list.id}
                        className='bg-gray-800'
                      >
                        {list.name} ({list.member_count} subscribers)
                      </option>
                    ))}
                </select>
              ) : (
                <div className='p-4 bg-white/5 border border-white/10 rounded-lg'>
                  <p className='text-white/60 text-sm'>
                    No audience lists found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Warning for inactive integration */}
      {!settings.is_active && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-yellow-500/10 border border-yellow-500/40 p-4 rounded-lg'
        >
          <div className='flex items-start'>
            <AlertCircle className='w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0' />
            <div className='ml-3'>
              <h4 className='text-yellow-400 font-medium mb-1'>
                Integration Inactive
              </h4>
              <p className='text-yellow-400/80 text-sm'>
                Your newsletter integration is currently inactive. Fans won't be
                able to subscribe to your newsletter until you activate it. Make
                sure to select an audience list and enable the integration.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Save button */}
      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white/5 border border-white/10 p-4 rounded-lg'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white font-medium'>Unsaved Changes</p>
              <p className='text-white/60 text-sm'>
                You have unsaved changes to your integration settings.
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={updateSettingsMutation.isPending}
              className='flex items-center px-6 py-3 bg-orange-500 text-black hover:bg-orange-600 transition-colors disabled:opacity-50 font-medium'
            >
              {updateSettingsMutation.isPending ? (
                <>
                  <LoadingSpinner size='sm' color='white' className='mr-2' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4 mr-2' />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Integration Tips */}
      <div className='bg-blue-500/10 border border-blue-500/40 p-6 rounded-lg'>
        <h4 className='text-blue-400 font-medium mb-3'>💡 Integration Tips</h4>
        <div className='space-y-2 text-blue-400/80 text-sm'>
          <p>
            • Keep your integration active to automatically collect fan email
            subscriptions
          </p>
          <p>
            • Choose your primary audience list where you want to collect
            newsletter subscribers
          </p>
          <p>
            • Sync your subscribers regularly to get the latest data from
            Mailchimp
          </p>
          <p>
            • You can change your audience list anytime, but existing
            subscribers will stay in the old list
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Users, Settings, List } from 'lucide-react';
import MailchimpConnect from './MailchimpConnect';
import SubscribersList from './SubscribersList';
import IntegrationSettings from './IntegrationSettings';
import {
  useMailchimpConnection,
  type MailchimpAccount,
} from '@/services/mailchimpService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

enum NewsletterTabType {
  OVERVIEW = 'overview',
  SUBSCRIBERS = 'subscribers',
  SETTINGS = 'settings',
}

export const NewsletterTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NewsletterTabType>(
    NewsletterTabType.OVERVIEW
  );

  const { data: account, isLoading: isCheckingStatus } =
    useMailchimpConnection();
  const isConnected = !!account;

  const handleConnectionChange = useCallback((connected: boolean) => {
    // The hook handles connection status automatically, just switch tabs if needed
    if (!connected) {
      setActiveTab(NewsletterTabType.OVERVIEW);
    }
  }, []);

  const handleSettingsChange = useCallback(
    (updatedAccount: MailchimpAccount) => {
      // Account data is managed by the hook, no need to set state manually
      console.log('Settings updated:', updatedAccount);
    },
    []
  );

  const getTabIcon = (tab: NewsletterTabType) => {
    switch (tab) {
      case NewsletterTabType.OVERVIEW:
        return <Mail className='w-4 h-4' />;
      case NewsletterTabType.SUBSCRIBERS:
        return <Users className='w-4 h-4' />;
      case NewsletterTabType.SETTINGS:
        return <Settings className='w-4 h-4' />;
    }
  };

  const tabs = [
    { id: NewsletterTabType.OVERVIEW, label: 'Overview' },
    {
      id: NewsletterTabType.SUBSCRIBERS,
      label: 'Subscribers',
      disabled: !isConnected,
    },
    {
      id: NewsletterTabType.SETTINGS,
      label: 'Settings',
      disabled: !isConnected,
    },
  ];

  if (isCheckingStatus) {
    return (
      <div className='flex items-center justify-center py-12'>
        <LoadingSpinner size='lg' />
        <span className='ml-3 text-white'>Checking newsletter status...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      {/* Newsletter Header */}
      <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-white font-mondwest flex items-center'>
              <Mail className='w-6 h-6 mr-3' />
              Newsletter Management
            </h2>
            <p className='text-white/60 mt-1'>
              Build and manage your fan newsletter with Mailchimp integration
            </p>
          </div>

          {account && (
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                account.isActive
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
              }`}
            >
              {account.isActive ? 'Newsletter Active' : 'Newsletter Inactive'}
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview (only show when connected) */}
      {isConnected && account && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className='grid grid-cols-1 md:grid-cols-3 gap-4'
        >
          <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
            <div className='flex items-center'>
              <div className='bg-blue-500/20 p-2 rounded-lg'>
                <Users className='w-5 h-5 text-blue-400' />
              </div>
              <div className='ml-3'>
                <p className='text-white/60 text-sm'>Total Subscribers</p>
                <p className='text-white text-xl font-bold'>-</p>
              </div>
            </div>
          </div>

          <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
            <div className='flex items-center'>
              <div className='bg-green-500/20 p-2 rounded-lg'>
                <List className='w-5 h-5 text-green-400' />
              </div>
              <div className='ml-3'>
                <p className='text-white/60 text-sm'>Active List</p>
                <p className='text-white text-sm font-medium'>
                  {account.accountName}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
            <div className='flex items-center'>
              <div className='bg-orange-500/20 p-2 rounded-lg'>
                <Settings className='w-5 h-5 text-orange-400' />
              </div>
              <div className='ml-3'>
                <p className='text-white/60 text-sm'>Last Sync</p>
                <p className='text-white text-sm font-medium'>
                  {account.createdAt
                    ? new Date(account.createdAt).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className='bg-white/5 border border-white/10 rounded-lg overflow-hidden'>
        <div className='flex border-b border-white/10'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-500/20 text-orange-400 border-b-2 border-orange-500'
                  : tab.disabled
                    ? 'text-white/30 cursor-not-allowed'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {getTabIcon(tab.id)}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          <AnimatePresence mode='wait'>
            {activeTab === NewsletterTabType.OVERVIEW && (
              <motion.div
                key='overview'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <MailchimpConnect onConnectionChange={handleConnectionChange} />
              </motion.div>
            )}

            {activeTab === NewsletterTabType.SUBSCRIBERS && (
              <motion.div
                key='subscribers'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <SubscribersList isConnected={isConnected} />
              </motion.div>
            )}

            {activeTab === NewsletterTabType.SETTINGS && (
              <motion.div
                key='settings'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <IntegrationSettings
                  isConnected={isConnected}
                  account={account}
                  onSettingsChange={handleSettingsChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Getting Started Tips (only show when not connected) */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className='bg-blue-500/10 border border-blue-500/40 p-6 rounded-lg'
        >
          <h3 className='text-blue-400 font-medium mb-3'>
            🚀 Getting Started with Newsletter
          </h3>
          <div className='space-y-2 text-blue-400/80 text-sm'>
            <p>
              • <strong>Connect Mailchimp:</strong> Link your Mailchimp account
              to start collecting subscribers
            </p>
            <p>
              • <strong>Choose Your List:</strong> Select which audience list to
              use for your newsletter
            </p>
            <p>
              • <strong>Activate Integration:</strong> Enable the newsletter to
              start collecting fan emails
            </p>
            <p>
              • <strong>Manage Subscribers:</strong> View, search, and export
              your subscriber list
            </p>
            <p>
              • <strong>Stay Engaged:</strong> Use Mailchimp to send updates
              about your music and shows
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NewsletterTab;

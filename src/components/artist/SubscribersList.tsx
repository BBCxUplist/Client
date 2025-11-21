import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  MoreVertical,
} from 'lucide-react';
import {
  useSubscribers,
  useSyncSubscribers,
  useExportSubscribers,
} from '@/services/mailchimpService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface SubscribersListProps {
  isConnected: boolean;
}

export const SubscribersList: React.FC<SubscribersListProps> = ({
  isConnected,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'subscribed' | 'unsubscribed' | 'pending'
  >('subscribed');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  // Use the hooks
  const {
    data: subscribersData,
    isLoading,
    error,
    refetch,
  } = useSubscribers({
    status: statusFilter,
    count: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    search: searchTerm.trim() || undefined,
  });

  const syncSubscribers = useSyncSubscribers();
  const exportSubscribers = useExportSubscribers();

  const subscribers = subscribersData?.data?.subscribers || [];
  const totalItems = subscribersData?.data?.total_items || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const handleRefresh = () => {
    syncSubscribers.mutate(undefined, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleExport = () => {
    exportSubscribers.mutate(statusFilter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (
    status: 'subscribed' | 'unsubscribed' | 'pending'
  ) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'subscribed':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'unsubscribed':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isConnected) {
    return (
      <div className='bg-white/5 border border-white/10 p-8 rounded-lg text-center'>
        <Mail className='w-12 h-12 text-white/40 mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-white mb-2 font-mondwest'>
          Connect Mailchimp First
        </h3>
        <p className='text-white/60 text-sm'>
          Connect your Mailchimp account to view and manage your subscribers.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header with stats and actions */}
      <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h3 className='text-xl font-semibold text-white mb-1 font-mondwest'>
              Subscriber Management
            </h3>
            <div className='flex items-center gap-2 text-sm text-white/60'>
              <Users className='w-4 h-4' />
              <span>{totalItems} total subscribers</span>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <button
              onClick={handleRefresh}
              disabled={syncSubscribers.isPending}
              className='flex items-center justify-center px-4 py-2 bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50'
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${syncSubscribers.isPending ? 'animate-spin' : ''}`}
              />
              {syncSubscribers.isPending ? 'Syncing...' : 'Sync'}
            </button>

            <button
              onClick={handleExport}
              disabled={exportSubscribers.isPending || isLoading}
              className='flex items-center justify-center px-4 py-2 bg-orange-500 text-black hover:bg-orange-600 transition-colors disabled:opacity-50 font-medium'
            >
              {exportSubscribers.isPending ? (
                <LoadingSpinner size='sm' color='white' className='mr-2' />
              ) : (
                <Download className='w-4 h-4 mr-2' />
              )}
              {exportSubscribers.isPending ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40' />
              <input
                type='text'
                placeholder='Search subscribers by email...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-0 focus:border-orange-500 transition-colors'
              />
            </div>
          </div>

          {/* Status filter */}
          <div className='flex items-center gap-2'>
            <Filter className='w-4 h-4 text-white/60' />
            <div className='flex bg-white/10 border border-white/20 rounded overflow-hidden'>
              {(['subscribed', 'unsubscribed', 'pending'] as const).map(
                status => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilterChange(status)}
                    className={`px-4 py-3 text-sm font-medium transition-colors capitalize ${
                      statusFilter === status
                        ? 'bg-orange-500 text-black'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <ErrorMessage
          message={error instanceof Error ? error.message : String(error)}
          onClose={() => {}}
        />
      )}

      {/* Subscribers list */}
      <div className='bg-white/5 border border-white/10 rounded-lg overflow-hidden'>
        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <LoadingSpinner size='lg' />
            <span className='ml-3 text-white'>Loading subscribers...</span>
          </div>
        ) : subscribers.length === 0 ? (
          <div className='text-center py-12'>
            <Users className='w-12 h-12 text-white/40 mx-auto mb-4' />
            <h4 className='text-lg font-semibold text-white mb-2'>
              No {statusFilter} subscribers found
            </h4>
            <p className='text-white/60 text-sm'>
              {searchTerm
                ? `No subscribers match your search for "${searchTerm}"`
                : `You don't have any ${statusFilter} subscribers yet.`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table view */}
            <div className='hidden lg:block overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-white/10'>
                    <th className='px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider'>
                      Email Address
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider'>
                      Subscribed Date
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider'>
                      Tags
                    </th>
                    <th className='px-6 py-4 text-right text-xs font-medium text-white/60 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-white/10'>
                  {subscribers.map((subscriber, index) => (
                    <motion.tr
                      key={subscriber.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className='hover:bg-white/5'
                    >
                      <td className='px-6 py-4'>
                        <div className='flex items-center'>
                          <div className='bg-orange-500/20 p-2 rounded-full mr-3'>
                            <Mail className='w-4 h-4 text-orange-400' />
                          </div>
                          <span className='text-white font-medium'>
                            {subscriber.email_address}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-2 py-1 text-xs font-semibold border rounded-full ${getStatusColor(subscriber.status)}`}
                        >
                          {subscriber.status.toUpperCase()}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-white/80'>
                        <div className='flex items-center'>
                          <Calendar className='w-4 h-4 text-white/40 mr-2' />
                          {formatDate(subscriber.timestamp_signup)}
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        {subscriber.tags && subscriber.tags.length > 0 ? (
                          <div className='flex flex-wrap gap-1'>
                            {subscriber.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className='px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded'
                              >
                                {tag}
                              </span>
                            ))}
                            {subscriber.tags.length > 3 && (
                              <span className='text-white/60 text-xs'>
                                +{subscriber.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className='text-white/40 text-sm'>No tags</span>
                        )}
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <button className='text-white/60 hover:text-white transition-colors'>
                          <MoreVertical className='w-4 h-4' />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className='lg:hidden space-y-3 p-4'>
              {subscribers.map((subscriber, index) => (
                <motion.div
                  key={subscriber.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className='bg-white/5 border border-white/10 p-4 rounded-lg'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center flex-1'>
                      <div className='bg-orange-500/20 p-2 rounded-full mr-3'>
                        <Mail className='w-4 h-4 text-orange-400' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-white font-medium truncate'>
                          {subscriber.email_address}
                        </p>
                        <p className='text-white/60 text-sm flex items-center'>
                          <Calendar className='w-3 h-3 mr-1' />
                          {formatDate(subscriber.timestamp_signup)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold border rounded-full ${getStatusColor(subscriber.status)}`}
                    >
                      {subscriber.status.toUpperCase()}
                    </span>
                  </div>

                  {subscriber.tags && subscriber.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-2'>
                      {subscriber.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className='px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded'
                        >
                          {tag}
                        </span>
                      ))}
                      {subscriber.tags.length > 3 && (
                        <span className='text-white/60 text-xs py-1'>
                          +{subscriber.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {subscribers.length > 0 && totalPages > 1 && (
          <div className='border-t border-white/10 p-4'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-white/60'>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{' '}
                {totalItems} subscribers
              </div>

              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className='p-2 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors'
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>

                <span className='px-4 py-2 text-white'>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className='p-2 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors'
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribersList;

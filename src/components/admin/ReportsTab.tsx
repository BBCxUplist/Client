import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

interface Report {
  id: string;
  type: 'content' | 'user' | 'artist';
  reportedBy: string;
  reportedItem: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

const ReportsTab = ({ dummyReports }: { dummyReports: Report[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    const filtered = dummyReports.filter(report => {
      const matchesSearch =
        report.reportedItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || report.type === filterType;
      const matchesStatus =
        filterStatus === 'all' || report.status === filterStatus;
      const matchesPriority =
        filterPriority === 'all' || report.priority === filterPriority;

      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });

    // Sort reports
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        }
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    dummyReports,
    searchTerm,
    filterType,
    filterStatus,
    filterPriority,
    sortBy,
    sortOrder,
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'resolved':
        return 'text-green-400 bg-green-500/20';
      case 'dismissed':
        return 'text-gray-400 bg-gray-500/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'low':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content':
        return (
          <svg
            className='w-5 h-5 text-blue-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
        );
      case 'user':
        return (
          <svg
            className='w-5 h-5 text-green-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            />
          </svg>
        );
      case 'artist':
        return (
          <svg
            className='w-5 h-5 text-purple-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleStatusChange = (reportId: string, newStatus: string) => {
    console.log(`Changing report ${reportId} status to ${newStatus}`);
    // Implement status change logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-6'
    >
      <div>
        <h2 className='text-2xl font-bold text-white mb-4'>
          Reports Management
        </h2>
        <p className='text-white/70'>
          Review and manage user reports and complaints
        </p>
      </div>

      {/* Search and Filters */}
      <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
          {/* Search */}
          <div className='lg:col-span-2'>
            <label className='block text-white/70 text-sm mb-2'>
              Search Reports
            </label>
            <input
              type='text'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Search by item, user, or reason...'
              className='w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className='block text-white/70 text-sm mb-2'>Type</label>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className='w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'
            >
              <option value='all'>All Types</option>
              <option value='content'>Content</option>
              <option value='user'>User</option>
              <option value='artist'>Artist</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className='block text-white/70 text-sm mb-2'>Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className='w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'
            >
              <option value='all'>All Status</option>
              <option value='pending'>Pending</option>
              <option value='resolved'>Resolved</option>
              <option value='dismissed'>Dismissed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className='block text-white/70 text-sm mb-2'>Priority</label>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className='w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'
            >
              <option value='all'>All Priorities</option>
              <option value='high'>High</option>
              <option value='medium'>Medium</option>
              <option value='low'>Low</option>
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className='flex items-center gap-4 mt-4 pt-4 border-t border-white/10'>
          <span className='text-white/70 text-sm'>Sort by:</span>
          <select
            value={sortBy}
            onChange={e =>
              setSortBy(e.target.value as 'date' | 'priority' | 'type')
            }
            className='bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'
          >
            <option value='date'>Date</option>
            <option value='priority'>Priority</option>
            <option value='type'>Type</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className='bg-white/5 border border-white/20 text-white p-2 rounded hover:bg-white/10 transition-colors'
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Reports Count */}
      <div className='flex items-center justify-between'>
        <p className='text-white/70'>
          Showing {filteredAndSortedReports.length} of {dummyReports.length}{' '}
          reports
        </p>
        <div className='flex gap-2'>
          <button className='bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded text-sm hover:bg-green-500/30 transition-colors'>
            Bulk Resolve
          </button>
          <button className='bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded text-sm hover:bg-red-500/30 transition-colors'>
            Bulk Dismiss
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className='space-y-4'>
        {filteredAndSortedReports.map(report => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white/5 border border-white/10 p-4 rounded-lg'
          >
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-center gap-3'>
                {getTypeIcon(report.type)}
                <div>
                  <h4 className='text-white font-semibold'>
                    {report.reportedItem}
                  </h4>
                  <p className='text-white/60 text-sm'>
                    Reported by {report.reportedBy}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(report.priority)}`}
                >
                  {report.priority.toUpperCase()}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(report.status)}`}
                >
                  {report.status}
                </span>
              </div>
            </div>

            <p className='text-white/80 text-sm mb-3'>{report.reason}</p>

            <div className='flex items-center justify-between text-sm'>
              <span className='text-white/60'>
                Reported on {new Date(report.createdAt).toLocaleDateString()}
              </span>
              <div className='flex gap-2'>
                {report.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(report.id, 'resolved')}
                      className='bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded hover:bg-green-500/30 transition-colors'
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleStatusChange(report.id, 'dismissed')}
                      className='bg-gray-500/20 border border-gray-500/40 text-gray-400 px-3 py-1 rounded hover:bg-gray-500/30 transition-colors'
                    >
                      Dismiss
                    </button>
                  </>
                )}
                <button className='bg-white/10 border border-white/20 text-white px-3 py-1 rounded hover:bg-white/20 transition-colors'>
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedReports.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-white/60 text-lg'>
            No reports found matching your criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterStatus('all');
              setFilterPriority('all');
            }}
            className='text-orange-400 hover:text-orange-300 mt-2'
          >
            Clear all filters
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ReportsTab;

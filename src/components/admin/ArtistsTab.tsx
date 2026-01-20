import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  useApproveUser,
  useBanUser,
  useRejectUser,
  useDeleteUser,
  useDemoteUser,
  useSetFeaturedArtist,
} from '@/hooks/admin';

interface Artist {
  id: string;
  name: string;
  email: string;
  status: 'verified' | 'appeal' | 'rejected' | 'suspended';
  joinDate: string;
  bookings: number;
  revenue: number;
  slug: string;
  avatar: string | undefined;
  bio: string | undefined;
  price: number;
  genres: string[];
  isBookable: boolean;
  appealStatus: string;
  featured: boolean;
  createdAt: string;
  isApproved: boolean;
}

interface ArtistsTabProps {
  searchTerm: string;
  filterStatus: string;
  filteredArtists: Artist[];
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onStatusChange?: (
    id: string,
    newStatus: string,
    type: 'artist' | 'user'
  ) => void;
}

const ArtistsTab = ({
  searchTerm,
  filterStatus,
  filteredArtists,
  onSearchChange,
  onFilterChange,
}: ArtistsTabProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [actionInProgress, setActionInProgress] = useState<{
    type:
      | 'approve'
      | 'reject'
      | 'ban'
      | 'demote'
      | 'delete'
      | 'featured'
      | null;
    artistId: string | null;
  }>({ type: null, artistId: null });

  // Admin action hooks
  const approveUser = useApproveUser();
  const banUser = useBanUser();
  const rejectUser = useRejectUser();
  const deleteUser = useDeleteUser();
  const demoteUser = useDemoteUser();
  const setFeaturedArtist = useSetFeaturedArtist();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-400 bg-green-500/20';
      case 'appeal':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'rejected':
        return 'text-red-400 bg-red-500/20';
      case 'suspended':
        return 'text-gray-400 bg-gray-500/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const handleApprove = (artistId: string) => {
    setActionInProgress({ type: 'approve', artistId });
    approveUser.mutate(artistId, {
      onSettled: () => setActionInProgress({ type: null, artistId: null }),
    });
  };

  const handleReject = (artistId: string) => {
    setActionInProgress({ type: 'reject', artistId });
    rejectUser.mutate(artistId, {
      onSettled: () => setActionInProgress({ type: null, artistId: null }),
    });
  };

  const handleBan = (artistId: string) => {
    setActionInProgress({ type: 'ban', artistId });
    banUser.mutate(artistId, {
      onSettled: () => setActionInProgress({ type: null, artistId: null }),
    });
  };

  const handleDelete = (artistId: string) => {
    if (showDeleteConfirm === artistId) {
      setActionInProgress({ type: 'delete', artistId });
      deleteUser.mutate(artistId, {
        onSettled: () => setActionInProgress({ type: null, artistId: null }),
      });
      setShowDeleteConfirm(null);
    } else {
      setShowDeleteConfirm(artistId);
      // Auto-hide confirmation after 5 seconds
      setTimeout(() => setShowDeleteConfirm(null), 5000);
    }
  };

  const handleDemote = (artistId: string) => {
    setActionInProgress({ type: 'demote', artistId });
    demoteUser.mutate(artistId, {
      onSettled: () => setActionInProgress({ type: null, artistId: null }),
    });
  };

  const handleToggleFeatured = (artistId: string, currentFeatured: boolean) => {
    setActionInProgress({ type: 'featured', artistId });
    setFeaturedArtist.mutate(
      { artistId, featured: !currentFeatured },
      {
        onSettled: () => setActionInProgress({ type: null, artistId: null }),
      }
    );
  };

  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case "verified":
  //       return (
  //         <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  //         </svg>
  //       );
  //     case "appeal":
  //       return (
  //         <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
  //         </svg>
  //       );
  //     case "rejected":
  //       return (
  //         <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //         </svg>
  //       );
  //     case "suspended":
  //       return (
  //         <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
  //         </svg>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(amount);
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
          Artist Management
        </h2>
        <p className='text-white/70'>
          Manage artist profiles, verifications, and appeals
        </p>
      </div>

      {/* Search and Filters */}
      <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Search Artists
            </label>
            <input
              type='text'
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              placeholder='Search by name or email...'
              className='w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'
            />
          </div>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={e => onFilterChange(e.target.value)}
              className='w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'
            >
              <option value='all'>All Status</option>
              <option value='verified'>Verified</option>
              <option value='appeal'>Appeal</option>
              <option value='rejected'>Rejected</option>
              <option value='suspended'>Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Artists Count */}
      <div className='flex items-center justify-between'>
        <p className='text-white/70'>
          Showing {filteredArtists.length} artists
        </p>
        <div className='flex gap-2'>
          <button className='bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded text-sm hover:bg-green-500/30 transition-colors'>
            Bulk Verify
          </button>
          <button className='bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-3 py-1 rounded text-sm hover:bg-yellow-500/30 transition-colors'>
            Review Appeals
          </button>
        </div>
      </div>

      {/* Artists List */}
      <div className='space-y-4'>
        {filteredArtists.map(artist => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white/5 border border-white/10 p-4 rounded-lg'
          >
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-center gap-3'>
                {artist.avatar ? (
                  <img
                    src={artist.avatar || '/images/artistNotFound.jpeg'}
                    alt={artist.name}
                    className='w-12 h-12 object-cover border-2 border-white/20'
                    onError={e => {
                      e.currentTarget.src = '/images/artistNotFound.jpeg';
                    }}
                  />
                ) : (
                  <div className='w-12 h-12 bg-orange-500 flex items-center justify-center text-black font-bold text-lg'>
                    {artist.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className='text-white font-semibold'>{artist.name}</h4>
                  <p className='text-white/60 text-sm'>{artist.email}</p>
                  {artist.bio && (
                    <p className='text-white/50 text-xs mt-1 line-clamp-2 max-w-xs'>
                      {artist.bio}
                    </p>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(artist.status)}`}
                >
                  {artist.status === 'appeal'
                    ? 'APPEAL'
                    : artist.status.toUpperCase()}
                </span>
                {artist.featured && (
                  <span className='px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/40'>
                    FEATURED
                  </span>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mb-3 text-sm'>
              <div>
                <span className='text-white/70'>Join Date: </span>
                <span className='text-white'>
                  {new Date(artist.joinDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className='text-white/70'>Bookings: </span>
                <span className='text-white'>{artist.bookings}</span>
              </div>
              <div>
                <span className='text-white/70'>Revenue: </span>
                <span className='text-white'>
                  {formatCurrency(artist.revenue)}
                </span>
              </div>
              <div>
                <span className='text-white/70'>Price: </span>
                <span className='text-orange-400 font-semibold'>
                  {formatCurrency(artist.price)}
                </span>
              </div>
            </div>

            {/* Tags and Categories */}
            <div className='mb-3'>
              <div className='flex flex-wrap gap-2 mb-2'>
                {artist.genres.slice(0, 3).map((genre, index) => (
                  <span
                    key={index}
                    className='px-2 py-1 bg-white/10 border border-white/20 text-white/80 text-xs rounded'
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <a
                  href={`/artist/${artist.slug}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-white/10 border border-white/20 text-white px-3 py-1 rounded hover:bg-white/20 transition-colors text-sm'
                >
                  View Profile
                </a>
                {/* <button className='bg-white/10 border border-white/20 text-white px-3 py-1 rounded hover:bg-white/20 transition-colors text-sm'>
                  View Documents
                </button> */}
              </div>
              <div className='flex flex-wrap gap-2'>
                {/* Approval actions for pending/appeal artists */}
                {(artist.status === 'appeal' || !artist.isApproved) && (
                  <>
                    <button
                      onClick={() => handleApprove(artist.id)}
                      disabled={
                        actionInProgress.type === 'approve' &&
                        actionInProgress.artistId === artist.id
                      }
                      className='bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded hover:bg-green-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {actionInProgress.type === 'approve' &&
                      actionInProgress.artistId === artist.id
                        ? 'Approving...'
                        : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(artist.id)}
                      disabled={
                        actionInProgress.type === 'reject' &&
                        actionInProgress.artistId === artist.id
                      }
                      className='bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {actionInProgress.type === 'reject' &&
                      actionInProgress.artistId === artist.id
                        ? 'Rejecting...'
                        : 'Reject'}
                    </button>
                  </>
                )}

                {/* Ban action for verified artists */}
                {artist.status === 'verified' && (
                  <button
                    onClick={() => handleBan(artist.id)}
                    disabled={
                      actionInProgress.type === 'ban' &&
                      actionInProgress.artistId === artist.id
                    }
                    className='bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-3 py-1 rounded hover:bg-yellow-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {actionInProgress.type === 'ban' &&
                    actionInProgress.artistId === artist.id
                      ? 'Banning...'
                      : 'Ban Artist'}
                  </button>
                )}

                {/* Reactivate action for banned/suspended artists */}
                {artist.status === 'suspended' && (
                  <button
                    onClick={() => handleApprove(artist.id)}
                    disabled={
                      actionInProgress.type === 'approve' &&
                      actionInProgress.artistId === artist.id
                    }
                    className='bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded hover:bg-green-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {actionInProgress.type === 'approve' &&
                    actionInProgress.artistId === artist.id
                      ? 'Reactivating...'
                      : 'Reactivate'}
                  </button>
                )}

                {/* Demote action - convert artist to regular user */}
                <button
                  onClick={() => handleDemote(artist.id)}
                  disabled={
                    actionInProgress.type === 'demote' &&
                    actionInProgress.artistId === artist.id
                  }
                  className='bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1 rounded hover:bg-purple-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                  title='Demote to regular user'
                >
                  {actionInProgress.type === 'demote' &&
                  actionInProgress.artistId === artist.id
                    ? 'Demoting...'
                    : 'Demote to user'}
                </button>

                {/* Featured toggle */}
                <button
                  onClick={() =>
                    handleToggleFeatured(artist.id, artist.featured)
                  }
                  disabled={
                    actionInProgress.type === 'featured' &&
                    actionInProgress.artistId === artist.id
                  }
                  className={`border px-3 py-1 rounded transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    artist.featured
                      ? 'bg-orange-500/30 border-orange-500/60 text-orange-300 hover:bg-orange-500/40'
                      : 'bg-orange-500/20 border-orange-500/40 text-orange-400 hover:bg-orange-500/30'
                  }`}
                  title={
                    artist.featured ? 'Remove from featured' : 'Add to featured'
                  }
                >
                  {actionInProgress.type === 'featured' &&
                  actionInProgress.artistId === artist.id
                    ? 'Updating...'
                    : artist.featured
                      ? '★ Featured'
                      : '☆ Feature'}
                </button>

                {/* Delete action with confirmation */}
                <button
                  onClick={() => handleDelete(artist.id)}
                  disabled={
                    actionInProgress.type === 'delete' &&
                    actionInProgress.artistId === artist.id
                  }
                  className={`border px-3 py-1 rounded transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    showDeleteConfirm === artist.id
                      ? 'bg-red-500/40 border-red-500/60 text-white'
                      : 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                  }`}
                  title={
                    showDeleteConfirm === artist.id
                      ? 'Click again to confirm deletion'
                      : 'Delete artist account'
                  }
                >
                  {actionInProgress.type === 'delete' &&
                  actionInProgress.artistId === artist.id
                    ? 'Deleting...'
                    : showDeleteConfirm === artist.id
                      ? 'Confirm Delete?'
                      : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredArtists.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-white/60 text-lg'>
            No artists found matching your criteria
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              onFilterChange('all');
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

export default ArtistsTab;

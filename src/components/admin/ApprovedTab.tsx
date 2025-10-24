import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useApproveUser, useRejectUser, useDeleteUser } from '@/hooks/admin';

interface Artist {
  id: string;
  name: string;
  email: string;
  avatar: string | undefined;
  bio: string | undefined;
  genres: string[];
  location: string;
  appealStatus: string;
  isApproved: boolean;
  createdAt: string;
  slug?: string;
}

interface ApprovedTabProps {
  artists: Artist[];
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void;
}

const ApprovedTab = ({ artists, onStatusChange }: ApprovedTabProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Admin action hooks
  const approveUser = useApproveUser();
  const rejectUser = useRejectUser();
  const deleteUser = useDeleteUser();

  // Filter artists with appeal status 'requested' or 'rejected'
  const pendingArtists = useMemo(() => {
    return artists.filter(
      artist =>
        artist.appealStatus === 'requested' ||
        artist.appealStatus === 'rejected'
    );
  }, [artists]);

  // Apply search filter
  const filteredArtists = useMemo(() => {
    return pendingArtists.filter(
      artist =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, pendingArtists]);

  const handleApprove = (artistId: string) => {
    approveUser.mutate(artistId);
    onStatusChange(artistId, 'approved');
  };

  const handleReject = (artistId: string) => {
    rejectUser.mutate(artistId);
    onStatusChange(artistId, 'rejected');
  };

  const handleDelete = (artistId: string) => {
    if (showDeleteConfirm === artistId) {
      deleteUser.mutate(artistId);
      setShowDeleteConfirm(null);
    } else {
      setShowDeleteConfirm(artistId);
      setTimeout(() => setShowDeleteConfirm(null), 5000);
    }
  };

  const getAppealStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'rejected':
        return 'text-red-400 bg-red-500/20';
      case 'approved':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-6'
    >
      <div>
        <h2 className='text-2xl font-bold text-white mb-4 font-mondwest'>
          Artist Approvals
        </h2>
        <p className='text-white/70'>
          Review and approve artist appeals and applications
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
          <div className='text-2xl font-bold text-white'>
            {pendingArtists.length}
          </div>
          <div className='text-white/70 text-sm'>Pending Reviews</div>
        </div>
        <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
          <div className='text-2xl font-bold text-yellow-400'>
            {pendingArtists.filter(a => a.appealStatus === 'requested').length}
          </div>
          <div className='text-white/70 text-sm'>Appeal Requested</div>
        </div>
        <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
          <div className='text-2xl font-bold text-red-400'>
            {pendingArtists.filter(a => a.appealStatus === 'rejected').length}
          </div>
          <div className='text-white/70 text-sm'>Previously Rejected</div>
        </div>
      </div>

      {/* Search */}
      <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
        <input
          type='text'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder='Search by name or email...'
          className='w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'
        />
      </div>

      {/* Artists List */}
      <div className='space-y-4'>
        {filteredArtists.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className='bg-white/5 border border-white/10 p-6 rounded-lg hover:bg-white/[0.07] transition-colors'
          >
            <div className='flex items-start gap-4'>
              {/* Profile Picture */}
              <div className='flex-shrink-0'>
                {artist.avatar ? (
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className='w-16 h-16 object-cover rounded-full border-2 border-white/20'
                    onError={e => {
                      e.currentTarget.src = '/images/artistNotFound.jpeg';
                    }}
                  />
                ) : (
                  <div className='w-16 h-16 bg-orange-500 flex items-center justify-center text-black font-bold text-xl rounded-full'>
                    {artist.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Artist Information */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-start justify-between mb-3'>
                  <div>
                    <h3 className='text-white font-semibold text-lg'>
                      {artist.name}
                    </h3>
                    <p className='text-white/60 text-sm'>{artist.email}</p>
                    <p className='text-white/50 text-xs mt-1'>
                      {artist.location}
                    </p>
                  </div>
                  <div className='flex flex-col items-end gap-2'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getAppealStatusColor(artist.appealStatus)}`}
                    >
                      {artist.appealStatus === 'requested'
                        ? 'Appeal Requested'
                        : 'Previously Rejected'}
                    </span>
                    <div className='text-white/50 text-xs'>
                      Applied {new Date(artist.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Bio - Max 5 lines */}
                <div className='mb-3'>
                  <p className='text-white/70 text-sm line-clamp-5 leading-relaxed'>
                    {artist.bio || 'No bio provided'}
                  </p>
                </div>

                {/* Genres */}
                <div className='flex flex-wrap gap-2 mb-4'>
                  {artist.genres && artist.genres.length > 0 ? (
                    artist.genres.map((genre, genreIndex) => (
                      <span
                        key={genreIndex}
                        className='px-2 py-1 bg-white/10 border border-white/20 text-white/80 text-xs rounded'
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className='text-white/50 text-xs'>
                      No genres specified
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='flex items-center gap-3 flex-wrap'>
                  <button
                    onClick={() => handleApprove(artist.id)}
                    disabled={approveUser.isPending}
                    className='bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded hover:bg-green-500/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {approveUser.isPending ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(artist.id)}
                    disabled={rejectUser.isPending}
                    className='bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-2 rounded hover:bg-red-500/30 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {rejectUser.isPending ? 'Rejecting...' : 'Reject'}
                  </button>
                  <a
                    href={`/artist/${artist.slug}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='bg-white/10 border border-white/20 text-white/70 px-4 py-2 rounded hover:bg-white/20 transition-colors text-sm'
                  >
                    View Profile
                  </a>
                  <button
                    onClick={() => handleDelete(artist.id)}
                    disabled={deleteUser.isPending}
                    className={`border px-4 py-2 rounded transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
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
                    {deleteUser.isPending
                      ? 'Deleting...'
                      : showDeleteConfirm === artist.id
                        ? 'Confirm Delete'
                        : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Pending Artists */}
      {filteredArtists.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-white/60 text-lg mb-2'>
            No pending artist approvals
          </div>
          <p className='text-white/50 text-sm'>
            All artist appeals have been reviewed
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ApprovedTab;

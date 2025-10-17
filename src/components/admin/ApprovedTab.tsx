import { motion } from 'framer-motion';

interface Artist {
  id: string;
  name: string;
  email: string;
  avatar: string | undefined;
  bio: string | undefined;
  genres: string[];
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface ApprovedTabProps {
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void;
}

const ApprovedTab = ({ onStatusChange }: ApprovedTabProps) => {
  // Dummy data for pending artists
  const pendingArtists: Artist[] = [
    {
      id: '1',
      name: 'DJ Shadow',
      email: 'djshadow@example.com',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Underground hip-hop producer with 10+ years of experience. Known for atmospheric beats and experimental soundscapes.',
      genres: ['Hip Hop', 'Experimental', 'Electronic'],
      location: 'London, UK',
      status: 'pending',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Luna Beats',
      email: 'lunabeats@example.com',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Electronic music producer specializing in ambient and downtempo. Creating ethereal soundscapes for modern listeners.',
      genres: ['Electronic', 'Ambient', 'Downtempo'],
      location: 'Berlin, Germany',
      status: 'pending',
      createdAt: '2024-01-14T15:30:00Z',
    },
    {
      id: '3',
      name: 'Marcus Johnson',
      email: 'marcusj@example.com',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Jazz pianist and composer with classical training. Blending traditional jazz with contemporary influences.',
      genres: ['Jazz', 'Classical', 'Contemporary'],
      location: 'New York, USA',
      status: 'pending',
      createdAt: '2024-01-13T09:15:00Z',
    },
    {
      id: '4',
      name: 'Sofia Martinez',
      email: 'sofiam@example.com',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Latin music producer and singer-songwriter. Creating vibrant fusion of traditional Latin rhythms with modern pop.',
      genres: ['Latin', 'Pop', 'World Music'],
      location: 'Barcelona, Spain',
      status: 'pending',
      createdAt: '2024-01-12T14:45:00Z',
    },
    {
      id: '5',
      name: 'Alex Chen',
      email: 'alexchen@example.com',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'EDM producer and DJ with international touring experience. Known for high-energy festival anthems and club bangers.',
      genres: ['EDM', 'House', 'Progressive'],
      location: 'Amsterdam, Netherlands',
      status: 'pending',
      createdAt: '2024-01-11T11:20:00Z',
    },
  ];

  const handleApprove = (id: string) => {
    console.log(`Approving artist with ID: ${id}`);
    onStatusChange(id, 'approved');
  };

  const handleReject = (id: string) => {
    console.log(`Rejecting artist with ID: ${id}`);
    onStatusChange(id, 'rejected');
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
          Review and approve pending artist applications
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
          <div className='text-2xl font-bold text-green-400'>12</div>
          <div className='text-white/70 text-sm'>Approved This Week</div>
        </div>
        <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
          <div className='text-2xl font-bold text-red-400'>3</div>
          <div className='text-white/70 text-sm'>Rejected This Week</div>
        </div>
      </div>

      {/* Artists List */}
      <div className='space-y-4'>
        {pendingArtists.map((artist, index) => (
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
                  <div className='text-white/50 text-xs'>
                    Applied {new Date(artist.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Bio - Max 5 lines */}
                <div className='mb-3'>
                  <p className='text-white/70 text-sm line-clamp-5 leading-relaxed'>
                    {artist.bio}
                  </p>
                </div>

                {/* Genres */}
                <div className='flex flex-wrap gap-2 mb-4'>
                  {artist.genres.map((genre, genreIndex) => (
                    <span
                      key={genreIndex}
                      className='px-2 py-1 bg-white/10 border border-white/20 text-white/80 text-xs rounded'
                    >
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className='flex items-center gap-3'>
                  <button
                    onClick={() => handleApprove(artist.id)}
                    className='bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 rounded hover:bg-green-500/30 transition-colors text-sm font-medium'
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(artist.id)}
                    className='bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-2 rounded hover:bg-red-500/30 transition-colors text-sm font-medium'
                  >
                    Reject
                  </button>
                  <button className='bg-white/10 border border-white/20 text-white/70 px-4 py-2 rounded hover:bg-white/20 transition-colors text-sm'>
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Pending Artists */}
      {pendingArtists.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-white/60 text-lg mb-2'>
            No pending artist applications
          </div>
          <p className='text-white/50 text-sm'>
            All artist applications have been reviewed
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ApprovedTab;

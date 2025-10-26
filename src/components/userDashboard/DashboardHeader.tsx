import { Link } from 'react-router-dom';
import type { ConsolidatedUser } from '@/types/store';

interface DashboardHeaderProps {
  userData: ConsolidatedUser;
  onLogout: () => void;
  onEditProfile: () => void;
}

const DashboardHeader = ({
  userData,
  onLogout,
  onEditProfile,
}: DashboardHeaderProps) => {
  return (
    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8'>
      <div className='flex items-center gap-6 mb-6 lg:mb-0'>
        {/* User Avatar */}
        <div className='relative'>
          <img
            src={userData.avatar || '/images/artistNotFound.jpeg'}
            alt={userData.displayName || userData.username}
            className='w-20 h-20 lg:w-24 lg:h-24 object-cover'
            onError={e => {
              e.currentTarget.src = '/images/artistNotFound.jpeg';
            }}
          />
          <div className='absolute -bottom-2 -right-2 bg-orange-500 text-black px-2 py-1 text-xs font-semibold'>
            USER
          </div>
        </div>

        <div>
          <h1 className='font-mondwest text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2'>
            {userData.displayName ||
              userData.username ||
              userData.name ||
              'User'}
          </h1>
          <p className='text-white/70 text-lg'>
            {userData.location || 'Location not set'}
          </p>
          <p className='text-white/50 text-sm'>
            Member since{' '}
            {userData.createdAt
              ? new Date(userData.createdAt).toLocaleDateString()
              : 'Unknown'}
          </p>
        </div>
      </div>

      <div className='flex flex-wrap gap-3'>
        <Link to='/explore'>
          <button className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'>
            EXPLORE ARTISTS
          </button>
        </Link>
        <button
          onClick={onEditProfile}
          className='bg-white/10 border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/20 transition-colors'
        >
          EDIT PROFILE
        </button>
        <button
          onClick={onLogout}
          className='bg-white/10 border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/20 transition-colors'
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;

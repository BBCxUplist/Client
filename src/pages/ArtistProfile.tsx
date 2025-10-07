import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import AboutTab from '@/components/artist/AboutTab';
import MusicTab from '@/components/artist/MusicTab';
// import ReviewsTab from "@/components/artist/ReviewsTab";
import GalleryTab from '@/components/artist/GalleryTab';
import BookingTab from '@/components/artist/BookingTab';
import SocialLinks from '@/components/ui/SocialLinks';
import { formatPrice } from '@/helper';
import { useGetArtist } from '@/hooks/artist/useGetArtist';
import { useStore } from '@/stores/store';

enum ArtistTab {
  MUSIC = 'music',
  GALLERY = 'gallery',
  ABOUT = 'about',
  BOOKING = 'booking',
}

const ArtistProfile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState<ArtistTab>(ArtistTab.MUSIC);
  const { user } = useStore();

  // Fetch artist data from API
  const { data, isLoading, error } = useGetArtist(username || '');
  const artist = data?.data;

  // Check if current user is viewing their own profile
  // Compare by email since username might not be available in user object
  const isOwnProfile = user?.email === artist?.email;

  // Check if profile is incomplete and get missing fields
  const getMissingFields = () => {
    if (!artist) return [];
    const missing = [];
    if (!artist.displayName) missing.push('Display Name');
    if (!artist.avatar) missing.push('Profile Picture');
    if (!artist.bio) missing.push('Bio');
    if (!artist.phone) missing.push('Phone Number');
    if (!artist.location) missing.push('Location');
    if (!artist.socials) missing.push('Social Media Links');
    return missing;
  };

  const missingFields = getMissingFields();
  const isProfileIncomplete = missingFields.length > 0;

  // If user is viewing their own profile and booking tab is active, switch to music tab
  if (isOwnProfile && activeTab === ArtistTab.BOOKING) {
    setActiveTab(ArtistTab.MUSIC);
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white'>
        <Navbar />
        <div className='flex items-center justify-center h-[calc(100vh-100px)]'>
          <div className='text-center'>
            <div className='w-32 h-32 mx-auto mb-4 bg-neutral-700/50 animate-pulse rounded'></div>
            <div className='h-8 w-48 bg-neutral-700/50 animate-pulse rounded mx-auto mb-2'></div>
            <div className='h-4 w-64 bg-neutral-700/50 animate-pulse rounded mx-auto'></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white'>
        <Navbar />
        <div className='flex items-center justify-center h-[calc(100vh-100px)]'>
          <div className='text-center'>
            <img
              src='/images/userNotFound.jpeg'
              alt='Artist not found'
              className='w-32 h-32 mx-auto mb-4 opacity-50'
            />
            <h1 className='text-2xl text-white font-bold mb-2'>
              Artist Not Found
            </h1>
            <p className='text-white/60'>
              The artist you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen '>
      <Navbar />

      <div className='w-full p-4 md:p-6 lg:p-8 pb-24 md:pb-4'>
        <div className='flex flex-col lg:flex-row gap-6 lg:gap-8 relative'>
          {/* Left Side - Artist Info */}
          <div className='lg:max-w-[320px] w-full lg:flex-shrink-0 lg:sticky top-[100px] h-fit'>
            {/* Artist Header */}
            <div className='border-b lg:border-b-0 border-dashed border-white pb-6 md:pb-8 lg:mb-6'>
              {/* Artist Image */}
              <div className='relative mb-6 sm:max-w-sm sm:mx-auto lg:max-w-none lg:mx-0'>
                <img
                  src={artist?.avatar || '/images/artistNotFound.jpeg'}
                  alt={artist?.displayName || 'Artist'}
                  className='w-full aspect-square object-cover'
                  draggable={false}
                  onError={e => {
                    e.currentTarget.src = '/images/artistNotFound.jpeg';
                  }}
                />
                {artist?.isAvailable && (
                  <div className='absolute bottom-4 left-4 bg-orange-500 text-black px-3 py-2 text-sm font-semibold'>
                    AVAILABLE
                  </div>
                )}
              </div>

              {/* Artist Name */}
              <h1 className='font-mondwest text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2'>
                {artist?.displayName}
              </h1>
              <p className='text-white/70 mb-4'>@{artist.username}</p>
              {/* Genre Tags */}
              <div className='flex flex-wrap gap-2 mb-6'>
                {artist?.genres?.map((genre: string, index: number) => (
                  <span
                    key={index}
                    className='bg-white/10 text-white px-3 py-2 text-sm border border-white/20'
                  >
                    {genre}
                  </span>
                )) || (
                  <span className='text-white/60'>No categories available</span>
                )}
              </div>

              {/* Social Media Links */}
              <SocialLinks socials={artist?.socials} />

              {/* Booking Info */}
              <div className='bg-white/5 p-4 border border-white/10 hidden lg:block'>
                <div className='flex flex-col gap-4'>
                  <div>
                    <p className='text-white/70 text-sm mb-1'>Booking Price</p>
                    <p className='text-xl md:text-2xl font-bold text-orange-500 font-mondwest'>
                      {formatPrice(artist?.basePrice)}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab(ArtistTab.BOOKING)}
                    className='w-full bg-orange-500 text-black py-3 font-semibold hover:bg-orange-600 transition-colors duration-300 text-sm md:text-base'
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Tabs and Content */}
          <div className='flex-1'>
            {/* Navigation Tabs */}
            <div className='flex flex-wrap gap-4 mb-6 md:mb-8 border-b border-dashed border-white pb-6'>
              {[
                ArtistTab.MUSIC,
                ArtistTab.GALLERY,
                ArtistTab.ABOUT,
                ...(isOwnProfile ? [] : [ArtistTab.BOOKING]),
              ].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm md:text-base font-semibold transition-all duration-300 border ${
                    activeTab === tab
                      ? 'bg-white text-black border-white'
                      : 'text-white border-white/30 hover:border-white/60'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Content Sections */}
            <div className='min-h-[400px]'>
              {activeTab === ArtistTab.ABOUT && (
                <AboutTab artist={{ bio: artist?.bio }} />
              )}
              {activeTab === ArtistTab.MUSIC && (
                <MusicTab artist={{ embeds: artist?.embeds }} />
              )}
              {/* {activeTab === "reviews" && <ReviewsTab artist={artist} />} */}
              {activeTab === ArtistTab.GALLERY && (
                <GalleryTab artist={{ photos: artist?.photos }} />
              )}
              {activeTab === ArtistTab.BOOKING && !isOwnProfile && (
                <BookingTab
                  artist={{
                    id: artist?.id || '',
                    displayName: artist?.displayName || '',
                    basePrice: artist?.basePrice || 0,
                    isBookable: artist?.isBookable || false,
                    location: artist?.location,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sticky Booking Bar (Mobile) */}
        <div className='fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 border-t border-white/20 lg:hidden'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-orange-500 font-semibold text-lg font-mondwest'>
                {formatPrice(artist?.basePrice)}
              </p>
              <p className='text-white/60 text-sm'>Booking price</p>
            </div>
            <button className='bg-orange-500 text-black px-6 py-3 font-semibold'>
              BOOK NOW
            </button>
          </div>
        </div>

        {/* Complete Profile Tag - Fixed Bottom Right */}
        {isOwnProfile && isProfileIncomplete && (
          <Link to='/dashboard/edit' className='fixed bottom-4 right-4 z-50'>
            <span className='bg-orange-500 text-black px-3 py-2 text-sm font-semibold rounded-lg shadow-lg hover:bg-orange-600 transition-colors cursor-pointer'>
              Complete Profile
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ArtistProfile;

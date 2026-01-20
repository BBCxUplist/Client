import { useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/landing/Navbar';
import AboutTab from '@/components/artist/AboutTab';
import MusicTab from '@/components/artist/MusicTab';
import GalleryTab from '@/components/artist/GalleryTab';
import RiderTab from '@/components/artist/RiderTab';
import BookingTab, { type BookingTabRef } from '@/components/artist/BookingTab';
import SocialLinks from '@/components/ui/SocialLinks';
import NewsletterModal from '@/components/ui/NewsletterModal';
import { formatPrice } from '@/helper';
import { useGetArtist } from '@/hooks/artist/useGetArtist';
import { useSaveArtist } from '@/hooks/artist/useSaveArtist';
import { useGetUserProfile } from '@/hooks/user/useGetUserProfile';
import { useStore } from '@/stores/store';
import type { Artist } from '@/types/api';

enum ArtistTab {
  MUSIC = 'music',
  GALLERY = 'gallery',
  ABOUT = 'about',
  RIDER = 'rider',
  BOOKING = 'booking',
}

const ArtistProfile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState<ArtistTab>(ArtistTab.MUSIC);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const { user, isSubscribedToNewsletter } = useStore();
  const bookingTabRef = useRef<BookingTabRef>(null);

  // Fetch artist data from API
  const { data, isLoading, error } = useGetArtist(username || '');
  const artist = data?.data;

  // Fetch user profile to get saved artists
  const { data: userProfileData } = useGetUserProfile();

  // Save artist hook with optimistic updates
  const {
    saveArtist,
    unsaveArtist,
    isLoading: isSaving,
  } = useSaveArtist({
    artistId: artist?.id || '',
    artistData: artist, // Pass artist data for optimistic update
    onSuccess: () => {
      // Optional: Add any additional success logic
    },
    onError: error => {
      console.error('Error saving artist:', error);
    },
  });

  // Check if artist is saved by current user
  // Use userProfileData for accurate state (updated optimistically)
  const savedArtists =
    userProfileData?.data?.savedArtists || user?.savedArtists || [];
  const isSaved = savedArtists?.some(
    (savedArtist: Artist) => savedArtist.id === artist?.id
  );

  // Toggle save function
  const toggleSave = () => {
    if (isSaved) {
      unsaveArtist();
    } else {
      saveArtist();
    }
  };

  // Check if current user is viewing their own profile
  const isOwnProfile = Boolean(
    !isLoading && user?.id && artist?.id && user.id === artist.id
  );

  // Check if profile is incomplete and get missing fields
  const getMissingFields = () => {
    if (!artist) return [];
    const missing = [];
    if (!artist.displayName) missing.push('Display Name');
    if (!artist.avatar) missing.push('Profile Picture');
    if (!artist.bio) missing.push('Bio');
    if (!artist.location) missing.push('Location');
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

  // Show banned message if artist is banned
  if (artist.banned) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white'>
        <Navbar />
        <div className='flex items-center justify-center h-[calc(100vh-100px)]'>
          <div className='text-center'>
            <div className='w-32 h-32 mx-auto mb-4 flex items-center justify-center'>
              <img src='/icons/ban.svg' alt='Banned' className='w-16 h-16' />
            </div>
            <h1 className='text-2xl text-white font-bold mb-2'>
              Artist Banned
            </h1>
            <p className='text-white/60 mb-6'>
              This artist has been banned and their profile is no longer
              available.
            </p>
            <Link to='/explore'>
              <button className='bg-orange-500 text-black px-6 py-3 font-semibold hover:bg-orange-600 transition-colors'>
                EXPLORE OTHER ARTISTS
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen '>
      <Navbar />

      <div className='w-full p-4 md:p-6 lg:p-8 pb-12 md:pb-14'>
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
                {/* Availability Status */}
                {artist?.isApproved && (
                  <div className='absolute bottom-4 left-4 bg-orange-500 text-black px-3 py-2 text-sm font-semibold'>
                    AVAILABLE
                  </div>
                )}
                {!artist?.isApproved && (
                  <div className='absolute bottom-4 left-4 bg-gray-500 text-white px-3 py-2 text-sm font-semibold'>
                    NOT AVAILABLE
                  </div>
                )}
              </div>

              {/* Artist Name */}
              <h1 className='font-mondwest text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2'>
                {artist?.displayName}
              </h1>
              <div className='flex items-center gap-2 mb-2'>
                <p className='text-white/70 '>@{artist.username}</p>
                {/* Approved Badge */}
                {artist?.isApproved && (
                  <img
                    src='/icons/badge.svg'
                    alt='Approved Artist'
                    className='w-5 h-5'
                  />
                )}
                {/* Save Artist Star - Only show for other users */}
                {!isOwnProfile && (
                  <button
                    onClick={toggleSave}
                    disabled={isSaving}
                    className='p-1 hover:bg-white/10 rounded-full transition-colors duration-200'
                    title={
                      isSaved ? 'Remove from favorites' : 'Add to favorites'
                    }
                  >
                    <Star
                      size={20}
                      className={`transition-colors duration-200 ${
                        isSaved
                          ? 'fill-orange-500 text-orange-400'
                          : 'text-white/70 hover:text-orange-400'
                      }`}
                    />
                  </button>
                )}
              </div>

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

              {/* Edit Profile Button - Only for own profile */}
              {isOwnProfile && (
                <div className='bg-white/5 p-4 border border-white/10 hidden lg:block'>
                  <Link to='/dashboard/edit'>
                    <button className='w-full bg-orange-500 text-black py-3 font-semibold hover:bg-orange-600 transition-colors duration-300 text-sm md:text-base'>
                      {isProfileIncomplete
                        ? 'COMPLETE PROFILE'
                        : 'EDIT PROFILE'}
                    </button>
                  </Link>
                </div>
              )}
              {/* Booking Info */}
              {!isOwnProfile && (
                <div className='bg-white/5 p-4 border border-white/10 hidden lg:block'>
                  <div className='flex flex-col gap-4'>
                    <div>
                      <p className='text-white/70 text-sm mb-1'>
                        Booking Price
                      </p>
                      <p className='text-xl md:text-2xl font-bold text-orange-500 font-mondwest'>
                        {formatPrice(artist?.basePrice)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (activeTab === ArtistTab.BOOKING) {
                          // If already on booking tab, try to submit the form
                          if (bookingTabRef.current) {
                            if (bookingTabRef.current.isFormValid()) {
                              bookingTabRef.current.submitForm();
                            } else {
                              // Form is not valid, show toast message
                              toast.error(
                                'Please fill out all required fields correctly'
                              );
                            }
                          }
                        } else {
                          // Navigate to booking tab
                          setActiveTab(ArtistTab.BOOKING);
                        }
                      }}
                      disabled={bookingTabRef.current?.isLoading}
                      className='w-full bg-orange-500 text-black py-3 font-semibold hover:bg-orange-600 transition-colors duration-300 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {bookingTabRef.current?.isLoading
                        ? 'SUBMITTING...'
                        : activeTab === ArtistTab.BOOKING &&
                            bookingTabRef.current?.isFormValid()
                          ? 'SUBMIT BOOKING'
                          : 'BOOK NOW'}
                    </button>
                  </div>
                </div>
              )}
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
                ArtistTab.RIDER,
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

              {/* Subscribe Button */}
              {artist?.id && (
                <button
                  onClick={() => setIsNewsletterModalOpen(true)}
                  className={`ml-auto flex items-center gap-2 px-4 py-2 text-sm md:text-base font-semibold transition-all duration-300 border ${
                    isSubscribedToNewsletter(artist.id)
                      ? 'bg-green-500/20 text-green-400 border-green-500/40 hover:bg-green-500/30'
                      : 'bg-white/20 text-white border-white/40 hover:bg-white/30 '
                  }`}
                >
                  <Mail className='w-4 h-4' />
                  {isSubscribedToNewsletter(artist.id)
                    ? 'SUBSCRIBED'
                    : 'SUBSCRIBE'}
                </button>
              )}
            </div>

            {/* Content Sections */}
            <div className='min-h-[400px]'>
              {activeTab === ArtistTab.ABOUT && (
                <AboutTab
                  artist={{ bio: artist?.bio, location: artist?.location }}
                />
              )}
              {activeTab === ArtistTab.MUSIC && (
                <MusicTab
                  artist={{
                    embeds: artist?.embeds,
                    playlists: (artist as any)?.playlists,
                  }}
                />
              )}
              {/* {activeTab === "reviews" && <ReviewsTab artist={artist} />} */}
              {activeTab === ArtistTab.GALLERY && (
                <GalleryTab artist={{ photos: artist?.photos }} />
              )}
              {activeTab === ArtistTab.RIDER && (
                <RiderTab artist={{ riders: artist?.riders }} />
              )}
              {activeTab === ArtistTab.BOOKING && !isOwnProfile && (
                <BookingTab
                  ref={bookingTabRef}
                  artist={{
                    id: artist?.id || '',
                    displayName: artist?.displayName || '',
                    basePrice: artist?.basePrice || 0,
                    isBookable: artist?.isBookable || false,
                    isAvailable: artist?.isAvailable || false,
                    isApproved: artist?.isApproved || false,
                    location: artist?.location,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sticky Booking Bar (Mobile) */}
        {!isOwnProfile && (
          <div className='fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 border-t border-white/20 lg:hidden'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-orange-500 font-semibold text-lg font-mondwest'>
                  {formatPrice(artist?.basePrice)}
                </p>
                <p className='text-white/60 text-sm'>Booking price</p>
              </div>
              <button
                onClick={() => {
                  if (activeTab === ArtistTab.BOOKING) {
                    // If already on booking tab, try to submit the form
                    if (bookingTabRef.current) {
                      if (bookingTabRef.current.isFormValid()) {
                        bookingTabRef.current.submitForm();
                      } else {
                        // Form is not valid, show toast message
                        toast.error(
                          'Please fill out all required fields correctly'
                        );
                      }
                    }
                  } else {
                    // Navigate to booking tab
                    setActiveTab(ArtistTab.BOOKING);
                  }
                }}
                disabled={bookingTabRef.current?.isLoading}
                className='bg-orange-500 text-black px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {bookingTabRef.current?.isLoading
                  ? 'SUBMITTING...'
                  : activeTab === ArtistTab.BOOKING &&
                      bookingTabRef.current?.isFormValid()
                    ? 'SUBMIT BOOKING'
                    : 'BOOK NOW'}
              </button>
            </div>
          </div>
        )}

        {/* Sticky Edit Profile Bar (Mobile) - Only for own profile */}
        {isOwnProfile && (
          <div className='fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 border-t border-white/20 lg:hidden'>
            <Link to='/dashboard/edit'>
              <button className='w-full bg-orange-500 text-black py-3 font-semibold hover:bg-orange-600 transition-colors'>
                EDIT PROFILE
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Newsletter Modal */}
      {artist && (
        <NewsletterModal
          isOpen={isNewsletterModalOpen}
          onClose={() => setIsNewsletterModalOpen(false)}
          artistId={artist.id}
          artistName={artist.displayName || artist.username}
        />
      )}
    </div>
  );
};

export default ArtistProfile;

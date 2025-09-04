import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import { artists } from '@/constants/artists';
import AboutTab from '@/components/artist/AboutTab';
import MusicTab from '@/components/artist/MusicTab';
// import ReviewsTab from "@/components/artist/ReviewsTab";
import GalleryTab from '@/components/artist/GalleryTab';
import BookingTab from '@/components/artist/BookingTab';
import { formatPrice } from '@/helper';

enum ArtistTab {
  MUSIC = 'music',
  GALLERY = 'gallery',
  ABOUT = 'about',
  BOOKING = 'booking',
}

const ArtistProfile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState<ArtistTab>(ArtistTab.MUSIC);

  // Find artist by slug from the artists.ts file
  const artist = artists.find(a => a.slug === username);

  if (!artist) {
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
                  src={artist?.avatar}
                  alt={artist?.name}
                  className='w-full aspect-square object-cover'
                  draggable={false}
                  onError={e => {
                    e.currentTarget.src = '/images/artistNotFound.jpeg';
                  }}
                />
                {artist?.isBookable && (
                  <div className='absolute bottom-4 left-4 bg-orange-500 text-black px-3 py-2 text-sm font-semibold'>
                    AVAILABLE
                  </div>
                )}
              </div>

              {/* Artist Name */}
              <h1 className='font-mondwest text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4'>
                {artist?.name}
              </h1>

              {/* Genre Tags */}
              <div className='flex flex-wrap gap-2 lg:mb-6'>
                {artist?.genres?.map((genre, index) => (
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

              {/* Booking Info */}
              <div className='bg-white/5 p-4 border border-white/10 hidden lg:block'>
                <div className='flex flex-col gap-4'>
                  <div>
                    <p className='text-white/70 text-sm mb-1'>Booking Price</p>
                    <p className='text-xl md:text-2xl font-bold text-orange-500 font-mondwest'>
                      {formatPrice(artist?.basePrice)}
                    </p>
                  </div>
                  <button className='w-full bg-orange-500 text-black py-3 font-semibold hover:bg-orange-600 transition-colors duration-300 text-sm md:text-base'>
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
                ArtistTab.BOOKING,
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
              {activeTab === ArtistTab.ABOUT && <AboutTab artist={artist} />}
              {activeTab === ArtistTab.MUSIC && <MusicTab artist={artist} />}
              {/* {activeTab === "reviews" && <ReviewsTab artist={artist} />} */}
              {activeTab === ArtistTab.GALLERY && (
                <GalleryTab artist={artist} />
              )}
              {activeTab === ArtistTab.BOOKING && (
                <BookingTab artist={artist} />
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
      </div>
    </div>
  );
};

export default ArtistProfile;

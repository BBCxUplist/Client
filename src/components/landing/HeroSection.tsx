import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleSearchBarClick = () => {
    navigate('/explore');
  };

  return (
    <div className='absolute inset-0 z-20 flex flex-col items-center justify-center p-4'>
      <div className=' mb-16'>
        <p className='text-5xl md:text-7xl lg:text-8xl leading-none text-white  mb-4 font-medium'>
          ARTIST DISCOVERY &
        </p>
        <p className='text-7xl md:text-9xl lg:text-[10rem] leading-none font-mondwest font-bold'>
          BOOKINGS MADE SIMPLE
        </p>
      </div>

      <div className='w-full max-w-4xl mx-auto'>
        <div className='relative cursor-pointer' onClick={handleSearchBarClick}>
          <input
            type='text'
            placeholder='Search for artists, genres, or venues...'
            className='w-full px-8 py-4 text-xl md:text-3xl bg-black border border-white text-white placeholder-white/60 transition-all duration-300 focus:outline-none focus:ring-0 cursor-pointer'
            readOnly
          />
          <img
            src='/icons/search.png'
            alt='search'
            draggable={false}
            className='absolute right-4 top-1/2 transform -translate-y-1/2 md:w-24 md:h-24 w-16 h-16 bg-black texture-bg cursor-pointer hover:opacity-80 transition-opacity'
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

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
        <div
          className='flex cursor-pointer bg-black border border-white'
          onClick={handleSearchBarClick}
        >
          <input
            type='text'
            placeholder='Search for artists, genres'
            className='w-full px-4 md:px-8 py-4 text-xl md:text-3xl text-white placeholder-white/60 transition-all duration-300 focus:outline-none focus:ring-0 cursor-pointer'
            readOnly
          />
          <img
            src='/icons/search.png'
            alt='search'
            draggable={false}
            className='w-16 h-16 z-10 cursor-pointer hover:opacity-80 transition-opacity p-2'
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

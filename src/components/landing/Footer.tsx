const Footer = () => {
  return (
    <div className='w-full border-t border-dashed border-white'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-0'>
        {/* Left Section - Tagline, Social Links & Copyright */}
        <div className='p-6 md:p-8 lg:p-10 flex flex-col justify-between'>
          {/* Tagline */}
          <div className='mb-6 md:mb-8'>
            <div className='text-white text-2xl md:text-4xl lg:text-5xl font-bold font-mondwest'>
              GLOBAL FROM{' '}
              <span className='text-orange-500 ml-1 md:ml-2'>DAY ONE</span>
            </div>
          </div>

          {/* Social Links & Copyright */}
          <div>
            <div className='flex flex-wrap gap-4 md:gap-6 lg:gap-8 mb-4 md:mb-6'>
              <a
                href='https://www.instagram.com/upl1st/'
                target='_blank'
                rel='noopener noreferrer'
                className='text-white hover:text-orange-500 transition-colors duration-300 font-semibold text-sm md:text-base'
              >
                INSTAGRAM
              </a>
              <a
                href='#'
                className='text-white hover:text-orange-500 transition-colors duration-300 font-semibold text-sm md:text-base'
              >
                TWITTER
              </a>
              <a
                href='#'
                className='text-white hover:text-orange-500 transition-colors duration-300 font-semibold text-sm md:text-base'
              >
                MEDIUM
              </a>
            </div>

            <div className='text-white/70 text-xs md:text-sm'>
              © UPLIST 2025
            </div>
          </div>
        </div>

        {/* Right Section - Info & Logo */}
        <div className='p-6 md:p-8 lg:p-10 flex flex-col justify-between'>
          {/* Info Box */}
          <div className='mb-6 md:mb-8'>
            <div className='text-white font-semibold mb-3 md:mb-4 text-sm md:text-base'>
              INFO
            </div>
            <div className='text-white/80 leading-relaxed max-w-md text-sm md:text-base'>
              UPLIST IS A LEADING PLATFORM CONNECTING TALENTED ARTISTS WITH
              CLIENTS WORLDWIDE. WE BACK THE BEST CREATORS AND PERFORMERS WHO
              WILL PUSH THE ENTIRE ENTERTAINMENT INDUSTRY FORWARD.
            </div>
          </div>

          {/* Logo */}
          <div className='flex justify-center'>
            <img
              src='/logo/logo.png'
              alt='Uplist Logo'
              draggable={false}
              className='h-16 md:h-20 lg:h-28 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

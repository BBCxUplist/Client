import type { AuthMode } from './types';

interface DesktopBrandingProps {
  activeMode: AuthMode;
}

const DesktopBranding = ({ activeMode }: DesktopBrandingProps) => {
  return (
    <div className='bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-8 xl:p-12 flex flex-col justify-between border-r border-dashed border-white/20 h-[calc(100vh-80px)] sticky top-[80px]'>
      {/* Top Section */}
      <div>
        <div className='mb-12'>
          <h1 className='font-mondwest text-5xl xl:text-7xl font-bold text-white mb-6'>
            {activeMode === 'signin' ? 'WELCOME BACK' : 'JOIN THE COMMUNITY'}
          </h1>
          <p className='text-white/80 text-xl xl:text-2xl leading-relaxed max-w-2xl'>
            {activeMode === 'signin'
              ? "Continue your journey with the world's leading artist booking platform."
              : 'Connect with talented artists and book them for your special events.'}
          </p>
        </div>

        {/* Features */}
        <div className='space-y-8'>
          <div className='flex items-start gap-4'>
            <div className='w-3 h-3 bg-orange-500 mt-2 flex-shrink-0'></div>
            <div>
              <h3 className='text-white font-semibold text-lg mb-2'>
                Verified Artists
              </h3>
              <p className='text-white/60'>
                All artists are thoroughly verified and background-checked for
                your safety.
              </p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <div className='w-3 h-3 bg-orange-500 mt-2 flex-shrink-0'></div>
            <div>
              <h3 className='text-white font-semibold text-lg mb-2'>
                Seamless Booking
              </h3>
              <p className='text-white/60'>
                Book artists instantly with our streamlined booking system and
                secure payments.
              </p>
            </div>
          </div>
          <div className='flex items-start gap-4'>
            <div className='w-3 h-3 bg-orange-500 mt-2 flex-shrink-0'></div>
            <div>
              <h3 className='text-white font-semibold text-lg mb-2'>
                Global Reach
              </h3>
              <p className='text-white/60'>
                Access artists from around the world for any type of event or
                celebration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='border-t border-dashed border-white/20 pt-8'>
        <div className='grid grid-cols-3 gap-8 text-center'>
          <div>
            <p className='text-3xl font-bold text-orange-500 font-mondwest'>
              10K+
            </p>
            <p className='text-white/60 text-sm mt-1'>VERIFIED ARTISTS</p>
          </div>
          <div>
            <p className='text-3xl font-bold text-orange-500 font-mondwest'>
              50K+
            </p>
            <p className='text-white/60 text-sm mt-1'>SUCCESSFUL BOOKINGS</p>
          </div>
          <div>
            <p className='text-3xl font-bold text-orange-500 font-mondwest'>
              25+
            </p>
            <p className='text-white/60 text-sm mt-1'>COUNTRIES</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopBranding;

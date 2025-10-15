import { useState } from 'react';
import { howItWorksContent } from '@/constants/howItWorks';

const HowItWorks = () => {
  const [activeView, setActiveView] = useState<'user' | 'artist'>('user');

  return (
    <div
      id='how-it-works'
      className='w-full p-6 md:p-8 lg:p-10 border-t border-dashed border-white'
    >
      <div className='max-w-7xl mx-auto'>
        <h2 className='font-bold text-white text-4xl md:text-5xl lg:text-7xl mb-8 md:mb-12'>
          How It Works
        </h2>

        {/* Toggle Buttons */}
        <div className='flex justify-center mb-12 md:mb-16'>
          <div className='bg-white/5 backdrop-blur-sm p-1'>
            <button
              onClick={() => setActiveView('user')}
              className={`px-4 md:px-6 lg:px-8 py-2 md:py-3 text-base md:text-lg font-semibold transition-all duration-300 ${
                activeView === 'user'
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              User
            </button>
            <button
              onClick={() => setActiveView('artist')}
              className={`px-4 md:px-6 lg:px-8 py-2 md:py-3 text-base md:text-lg font-semibold transition-all duration-300 ${
                activeView === 'artist'
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Artist
            </button>
          </div>
        </div>

        {/* How It Works Steps */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8'>
          {howItWorksContent[activeView].map((step, index) => (
            <div
              key={index}
              className='bg-white/5 backdrop-blur-sm p-4 md:p-6 lg:p-8 hover:bg-white/10 transition-all duration-300 group'
            >
              <div className='text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6'>
                {index + 1}
              </div>

              <h3 className='text-2xl md:text-3xl lg:text-5xl font-semibold text-white mb-3 md:mb-4 font-mondwest'>
                {step.title}
              </h3>

              <p className='text-white/80 text-base md:text-lg leading-relaxed'>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className='mt-12 md:mt-16 p-4 md:p-6 bg-orange-500/10 border border-orange-500/20 rounded-lg'>
          <p className='text-white/90 text-sm md:text-base leading-relaxed text-center'>
            <span className='font-semibold text-orange-500'>Disclaimer:</span>{' '}
            Some artist profiles on the explorer are created from publicly
            available information for discovery purposes; artists can claim,
            manage, or request removal of their profile at any time. Message the{' '}
            <a
              href='https://www.instagram.com/upl1st/'
              target='_blank'
              rel='noopener noreferrer'
              className=' underline hover:text-orange-400 transition-colors duration-200'
            >
              UPLIST Instagram account
            </a>{' '}
            for requests.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

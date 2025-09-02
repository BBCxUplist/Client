import React from 'react';

const Footer = () => {
  return (
    <div className="w-full border-t border-dashed border-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Left Section - Tagline, Social Links & Copyright */}
        <div className="p-10 flex flex-col justify-between">
          {/* Tagline */}
          <div className="mb-8">
            <div className="text-white text-5xl font-bold font-mondwest">
              GLOBAL FROM{' '}
              <span className="text-orange-400 ml-2">DAY ONE</span>
            </div>
          </div>

          {/* Social Links & Copyright */}
          <div>
            <div className="flex flex-wrap gap-8 mb-6">
              <a href="#" className="text-white hover:text-orange-400 transition-colors duration-300 font-semibold">
                TWITTER
              </a>
              <a href="#" className="text-white hover:text-orange-400 transition-colors duration-300 font-semibold">
                LINKEDIN
              </a>
              <a href="#" className="text-white hover:text-orange-400 transition-colors duration-300 font-semibold">
                MEDIUM
              </a>
            </div>
            
            <div className="text-white/70 text-sm">
              © UPLIST 2025
            </div>
          </div>
        </div>

        {/* Right Section - Info & Logo */}
        <div className="p-10 flex flex-col justify-between">
          {/* Info Box */}
          <div className="mb-8">
            <div className="text-white font-semibold mb-4">INFO</div>
            <div className="text-white/80 leading-relaxed max-w-md">
              UPLIST IS A LEADING PLATFORM CONNECTING TALENTED ARTISTS WITH CLIENTS WORLDWIDE. WE BACK THE BEST CREATORS AND PERFORMERS WHO WILL PUSH THE ENTIRE ENTERTAINMENT INDUSTRY FORWARD.
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src="/logo/logo.png" 
              alt="Uplist Logo" 
              className="h-28 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Footer;
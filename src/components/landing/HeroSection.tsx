const HeroSection = () => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
      <div className=" mb-16">
        <p className="text-6xl md:text-8xl lg:text-9xl leading-none text-white  mb-4 font-medium">
          Artist discovery &
        </p>
        <p className="text-7xl md:text-9xl lg:text-[10rem] leading-none font-mondwest font-bold">
          BOOKING MADE SIMPLE
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for artists, genres, or venues..."
            className="w-full px-8 py-4 text-xl md:text-3xl bg-black border border-white text-white placeholder-white/60 transition-all duration-300 focus:outline-none focus:ring-0"
          />
          <img
            src="/icons/search.png"
            alt="search"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-24 h-24 bg-black"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

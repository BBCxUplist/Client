import SingerCard from "@/components/cards/SingerCard";
import FeatureCard from "@/components/cards/FeatureCard";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import { MobileSidebar } from "@/components/common/MobileSidebar";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const featuredArtistsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation functions
  const handleExploreClick = () => {
    navigate('/explore');
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleFeaturedArtistsClick = () => {
    featuredArtistsRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleSearchClick = () => {
    navigate('/explore');
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };



  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };
  const features = [
    {
      icon: "/icons/search.svg",
      title: "Discover Artists",
      description:
        "Browse verified artists by genre, price, and availability to find the perfect match.",
      shadowIntensity: "heavy" as const,
    },
    {
      icon: "/icons/shield.svg",
      title: "Book Securely",
      description:
        "Secure escrow payments and verified profiles protect both artists and clients.",
      shadowIntensity: "medium" as const,
    },
    {
      icon: "/icons/message.svg",
      title: "Chat & Finalize",
      description:
        "Direct messaging for coordination, details, and seamless event planning.",
      shadowIntensity: "light" as const,
    },
  ];

  return (
    <div className="min-h-[100dvh] h-full w-full text-black">
      <motion.div
        className={`p-2 sm:p-4 fixed top-0 z-10 w-full transition-all duration-300 `}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className={`border bg-white border-neutral-200 shadow-sm inset-shadow-sm shadow-orange-500/5 mx-auto rounded-2xl sm:rounded-3xl flex justify-between items-center transition-all duration-300 ${
            isScrolled
              ? "max-w-3xl p-1.5 sm:p-2 rounded-xl sm:rounded-4xl"
              : "max-w-5xl p-2 sm:p-3 rounded-2xl sm:rounded-3xl"
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`bg-black aspect-square transition-all duration-300 ${
                isScrolled ? "p-0.5 rounded-full" : "p-0.5 sm:p-1 rounded-xl sm:rounded-2xl"
              }`}
            >
              <img
                src="/logo/logo.png"
                alt="uplist"
                className={`transition-all duration-300 ${
                  isScrolled ? "w-6 sm:w-8 h-6 sm:h-8" : "w-7 sm:w-10 h-7 sm:h-10"
                }`}
              />
            </div>
            <p
              className={`font-bold font-dm-sans transition-all duration-300 ${
                isScrolled ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
              }`}
            >
              Uplist
            </p>
          </div>

          <div
            className={`flex items-center font-medium text-neutral-600 transition-all duration-300 ${
              isScrolled ? "gap-2 sm:gap-3" : "gap-2 sm:gap-4"
            }`}
          >
            {/* Desktop Navigation */}
            <button
              onClick={handleExploreClick}
              className={`hidden md:block transition-all duration-300 hover:text-orange-500 ${
                isScrolled ? "text-sm" : "text-base"
              }`}
            >
              Explore
            </button>
            <button
              onClick={handleFeaturedArtistsClick}
              className={`hidden md:block transition-all duration-300 hover:text-orange-500 ${
                isScrolled ? "text-sm" : "text-base"
              }`}
            >
              Featured Artists
            </button>
            
            {/* Sign In Button */}
            <button
              onClick={handleSignInClick}
              className={`bg-orange-500 font-bold text-white rounded-xl sm:rounded-2xl transition-all duration-300 hover:bg-orange-600 ${
                isScrolled ? "px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm" : "px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base"
              }`}
            >
              Sign In
            </button>

            {/* Hamburger Menu for Mobile/Tablet */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`md:hidden flex flex-col justify-center items-center transition-all duration-300 ${
                isScrolled ? "w-6 h-6" : "w-7 h-7"
              }`}
              aria-label="Toggle menu"
            >
              <span
                className={`bg-neutral-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                  isSidebarOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                }`}
              ></span>
              <span
                className={`bg-neutral-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${
                  isSidebarOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`bg-neutral-600 block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                  isSidebarOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                }`}
              ></span>
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile/Tablet Sidebar */}
      <MobileSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onFeaturedArtistsClick={handleFeaturedArtistsClick}
      />

      <div className="min-h-[100dvh] w-full relative px-4 sm:px-6 lg:px-8">
        <motion.img
          src="/images/cd.png"
          alt="bg"
          className="h-[50%] sm:h-[60%] md:h-[70%] aspect-square object-cover absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-20"
          style={{ animation: "spin 10s linear infinite" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full max-w-6xl px-4"
          {...staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold font-dm-sans"
            {...fadeInUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="leading-tight">
              Artist Discovery &{" "}
              <br className="hidden sm:block" />
              <span className="text-orange-500">Booking Made Simple</span>
            </p>
          </motion.div>
          <motion.p 
            className="text-center text-neutral-600 mt-4 text-sm sm:text-base max-w-2xl mx-auto px-4"
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Connect with talented musicians, book secure performances, and{" "}
            <br className="hidden sm:block" />
            create unforgettable experiences for your events.
          </motion.p>

          <motion.div 
            className="w-full relative max-w-xs sm:max-w-md md:max-w-xl h-full mt-6 mx-auto flex items-center border-2 border-orange-600/30 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 shadow-lg shadow-orange-500/10 hover:border-orange-500/50 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all duration-300 cursor-pointer"
            {...scaleIn}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileFocus={{ scale: 1.05 }}
            onClick={handleSearchClick}
          >
            <input
              type="text"
              placeholder="Search for an artist"
              className="w-full p-2 sm:p-3 text-base sm:text-lg bg-transparent outline-none placeholder:text-neutral-400 focus:placeholder:text-orange-400 transition-colors duration-200 cursor-pointer"
              readOnly
              onClick={handleSearchClick}
            />
            <motion.img
              src="/images/mic.png"
              alt="search"
              className="h-16 sm:h-20 md:h-28 w-auto object-scale-down absolute right-2 sm:right-4 pointer-events-none"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 15 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              whileHover={{ rotate: 25, scale: 1.1 }}
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        ref={featuredArtistsRef}
        className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.p 
          className="text-xl sm:text-2xl md:text-3xl font-bold font-dm-sans"
          {...fadeInLeft}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Featured <span className="text-orange-600">Artists</span>
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-6 w-full"
          {...staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              {...scaleIn}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="w-full max-w-sm sm:max-w-none"
            >
              <SingerCard />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div 
        className="max-w-5xl mx-auto mt-10 sm:mt-16 md:mt-20 w-full px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.p 
          className="text-xl sm:text-2xl md:text-3xl font-bold font-dm-sans"
          {...fadeInLeft}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          How it <span className="text-orange-600">works</span>
        </motion.p>

        <motion.div 
          className="flex flex-col md:flex-row items-stretch gap-4 sm:gap-6 mt-6 w-full"
          {...staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              {...fadeInUp}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              className="w-full"
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full mt-10 sm:mt-16 md:mt-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <FAQ />
      </motion.div>

      <motion.div
        className="w-full mt-10 sm:mt-16 md:mt-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ContactSection />
      </motion.div>
    </div>
  );
};

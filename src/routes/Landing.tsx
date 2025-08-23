import SingerCard from "@/components/cards/SingerCard";
import FeatureCard from "@/components/cards/FeatureCard";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        className={`p-4 fixed top-0 z-10 w-full transition-all duration-300 `}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className={`border bg-white border-neutral-200 shadow-sm inset-shadow-sm shadow-orange-500/5 mx-auto rounded-3xl flex justify-between items-center transition-all duration-300 ${
            isScrolled
              ? "max-w-3xl p-2 rounded-4xl"
              : "max-w-5xl p-3 rounded-3xl"
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div
              className={`bg-black  aspect-square p-1 transition-all duration-300 ${
                isScrolled ? "p-0.5 rounded-full" : "p-1 rounded-2xl"
              }`}
            >
              <img
                src="/logo/logo.png"
                alt="uplist"
                className={`transition-all duration-300 ${
                  isScrolled ? "w-8 h-8" : "w-10 h-10"
                }`}
              />
            </div>
            <p
              className={`font-bold font-dm-sans transition-all duration-300 ${
                isScrolled ? "text-xl" : "text-2xl"
              }`}
            >
              Uplist
            </p>
          </div>

          <div
            className={`flex items-center gap-4 font-medium text-neutral-600 transition-all duration-300 ${
              isScrolled ? "gap-3" : "gap-4"
            }`}
          >
            <p
              className={`transition-all duration-300 ${
                isScrolled ? "text-sm" : "text-base"
              }`}
            >
              Explore
            </p>
            <p
              className={`transition-all duration-300 ${
                isScrolled ? "text-sm" : "text-base"
              }`}
            >
              Featured Artists
            </p>
            <p
              className={`bg-orange-500 font-bold text-white rounded-2xl transition-all duration-300 ${
                isScrolled ? "px-3 py-1.5 text-sm" : "px-4 py-2"
              }`}
            >
              Sign In
            </p>
          </div>
        </motion.div>
      </motion.div>
      <div className="min-h-[100dvh] w-full relative ">
        <motion.img
          src="/images/cd.png"
          alt="bg"
          className=" h-[70%] aspect-square object-cover absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-20"
          style={{ animation: "spin 10s linear infinite" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
          {...staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-dm-sans"
            {...fadeInUp}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="leading-tight">
              Artist Discovery & <br />
              <span className="text-orange-500">Booking Made Simple</span>
            </p>
          </motion.div>
          <motion.p 
            className="text-center text-neutral-600 mt-4"
            {...fadeInUp}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Connect with talented musicians, book secure performances, and
            <br />
            create unforgettable experiences for your events.
          </motion.p>

          <motion.div 
            className="w-full relative max-w-xl h-full mt-6 mx-auto flex items-center border-2 border-orange-600/30 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1 shadow-lg shadow-orange-500/10 hover:border-orange-500/50 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all duration-300"
            {...scaleIn}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileFocus={{ scale: 1.05 }}
          >
            <input
              type="text"
              placeholder="Search for an artist"
              className="w-full p-3 text-lg bg-transparent outline-none placeholder:text-neutral-400 focus:placeholder:text-orange-400 transition-colors duration-200"
            />
            <motion.img
              src="/images/mic.png"
              alt="search"
              className="h-28 w-auto object-scale-down absolute right-4"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 15 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              whileHover={{ rotate: 25, scale: 1.1 }}
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="max-w-5xl mx-auto w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.p 
          className="text-2xl font-bold font-dm-sans"
          {...fadeInLeft}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Featured <span className="text-orange-600">Artists</span>
        </motion.p>

        <motion.div 
          className="flex items-center gap-4 mt-6 w-full"
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
              className="w-full"
            >
              <SingerCard />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div 
        className="max-w-5xl mx-auto mt-10 w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.p 
          className="text-2xl font-bold font-dm-sans"
          {...fadeInLeft}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          How it <span className="text-orange-600">works</span>
        </motion.p>

        <motion.div 
          className="flex items-center gap-4 mt-6 w-full"
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
        className="w-full"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <FAQ />
      </motion.div>

      <motion.div
        className="w-full"
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

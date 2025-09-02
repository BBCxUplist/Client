import Navbar from "@/components/landing/Navbar";
import Scene3D from "@/components/3D/Scene3D";
import HeroSection from "@/components/landing/HeroSection";
import About from "@/components/landing/About";
import FeaturedArtist from "@/components/landing/FeaturedArtist";
import HowItWorks from "@/components/landing/HowItWorks";
import Faq from "@/components/landing/Faq";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-[100dvh] w-full bg-neutral-950 text-orange-600 border-b-4 md:border-b-6 lg:border-b-[10px] border-orange-500 texture-bg">
      <Navbar />
      <div className="w-full px-4 pb-0 md:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="h-[calc(100vh-80px)] w-full relative">
          <Scene3D className="w-full h-full opacity-20" />
          <HeroSection />
        </div>
        
        {/* Content Sections */}
        <div className="space-y-0">
          <About />
          <FeaturedArtist />
          <HowItWorks />
          <Faq />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Landing;

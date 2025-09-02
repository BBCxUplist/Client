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
    <div className="min-h-[100dvh] w-full bg-neutral-950 text-orange-600 border-b-[10px] border-orange-500 texture-bg">
      <Navbar />
      <div className="w-full p-4 pb-0 md:p-6 md:pb-0 lg:p-8 lg:pb-0">
        <div className="h-[calc(100vh-80px)] w-full  relative ">
          <Scene3D className="w-full h-full opacity-20" />
          <HeroSection />
        </div>
        <About />
        <FeaturedArtist />
        <HowItWorks />
        <Faq />
        <Footer />
      </div>
    </div>
  );
};

export default Landing;

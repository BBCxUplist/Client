import Navbar from "@/components/landing/Navbar";
import Scene3D from "@/components/3D/Scene3D";
import HeroSection from "@/components/landing/HeroSection";
import About from "@/components/landing/About";
import FeaturedArtist from "@/components/landing/FeaturedArtist";

const Landing = () => {
  return (
    <div className="min-h-[100dvh] w-full bg-neutral-950 text-orange-600">
      <Navbar />
      <div className="w-full p-4 md:p-6 lg:p-8">
        <div className="h-[calc(100vh-80px)] w-full  relative ">
          <Scene3D className="w-full h-full opacity-20" />
          <HeroSection />
        </div>
        <About />
        <FeaturedArtist />
      </div>
    </div>
  );
};

export default Landing;

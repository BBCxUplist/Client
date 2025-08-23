import SingerCard from "@/components/cards/SingerCard";
import FeatureCard from "@/components/cards/FeatureCard";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import { MicVocal } from "lucide-react";

export const Landing = () => {
  const features = [
    {
      icon: "/icons/search.svg",
      title: "Discover Artists",
      description: "Browse verified artists by genre, price, and availability to find the perfect match.",
      shadowIntensity: "heavy" as const,
    },
    {
      icon: "/icons/shield.svg",
      title: "Book Securely",
      description: "Secure escrow payments and verified profiles protect both artists and clients.",
      shadowIntensity: "medium" as const,
    },
    {
      icon: "/icons/message.svg",
      title: "Chat & Finalize",
      description: "Direct messaging for coordination, details, and seamless event planning.",
      shadowIntensity: "light" as const,
    },
  ];

  return (
    <div className="min-h-[100dvh] h-full w-full text-black">
      <div className="p-4 fixed top-0 z-10 w-full">
        <div className="border bg-white border-neutral-200 shadow-sm inset-shadow-sm shadow-orange-500/5 max-w-5xl mx-auto p-2 rounded-3xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-full w-fit bg-black rounded-2xl aspect-square p-1">
              <img src="/logo/logo.png" alt="uplist" className="w-10 h-10" />
            </div>
            <p className="text-2xl font-bold font-dm-sans">Uplist</p>
          </div>

          <div className="flex items-center gap-4 font-medium text-neutral-600">
            <p>Explore</p>
            <p>Featured Artists</p>
            <p className="bg-orange-500 font-bold text-white px-4 py-2 rounded-2xl">
              Sign In
            </p>
          </div>
        </div>
      </div>
      <div className="min-h-[100dvh] w-full relative ">
        <img
          src="/images/cd.png"
          alt="bg"
          className=" h-[70%] aspect-square object-cover absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-20"
          style={{ animation: "spin 10s linear infinite" }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-dm-sans">
            <p className="leading-tight">
              Artist Discovery & <br />
              <span className="text-orange-500">Booking Made Simple</span>
            </p>
          </div>
          <p className="text-center text-neutral-600 mt-4">
            Connect with talented musicians, book secure performances, and
            <br />
            create unforgettable experiences for your events.
          </p>

          <div className="w-full max-w-xl h-full mt-6 mx-auto flex items-center border border-neutral-200 rounded-3xl px-3">
            <input
              type="text"
              placeholder="Search for an artist"
              className="w-full p-2"
            />
            <MicVocal className="w-6 h-6 opacity-50" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <p className="text-2xl font-bold font-dm-sans">
          Featured <span className="text-orange-600">Artists</span>
        </p>

        <div className="flex items-center gap-4 mt-6">
          <SingerCard />
          <SingerCard />
          <SingerCard />
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10">
        <p className="text-2xl font-bold font-dm-sans">
          How it <span className="text-orange-600">works</span>
        </p>

        <div className="flex items-center gap-4 mt-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>

      <FAQ />

      <ContactSection />
    </div>
  );
};

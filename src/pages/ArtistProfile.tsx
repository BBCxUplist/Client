import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import { artists } from "@/constants/artists";
import AboutTab from "@/components/artist/AboutTab";
import MusicTab from "@/components/artist/MusicTab";
// import ReviewsTab from "@/components/artist/ReviewsTab";
import GalleryTab from "@/components/artist/GalleryTab";
import BookingTab from "@/components/artist/BookingTab";

const ArtistProfile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState<
    "about" | "music" | "gallery" | "booking"
  >("about");
  
  // Find artist by slug from the artists.ts file
  const artist = artists.find(a => a.slug === username);
  
  if (!artist) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="text-center">
            <img src="/images/userNotFound.jpeg" alt="Artist not found" className="w-32 h-32 mx-auto mb-4 opacity-50" />
            <h1 className="text-2xl text-white font-bold mb-2">Artist Not Found</h1>
            <p className="text-white/60">The artist you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen ">
      <Navbar />

      <div className="w-full p-4 md:p-6 lg:p-8 pb-24 md:pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Side - Artist Info */}
          <div className="lg:col-span-1">
            {/* Artist Header */}
            <div className="border-b lg:border-b-0 border-dashed border-white pb-6 md:pb-8 mb-6">
              {/* Artist Image */}
              <div className="relative mb-6">
                <img
                  src={artist?.avatar}
                  alt={artist?.name}
                  className="w-full aspect-square object-cover"
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.src = "/images/artistNotFound.jpeg";
                  }}
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 text-sm">
                  ⭐ {artist?.rating}
                </div>
                {artist?.isBookable && (
                  <div className="absolute bottom-4 left-4 bg-orange-500 text-black px-3 py-2 text-sm font-semibold">
                    AVAILABLE
                  </div>
                )}
              </div>

              {/* Artist Name */}
              <h1 className="font-mondwest text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {artist?.name}
              </h1>

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {artist?.categories?.map((category, index) => (
                  <span
                    key={index}
                    className="bg-white/10 text-white px-3 py-2 text-sm border border-white/20"
                  >
                    {category}
                  </span>
                )) || <span className="text-white/60">No categories available</span>}
              </div>

              {/* Booking Info */}
              <div className="bg-white/5 p-4 border border-white/10">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Starting Price</p>
                    <p className="text-xl md:text-2xl font-bold text-orange-500 font-mondwest">
                      {formatPrice(artist?.price)}
                    </p>
                  </div>
                  <button className="w-full bg-orange-500 text-black py-3 font-semibold hover:bg-orange-600 transition-colors duration-300 text-sm md:text-base">
                    BOOK NOW
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Tabs and Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-4 mb-6 md:mb-8 border-b border-dashed border-white pb-4">
              {["about", "music", "gallery", "booking"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "about" | "music" | "gallery" | "booking")}
                  className={`px-4 py-2 text-sm md:text-base font-semibold transition-all duration-300 border ${
                    activeTab === tab
                      ? "bg-white text-black border-white"
                      : "text-white border-white/30 hover:border-white/60"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Content Sections */}
            <div className="min-h-[400px]">
              {activeTab === "about" && <AboutTab artist={artist} />}
              {activeTab === "music" && <MusicTab artist={artist} />}
              {/* {activeTab === "reviews" && <ReviewsTab artist={artist} />} */}
              {activeTab === "gallery" && <GalleryTab artist={artist} />}
              {activeTab === "booking" && <BookingTab artist={artist} />}
            </div>
          </div>
        </div>

        {/* Sticky Booking Bar (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 border-t border-white/20 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-500 font-semibold text-lg font-mondwest">
                {formatPrice(artist?.price)}
              </p>
              <p className="text-white/60 text-sm">Starting price</p>
            </div>
            <button className="bg-orange-500 text-black px-6 py-3 font-semibold">
              BOOK NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;

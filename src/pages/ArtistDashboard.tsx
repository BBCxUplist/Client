import Navbar from "@/components/landing/Navbar";

const ArtistDashboard = () => {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      
      <div className="w-full p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="font-mondwest text-4xl md:text-6xl font-bold text-white mb-6">
              ARTIST DASHBOARD
            </h1>
            <p className="text-white/70 text-lg md:text-xl">
              Manage your artist profile and bookings
            </p>
          </div>
          
          {/* Content will be added here */}
          <div className="mt-12 text-center">
            <p className="text-white/60">Dashboard content will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDashboard;

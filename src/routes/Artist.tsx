import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Flag, Music } from "lucide-react";
import { useArtistBySlug } from "@/hooks/useArtists";
import { useAuth, useCurrentUser } from "@/hooks/useAuth";
import { EmptyState } from "@/components/common/EmptyState";

// Import new components
import { ArtistHero } from "@/components/artist/ArtistHero";
import { ArtistBio } from "@/components/artist/ArtistBio";
import { ArtistPhotos } from "@/components/artist/ArtistPhotos";
import { ArtistEmbeds } from "@/components/artist/ArtistEmbeds";
import { BookingCard } from "@/components/artist/BookingCard";
import { ArtistAvailability } from "@/components/artist/ArtistAvailability";
import { ArtistSocials } from "@/components/artist/ArtistSocials";
import { ReportModal } from "@/components/artist/ReportModal";

export const Artist = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, currentUserId } = useAuth();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  const artist = useArtistBySlug(slug || "");
  const isOwnProfile =
    currentUser?.role === "artist" && artist?.id === currentUserId;

  if (!artist) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={Music}
            title="Artist not found"
            description="The artist you're looking for doesn't exist or has been removed."
            action={{
              label: "Browse Artists",
              onClick: () => navigate("/explore"),
              variant: "outline",
            }}
          />
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate(`/book/${artist.id}`);
  };

  const handleReport = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowReportModal(true);
  };

  const submitReport = () => {
    // In a real app, this would call the report API
    console.log("Report submitted:", {
      artistId: artist.id,
      reason: reportReason,
      details: reportDetails,
    });
    setShowReportModal(false);
    setReportReason("");
    setReportDetails("");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        {/* Hero Section */}
        <ArtistHero artist={artist} />

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-6 sm:space-y-8">
            {/* Bio */}
            <ArtistBio bio={artist.bio || ""} />

            {/* Photos */}
            <ArtistPhotos photos={artist.photos} artistName={artist.name} />

            {/* Social Embeds */}
            <ArtistEmbeds embeds={artist.embeds || {}} />

            {/* Actions */}
            <div className="border-t border-neutral-200 pt-6 sm:pt-8">
              {isAuthenticated && !isOwnProfile && (
                <button
                  onClick={handleReport}
                  className="flex items-center justify-center space-x-2 px-4 py-2 border border-neutral-300 bg-white text-neutral-800 rounded-xl font-medium hover:bg-neutral-50 hover:border-neutral-400 transition-colors text-sm sm:text-base"
                >
                  <Flag className="h-4 w-4" />
                  <span>Report Artist</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Booking Card */}
            <BookingCard
              artist={artist}
              isOwnProfile={isOwnProfile}
              onBookNow={handleBookNow}
            />

            {/* Availability */}
            <ArtistAvailability availability={artist.availability} />

            {/* Social Links */}
            <ArtistSocials socials={artist.socials || {}} />
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={submitReport}
        reportReason={reportReason}
        reportDetails={reportDetails}
        onReasonChange={setReportReason}
        onDetailsChange={setReportDetails}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Calendar, 
  MapPin, 
  Music, 
  Play, 
  Instagram, 
  Youtube, 
  MessageCircle,
  Flag,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useArtistBySlug, useArtistById } from '@/hooks/useArtists';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { useAppStore } from '@/store';
import { EmptyState } from '@/components/common/EmptyState';
import { InformationIcon } from '@/components/common/InformationIcon';
import { formatPrice, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const Artist: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, currentUserId } = useAuth();
  const currentUser = useCurrentUser();
  const { createBooking } = useAppStore();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const artist = useArtistBySlug(slug || '');
  const isOwnProfile = currentUser?.role === 'artist' && artist?.id === currentUserId;

  if (!artist) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={Music}
            title="Artist not found"
            description="The artist you're looking for doesn't exist or has been removed."
            action={{
              label: "Browse Artists",
              onClick: () => navigate('/explore'),
              variant: "outline",
            }}
          />
        </div>
      </div>
    );
  }

  const ratingStars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={cn(
        'h-5 w-5',
        i < Math.floor(artist.rating) 
          ? 'fill-yellow-400 text-yellow-400' 
          : 'text-gray-300'
      )}
    />
  ));

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book/${artist.id}`);
  };

  const handleReport = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowReportModal(true);
  };

  const submitReport = () => {
    // In a real app, this would call the report API
    console.log('Report submitted:', { artistId: artist.id, reason: reportReason, details: reportDetails });
    setShowReportModal(false);
    setReportReason('');
    setReportDetails('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <div className="h-64 md:h-80 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg overflow-hidden">
            {artist.photos.length > 0 ? (
              <img
                src={artist.photos[0]}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Artist Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-end space-x-6">
              <img
                src={artist.avatar || `https://ui-avatars.com/api/?name=${artist.name}&size=150&background=random`}
                alt={artist.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div className="flex-1 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{artist.name}</h1>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center space-x-1">
                    {ratingStars}
                    <span className="ml-2 text-lg">{artist.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-2xl font-bold">{formatPrice(artist.price)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {artist.tags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {artist.bio || 'No bio available.'}
              </p>
            </div>

            {/* Photos */}
            {artist.photos.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {artist.photos.map((photo, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={photo}
                        alt={`${artist.name} photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Embeds */}
            {artist.embeds && Object.keys(artist.embeds).length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Music & Videos</h2>
                <div className="space-y-6">
                  {artist.embeds.youtube && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Youtube className="h-5 w-5 text-red-500" />
                        <span className="font-medium">YouTube</span>
                      </div>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  
                  {artist.embeds.spotify && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Youtube className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Spotify</span>
                      </div>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                  
                  {artist.embeds.soundcloud && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Music className="h-5 w-5 text-orange-500" />
                        <span className="font-medium">SoundCloud</span>
                      </div>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <Play className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-foreground mb-4">Book This Artist</h3>
              
              {!artist.isBookable ? (
                <div className="text-center py-6">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    This artist is not currently available for booking.
                  </p>
                  {isOwnProfile && artist.appealStatus === 'pending' && (
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                    >
                      Check Appeal Status
                    </Link>
                  )}
                  {isOwnProfile && artist.appealStatus === 'rejected' && (
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                    >
                      Submit New Appeal
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Date
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Choose a date</option>
                      {artist.availability.map((date) => (
                        <option key={date} value={date}>
                          {formatDate(date)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <InformationIcon text="This is the base price. Additional fees may apply." />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {formatPrice(artist.price)}
                    </div>
                  </div>

                  <button
                    onClick={handleBookNow}
                    disabled={!selectedDate}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Book Now
                  </button>
                </>
              )}
            </div>

            {/* Availability */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Availability</h3>
              <div className="space-y-2">
                {artist.availability.length > 0 ? (
                  artist.availability.slice(0, 5).map((date) => (
                    <div key={date} className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{formatDate(date)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No available dates</p>
                )}
                {artist.availability.length > 5 && (
                  <p className="text-muted-foreground text-sm">
                    +{artist.availability.length - 5} more dates
                  </p>
                )}
              </div>
            </div>

            {/* Social Links */}
            {artist.socials && Object.keys(artist.socials).length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Follow</h3>
                <div className="space-y-3">
                  {artist.socials.instagram && (
                    <a
                      href={artist.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>Instagram</span>
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                  {artist.socials.youtube && (
                    <a
                      href={artist.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Youtube className="h-5 w-5" />
                      <span>YouTube</span>
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                  {artist.socials.spotify && (
                    <a
                      href={artist.socials.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Spotify className="h-5 w-5" />
                      <span>Spotify</span>
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {isAuthenticated && !isOwnProfile && (
                <button
                  onClick={handleReport}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-input bg-background text-foreground rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Flag className="h-4 w-4" />
                  <span>Report Artist</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-bold text-foreground mb-4">Report Artist</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a reason</option>
                  <option value="inappropriate">Inappropriate behavior</option>
                  <option value="spam">Spam</option>
                  <option value="harassment">Harassment</option>
                  <option value="fake">Fake profile</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Details
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={3}
                  placeholder="Please provide additional details..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 border border-input bg-background text-foreground rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  disabled={!reportReason}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

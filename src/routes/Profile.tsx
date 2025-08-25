import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ExternalLink } from 'lucide-react';
import { useArtistById } from '@/hooks/useArtists';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { EmptyState } from '@/components/common/EmptyState';

export const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUserId } = useAuth();
  const currentUser = useCurrentUser();
  
  // If no userId is provided, show current user's profile
  const targetUserId = userId || currentUserId;
  
  // For demo purposes, we'll use artist data as user data
  // In a real app, this would be getUserById
  const user = useArtistById(targetUserId || '');

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={User}
            title="User not found"
            description="The user profile you're looking for doesn't exist."
          />
        </div>
      </div>
    );
  }

  const isOwnProfile = !userId || userId === currentUserId;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&size=150&background=random`}
              alt={user.name}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
              <p className="text-muted-foreground mb-4">
                {user.bio || 'No bio available'}
              </p>
              
              {/* Social Links */}
              {user.socials && Object.keys(user.socials).length > 0 && (
                <div className="flex space-x-4">
                  {user.socials.instagram && (
                    <a
                      href={user.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>Instagram</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {user.socials.twitter && (
                    <a
                      href={user.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>Twitter</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {user.socials.youtube && (
                    <a
                      href={user.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {user.bio || 'No bio available for this user.'}
              </p>
            </div>

            {/* Photos */}
            {user.photos && user.photos.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {user.photos.map((photo, index) => (
                    <motion.img
                      key={index}
                      src={photo}
                      alt={`${user.name} photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Reviews</h2>
              <p className="text-muted-foreground">
                Reviews feature coming soon. Users will be able to leave reviews after completed bookings.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold">{user.rating.toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold">${user.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-semibold">{user.isBookable ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {user.tags && user.tags.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {!isOwnProfile && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                    Book Now
                  </button>
                  <button className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-lg hover:bg-secondary/90 transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Artist } from '@/constants/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ArtistCardProps {
  artist: Artist;
  className?: string;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, className }) => {
  const ratingStars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={cn(
        'h-4 w-4',
        i < Math.floor(artist.rating) 
          ? 'fill-yellow-400 text-yellow-400' 
          : 'text-gray-300'
      )}
    />
  ));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={artist.avatar || `https://ui-avatars.com/api/?name=${artist.name}&size=200&background=random`}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-semibold">
          {formatPrice(artist.price)}
        </div>
        
        {/* Bookable status */}
        {!artist.isBookable && (
          <div className="absolute top-3 left-3 bg-muted/80 backdrop-blur-sm text-muted-foreground px-2 py-1 rounded-md text-xs">
            Not Available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name and rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {artist.name}
          </h3>
          <div className="flex items-center gap-1">
            {ratingStars}
            <span className="text-sm text-muted-foreground ml-1">
              {artist.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {artist.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
            >
              <Music className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
          {artist.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{artist.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Bio preview */}
        {artist.bio && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {artist.bio}
          </p>
        )}

        {/* Availability */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>
            {artist.availability.length} available date{artist.availability.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/artist/${artist.slug}`}
            className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
          >
            View Profile
          </Link>
          
          {artist.isBookable && (
            <Link
              to={`/book/${artist.id}`}
              className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

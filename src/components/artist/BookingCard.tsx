import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { InformationIcon } from '@/components/common/InformationIcon';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Artist } from '@/constants/types';

interface BookingCardProps {
  artist: Artist;
  isOwnProfile: boolean;
  onBookNow: () => void;
}

export const BookingCard = ({ 
  artist, 
  isOwnProfile, 
  onBookNow 
}: BookingCardProps) => {
  const [selectedDate, setSelectedDate] = useState('');

  if (!artist.isBookable) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold font-dm-sans text-neutral-800 mb-3 sm:mb-4">Book This Artist</h3>
        
        <div className="text-center py-3 sm:py-4">
          <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-orange-400 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-neutral-600 mb-3 sm:mb-4">
            This artist is not currently available for booking.
          </p>
          {isOwnProfile && artist.appealStatus === 'pending' && (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200 shadow-md text-sm sm:text-base"
            >
              Check Appeal Status
            </Link>
          )}
          {isOwnProfile && artist.appealStatus === 'rejected' && (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200 shadow-md text-sm sm:text-base"
            >
              Submit New Appeal
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold font-dm-sans text-neutral-800 mb-3 sm:mb-4">Book This Artist</h3>
      
      <div className="mb-3 sm:mb-4">
        <label className="block text-sm sm:text-base font-semibold text-neutral-700 mb-2 sm:mb-3">
          Select Date
        </label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-3 py-2 border-2 border-orange-200 rounded-xl bg-white text-neutral-800 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-sm sm:text-base"
        >
          <option value="">Choose a date</option>
          {artist.availability.map((date) => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-sm sm:text-base font-semibold text-neutral-700">Price</span>
          <InformationIcon text="This is the base price. Additional fees may apply." />
        </div>
        <div className="text-2xl sm:text-3xl font-bold text-orange-600">
          {formatPrice(artist.price)}
        </div>
      </div>

      <button
        onClick={onBookNow}
        disabled={!selectedDate}
        className="w-full py-3 px-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg hover:shadow-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
      >
        Book Now
      </button>
    </div>
  );
};

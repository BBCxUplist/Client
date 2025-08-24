import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageCircle,
  Plus,
  Star
} from 'lucide-react';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { useCurrentBookings, usePreviousBookings, useInquiries } from '@/hooks/useBookings';
import { useArtistById } from '@/hooks/useArtists';
import { EmptyState } from '@/components/common/EmptyState';
import { formatPrice, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const UserDashboard: React.FC = () => {
  const { currentUserId } = useAuth();
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'current' | 'previous' | 'inquiries'>('current');

  const currentBookings = useCurrentBookings(currentUserId!);
  const previousBookings = usePreviousBookings(currentUserId!);
  const inquiries = useInquiries(currentUserId!);

  const tabs = [
    { id: 'current', label: 'Current Bookings', count: currentBookings.length },
    { id: 'previous', label: 'Previous Bookings', count: previousBookings.length },
    { id: 'inquiries', label: 'Inquiries', count: inquiries.length },
  ] as const;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'negotiating':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'declined':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negotiating':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'declined':
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const renderBookingCard = (booking: any) => {
    const artist = useArtistById(booking.artistId);
    if (!artist) return null;

    return (
      <motion.div
        key={booking.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={artist.avatar || `https://ui-avatars.com/api/?name=${artist.name}&size=60&background=random`}
              alt={artist.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-foreground">{artist.name}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(booking.date)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(booking.status)}
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium border',
              getStatusColor(booking.status)
            )}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-semibold text-foreground">{formatPrice(booking.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Escrow Status:</span>
            <span className="font-medium text-foreground">{booking.escrowStatus}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex space-x-2">
            {booking.threadId && (
              <Link
                to={`/chat/${booking.threadId}`}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat</span>
              </Link>
            )}
            <Link
              to={`/artist/${artist.slug}`}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-input bg-white text-foreground rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              View Artist
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'current':
        return currentBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentBookings.map(renderBookingCard)}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No current bookings"
            description="You don't have any active bookings at the moment."
            action={{
              label: "Browse Artists",
              onClick: () => window.location.href = '/explore',
              variant: "outline",
            }}
          />
        );

      case 'previous':
        return previousBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previousBookings.map(renderBookingCard)}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle}
            title="No previous bookings"
            description="You haven't completed any bookings yet."
            action={{
              label: "Browse Artists",
              onClick: () => window.location.href = '/explore',
              variant: "outline",
            }}
          />
        );

      case 'inquiries':
        return inquiries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inquiries.map(renderBookingCard)}
          </div>
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="No inquiries"
            description="You haven't made any booking inquiries yet."
            action={{
              label: "Browse Artists",
              onClick: () => window.location.href = '/explore',
              variant: "outline",
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Bookings</p>
              <p className="text-2xl font-bold text-foreground">{currentBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">{previousBookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inquiries</p>
              <p className="text-2xl font-bold text-foreground">{inquiries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-lg">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={cn(
                    'ml-2 px-2 py-0.5 rounded-full text-xs font-medium',
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/explore"
            className="flex items-center space-x-3 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Browse Artists</p>
              <p className="text-sm text-muted-foreground">Find and book new artists</p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="flex items-center space-x-3 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">View Profile</p>
              <p className="text-sm text-muted-foreground">Manage your public profile</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

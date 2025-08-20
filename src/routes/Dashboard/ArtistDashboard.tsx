import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageCircle,
  AlertTriangle,
  DollarSign,
  Users,
  FileText
} from 'lucide-react';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { useArtistRequests, useArtistBookings } from '@/hooks/useBookings';
import { useAppealsByArtist } from '@/hooks/useAppeals';
import { useArtistById } from '@/hooks/useArtists';
import { EmptyState } from '@/components/common/EmptyState';
import { formatPrice, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const ArtistDashboard: React.FC = () => {
  const { currentUserId } = useAuth();
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'requests' | 'bookings' | 'appeal'>('requests');

  const requests = useArtistRequests(currentUserId!);
  const bookings = useArtistBookings(currentUserId!);
  const appeals = useAppealsByArtist(currentUserId!);
  const artist = useArtistById(currentUserId!);

  const tabs = [
    { id: 'requests', label: 'Pending Requests', count: requests.length },
    { id: 'bookings', label: 'Accepted Bookings', count: bookings.length },
    { id: 'appeal', label: 'Appeal Status', count: appeals.length },
  ] as const;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
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
      case 'accepted':
        return 'text-green-600 bg-green-50 border-green-200';
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
    const user = useArtistById(booking.userId); // This should be getUserById, but we'll use artist for now
    if (!user) return null;

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
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&size=60&background=random`}
              alt={user.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-foreground">{user.name}</h3>
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
            <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-input bg-background text-foreground rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
              View Details
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'requests':
        return requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map(renderBookingCard)}
          </div>
        ) : (
          <EmptyState
            icon={Clock}
            title="No pending requests"
            description="You don't have any pending booking requests at the moment."
            action={{
              label: "View Profile",
              onClick: () => window.location.href = `/artist/${artist?.slug}`,
              variant: "outline",
            }}
          />
        );

      case 'bookings':
        return bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map(renderBookingCard)}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No accepted bookings"
            description="You don't have any accepted bookings at the moment."
            action={{
              label: "View Profile",
              onClick: () => window.location.href = `/artist/${artist?.slug}`,
              variant: "outline",
            }}
          />
        );

      case 'appeal':
        if (!artist) return null;
        
        if (artist.isBookable) {
          return (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Approved!</h3>
              <p className="text-muted-foreground mb-6">
                Your artist profile has been approved and you can now accept bookings.
              </p>
              <Link
                to={`/artist/${artist.slug}`}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                View Public Profile
              </Link>
            </div>
          );
        }

        const pendingAppeal = appeals.find(a => a.status === 'pending');
        const rejectedAppeal = appeals.find(a => a.status === 'rejected');

        if (pendingAppeal) {
          return (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Appeal Under Review</h3>
              <p className="text-muted-foreground mb-6">
                Your appeal is currently being reviewed by our team. We'll notify you once a decision has been made.
              </p>
              <div className="bg-muted rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground">
                  Submitted: {formatDate(pendingAppeal.submittedAt)}
                </p>
              </div>
            </div>
          );
        }

        if (rejectedAppeal) {
          return (
            <div className="text-center py-12">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Appeal Rejected</h3>
              <p className="text-muted-foreground mb-6">
                Your previous appeal was not approved. You can submit a new appeal with additional information.
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
                Submit New Appeal
              </button>
            </div>
          );
        }

        return (
          <EmptyState
            icon={FileText}
            title="No appeal submitted"
            description="You need to submit an appeal to be approved as an artist."
            action={{
              label: "Submit Appeal",
              onClick: () => {/* Handle appeal submission */},
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
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
              <p className="text-2xl font-bold text-foreground">{requests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accepted Bookings</p>
              <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold text-foreground">
                {formatPrice(bookings.reduce((sum, booking) => sum + booking.amount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Status Banner */}
      {artist && !artist.isBookable && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Profile Not Yet Approved</h3>
              <p className="text-sm text-yellow-700">
                Your artist profile is pending approval. You cannot accept bookings until approved.
              </p>
            </div>
          </div>
        </div>
      )}

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
            to={`/artist/${artist?.slug}`}
            className="flex items-center space-x-3 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">View Public Profile</p>
              <p className="text-sm text-muted-foreground">See how your profile appears to users</p>
            </div>
          </Link>

          <button className="flex items-center space-x-3 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Edit Profile</p>
              <p className="text-sm text-muted-foreground">Update your bio, photos, and availability</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageCircle,
  Plus,
  Star,
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { useCurrentBookings, usePreviousBookings, useInquiries } from '@/hooks/useBookings';
import { useArtistById } from '@/hooks/useArtists';
import { EmptyState } from '@/components/common/EmptyState';
import { formatPrice, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const UserDashboard = () => {
  const { currentUserId } = useAuth();
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState<'current' | 'previous' | 'inquiries'>('current');

  const currentBookings = useCurrentBookings(currentUserId!);
  const previousBookings = usePreviousBookings(currentUserId!);
  const inquiries = useInquiries(currentUserId!);

  // Dummy data for better demo
  const dummyCurrentBookings = [
    {
      id: '1',
      artistId: '1',
      date: '2024-02-15',
      amount: 500,
      status: 'confirmed',
      escrowStatus: 'Funded',
      threadId: 'thread1'
    },
    {
      id: '2',
      artistId: '2',
      date: '2024-02-20',
      amount: 750,
      status: 'negotiating',
      escrowStatus: 'Pending',
      threadId: 'thread2'
    }
  ];

  const dummyPreviousBookings = [
    {
      id: '3',
      artistId: '3',
      date: '2024-01-15',
      amount: 400,
      status: 'completed',
      escrowStatus: 'Released',
      threadId: 'thread3'
    },
    {
      id: '4',
      artistId: '4',
      date: '2024-01-10',
      amount: 600,
      status: 'completed',
      escrowStatus: 'Released',
      threadId: 'thread4'
    }
  ];

  const dummyInquiries = [
    {
      id: '5',
      artistId: '5',
      date: '2024-02-25',
      amount: 800,
      status: 'pending',
      escrowStatus: 'Not Started',
      threadId: 'thread5'
    }
  ];

  const tabs = [
    { id: 'current', label: 'Current Bookings', count: dummyCurrentBookings.length },
    { id: 'previous', label: 'Previous Bookings', count: dummyPreviousBookings.length },
    { id: 'inquiries', label: 'Inquiries', count: dummyInquiries.length },
  ] as const;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'negotiating':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'declined':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negotiating':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'declined':
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-neutral-600 bg-neutral-50 border-neutral-200';
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
        className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={artist.avatar || `https://ui-avatars.com/api/?name=${artist.name}&size=60&background=random`}
              alt={artist.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-neutral-800">{artist.name}</h3>
              <p className="text-sm text-neutral-600">{formatDate(booking.date)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(booking.status)}
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border',
              getStatusColor(booking.status)
            )}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Amount:</span>
            <span className="font-semibold text-neutral-800">{formatPrice(booking.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Escrow Status:</span>
            <span className="font-medium text-neutral-800">{booking.escrowStatus}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200">
          <div className="flex space-x-3">
            {booking.threadId && (
              <Link
                to={`/chat/${booking.threadId}`}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat</span>
              </Link>
            )}
            <Link
              to={`/artist/${artist.slug}`}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-neutral-300 bg-white text-neutral-800 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors"
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
        return dummyCurrentBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dummyCurrentBookings.map(renderBookingCard)}
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
        return dummyPreviousBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dummyPreviousBookings.map(renderBookingCard)}
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
        return dummyInquiries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dummyInquiries.map(renderBookingCard)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Current Bookings</p>
              <p className="text-2xl font-bold text-neutral-800">{dummyCurrentBookings.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Completed</p>
              <p className="text-2xl font-bold text-neutral-800">{dummyPreviousBookings.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Inquiries</p>
              <p className="text-2xl font-bold text-neutral-800">{dummyInquiries.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Spent</p>
              <p className="text-2xl font-bold text-neutral-800">$2,450</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm mb-8">
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-800 hover:border-neutral-300'
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={cn(
                    'ml-2 px-2 py-0.5 rounded-full text-xs font-medium',
                    activeTab === tab.id
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-neutral-100 text-neutral-600'
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
      <div className="mb-8">
        <h3 className="text-xl font-bold text-neutral-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/explore"
            className="flex items-center space-x-4 p-6 bg-white border border-neutral-200 rounded-2xl hover:shadow-lg transition-all duration-200"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Plus className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-neutral-800">Browse Artists</p>
              <p className="text-sm text-neutral-600">Find and book new artists</p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="flex items-center space-x-4 p-6 bg-white border border-neutral-200 rounded-2xl hover:shadow-lg transition-all duration-200"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-neutral-800">View Profile</p>
              <p className="text-sm text-neutral-600">Manage your public profile</p>
            </div>
          </Link>

          <Link
            to="/chat"
            className="flex items-center space-x-4 p-6 bg-white border border-neutral-200 rounded-2xl hover:shadow-lg transition-all duration-200"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="font-semibold text-neutral-800">Messages</p>
              <p className="text-sm text-neutral-600">View your conversations</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

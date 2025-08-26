import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Music, 
  UserCheck, 
  UserX, 
  Shield,
  Star,
  DollarSign
} from 'lucide-react';
import { useIsAdmin } from '@/hooks/useAuth';
import { useAppStore } from '@/store';
import { useArtists } from '@/hooks/useArtists';
import { EmptyState } from '@/components/common/EmptyState';
import { formatDate, formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const Artists = () => {
  const isAdmin = useIsAdmin();
  const { toggleBan } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'pending' | 'banned'>('all');
  
  const allArtists = useArtists();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={Shield}
            title="Access Denied"
            description="You don't have permission to access this page."
          />
        </div>
      </div>
    );
  }

  const filteredArtists = (() => {
    switch (activeTab) {
      case 'approved':
        return allArtists.filter(artist => artist.isBookable);
      case 'pending':
        return allArtists.filter(artist => !artist.isBookable && artist.appealStatus === 'pending');
      case 'banned':
        return allArtists.filter(artist => artist.banned);
      default:
        return allArtists;
    }
  })();

  const tabs = [
    { id: 'all', label: 'All Artists', count: allArtists.length },
    { id: 'approved', label: 'Approved', count: allArtists.filter(a => a.isBookable).length },
    { id: 'pending', label: 'Pending', count: allArtists.filter(a => !a.isBookable && a.appealStatus === 'pending').length },
    { id: 'banned', label: 'Banned', count: allArtists.filter(a => a.banned).length },
  ] as const;

  const handleToggleBan = (artistId: string) => {
    toggleBan(artistId, 'artist');
  };

  const renderArtistCard = (artist: any) => {
    return (
      <motion.div
        key={artist.id}
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
              <p className="text-sm text-muted-foreground">{artist.slug}</p>
              <p className="text-xs text-muted-foreground">
                Joined {formatDate(artist.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {artist.banned ? (
              <UserX className="h-4 w-4 text-red-500" />
            ) : artist.isBookable ? (
              <UserCheck className="h-4 w-4 text-green-500" />
            ) : (
              <Shield className="h-4 w-4 text-yellow-500" />
            )}
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium border',
              artist.banned
                ? 'text-red-600 bg-red-50 border-red-200'
                : artist.isBookable
                ? 'text-green-600 bg-green-50 border-green-200'
                : 'text-yellow-600 bg-yellow-50 border-yellow-200'
            )}>
              {artist.banned ? 'Banned' : artist.isBookable ? 'Approved' : 'Pending'}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rating:</span>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-foreground">{artist.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price:</span>
            <span className="text-foreground font-semibold">{formatPrice(artist.price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tags:</span>
            <span className="text-foreground">{artist.tags.slice(0, 2).join(', ')}</span>
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-border">
          <button
            onClick={() => handleToggleBan(artist.id)}
            className={cn(
              'flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors',
              artist.banned
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            )}
          >
            {artist.banned ? (
              <>
                <UserCheck className="h-4 w-4" />
                <span>Unban Artist</span>
              </>
            ) : (
              <>
                <UserX className="h-4 w-4" />
                <span>Ban Artist</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    if (filteredArtists.length === 0) {
      return (
        <EmptyState
          icon={Music}
          title={`No ${activeTab === 'banned' ? 'banned' : activeTab === 'approved' ? 'approved' : activeTab === 'pending' ? 'pending' : ''} artists`}
          description={`No ${activeTab} artists found.`}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map(renderArtistCard)}
      </div>
    );
  };

  const stats = [
    {
      title: 'Total Artists',
      value: allArtists.length,
      icon: Music,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Approved',
      value: allArtists.filter(a => a.isBookable).length,
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Pending',
      value: allArtists.filter(a => !a.isBookable && a.appealStatus === 'pending').length,
      icon: Shield,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Banned',
      value: allArtists.filter(a => a.banned).length,
      icon: UserX,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Artist Management</h1>
          <p className="text-muted-foreground">
            Manage artist accounts and approval status
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
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
      </div>
    </div>
  );
};

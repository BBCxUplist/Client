import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { UserDashboard } from './Dashboard/UserDashboard';
import { ArtistDashboard } from './Dashboard/ArtistDashboard';
import { EmptyState } from '@/components/common/EmptyState';
import { User, Music } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { isAuthenticated, currentUserId } = useAuth();
  const currentUser = useCurrentUser();

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={User}
            title="Authentication Required"
            description="Please sign in to access your dashboard."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser.name}!
          </p>
        </div>

        {/* Role-based Dashboard */}
        {currentUser.role === 'user' && <UserDashboard />}
        {currentUser.role === 'artist' && <ArtistDashboard />}
        {currentUser.role === 'admin' && (
          <div className="text-center py-12">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Admin dashboard is available at /admin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

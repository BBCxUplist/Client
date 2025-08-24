import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { usePendingAppeals, useApprovedAppeals, useRejectedAppeals } from '@/hooks/useAppeals';
import { useArtistById } from '@/hooks/useArtists';
import { useIsAdmin } from '@/hooks/useAuth';
import { useAppStore } from '@/store';
import { EmptyState } from '@/components/common/EmptyState';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const Appeals: React.FC = () => {
  const isAdmin = useIsAdmin();
  const { approveAppeal, rejectAppeal } = useAppStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  
  const pendingAppeals = usePendingAppeals();
  const approvedAppeals = useApprovedAppeals();
  const rejectedAppeals = useRejectedAppeals();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={AlertTriangle}
            title="Access Denied"
            description="You don't have permission to access this page."
          />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'pending', label: 'Pending', count: pendingAppeals.length },
    { id: 'approved', label: 'Approved', count: approvedAppeals.length },
    { id: 'rejected', label: 'Rejected', count: rejectedAppeals.length },
  ] as const;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const renderAppealCard = (appeal: any) => {
    const artist = useArtistById(appeal.artistId);
    if (!artist) return null;

    const handleApprove = () => {
      approveAppeal(appeal.id);
    };

    const handleReject = () => {
      rejectAppeal(appeal.id);
    };

    return (
      <motion.div
        key={appeal.id}
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
              <p className="text-sm text-muted-foreground">
                Submitted {formatDate(appeal.submittedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(appeal.status)}
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium border',
              getStatusColor(appeal.status)
            )}>
              {appeal.status.charAt(0).toUpperCase() + appeal.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Appeal Message</h4>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {appeal.message}
            </p>
          </div>

          {appeal.portfolioLinks && appeal.portfolioLinks.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-2">Portfolio Links</h4>
              <div className="space-y-2">
                {appeal.portfolioLinks.map((link: string, index: number) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{link}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {appeal.status === 'pending' && (
            <div className="flex space-x-3 pt-4 border-t border-border">
              <button
                onClick={handleApprove}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve</span>
              </button>
              <button
                onClick={handleReject}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pending':
        return pendingAppeals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {pendingAppeals.map(renderAppealCard)}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle}
            title="No pending appeals"
            description="All appeals have been reviewed."
          />
        );

      case 'approved':
        return approvedAppeals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {approvedAppeals.map(renderAppealCard)}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle}
            title="No approved appeals"
            description="No appeals have been approved yet."
          />
        );

      case 'rejected':
        return rejectedAppeals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {rejectedAppeals.map(renderAppealCard)}
          </div>
        ) : (
          <EmptyState
            icon={XCircle}
            title="No rejected appeals"
            description="No appeals have been rejected yet."
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Artist Appeals</h1>
          <p className="text-muted-foreground">
            Review and manage artist approval appeals
          </p>
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

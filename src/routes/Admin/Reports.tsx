import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flag, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Music
} from 'lucide-react';
import { useOpenReports, useClosedReports } from '@/hooks/useReports';
import { useArtistById } from '@/hooks/useArtists';
import { useIsAdmin } from '@/hooks/useAuth';
import { useAppStore } from '@/store';
import { EmptyState } from '@/components/common/EmptyState';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const Reports: React.FC = () => {
  const isAdmin = useIsAdmin();
  const { closeReport } = useAppStore();
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');
  
  const openReports = useOpenReports();
  const closedReports = useClosedReports();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={Flag}
            title="Access Denied"
            description="You don't have permission to access this page."
          />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'open', label: 'Open Reports', count: openReports.length },
    { id: 'closed', label: 'Closed Reports', count: closedReports.length },
  ] as const;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Flag className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'open':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'artist':
        return <Music className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const renderReportCard = (report: any) => {
    const target = useArtistById(report.targetId); // This should be getUserById for users
    const reporter = useArtistById(report.reporterId); // This should be getUserById

    if (!target || !reporter) return null;

    const handleClose = () => {
      closeReport(report.id);
    };

    return (
      <motion.div
        key={report.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getTargetIcon(report.targetType)}
              <img
                src={target.avatar || `https://ui-avatars.com/api/?name=${target.name}&size=60&background=random`}
                alt={target.name}
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{target.name}</h3>
              <p className="text-sm text-muted-foreground">
                Reported by {reporter.name} • {formatDate(report.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(report.status)}
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium border',
              getStatusColor(report.status)
            )}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Reason</h4>
            <span className="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
              {report.reason}
            </span>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">Details</h4>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {report.details}
            </p>
          </div>

          {report.status === 'open' && (
            <div className="flex space-x-3 pt-4 border-t border-border">
              <button
                onClick={handleClose}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Close Report</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'open':
        return openReports.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {openReports.map(renderReportCard)}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle}
            title="No open reports"
            description="All reports have been resolved."
          />
        );

      case 'closed':
        return closedReports.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {closedReports.map(renderReportCard)}
          </div>
        ) : (
          <EmptyState
            icon={Flag}
            title="No closed reports"
            description="No reports have been closed yet."
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">User Reports</h1>
          <p className="text-muted-foreground">
            Review and manage user reports
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

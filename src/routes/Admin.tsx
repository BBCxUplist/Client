import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Music, 
  AlertTriangle, 
  Flag, 
  Shield
} from 'lucide-react';
import { usePendingAppeals } from '@/hooks/useAppeals';
import { useOpenReports } from '@/hooks/useReports';
import { useIsAdmin } from '@/hooks/useAuth';
import { EmptyState } from '@/components/common/EmptyState';

export const Admin: React.FC = () => {
  const isAdmin = useIsAdmin();
  const pendingAppeals = usePendingAppeals();
  const openReports = useOpenReports();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={Shield}
            title="Access Denied"
            description="You don't have permission to access the admin dashboard."
          />
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Pending Appeals',
      value: pendingAppeals.length,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      href: '/admin/appeals',
    },
    {
      title: 'Open Reports',
      value: openReports.length,
      icon: Flag,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      href: '/admin/reports',
    },
    {
      title: 'Total Users',
      value: 25, // Mock data
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      href: '/admin/users',
    },
    {
      title: 'Total Artists',
      value: 12, // Mock data
      icon: Music,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      href: '/admin/artists',
    },
  ];

  const quickActions = [
    {
      title: 'Review Appeals',
      description: 'Review and approve/reject artist appeals',
      icon: AlertTriangle,
      href: '/admin/appeals',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Handle Reports',
      description: 'Review and resolve user reports',
      icon: Flag,
      href: '/admin/reports',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Manage Artists',
      description: 'View and manage artist profiles',
      icon: Music,
      href: '/admin/artists',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage the UPlist platform and moderate content
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <Link to={stat.href} className="block">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <Link to={action.href} className="block">
                  <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">New appeal submitted</p>
                <p className="text-xs text-muted-foreground">Emma Wilson submitted an appeal 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Flag className="h-5 w-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">New report filed</p>
                <p className="text-xs text-muted-foreground">User reported James Brown for inappropriate behavior</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">New user registered</p>
                <p className="text-xs text-muted-foreground">Sarah Johnson joined the platform yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

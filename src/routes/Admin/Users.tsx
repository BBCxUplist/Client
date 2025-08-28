import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users as UsersIcon, 
  UserCheck, 
  UserX, 
  Shield,

} from 'lucide-react';
import { useIsAdmin } from '@/hooks/useAuth';
import { useAppStore } from '@/store';
import { EmptyState } from '@/components/common/EmptyState';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export const Users = () => {
  const isAdmin = useIsAdmin();
  const { toggleBan } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'banned'>('all');
  
  // Mock user data - in real app, this would come from the store
  const users = [
    {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      banned: false,
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      banned: false,
      createdAt: '2024-01-20T14:30:00Z',
    },
    {
      id: 'user-3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'user',
      banned: true,
      createdAt: '2024-01-10T09:15:00Z',
    },
  ];

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

  const filteredUsers = activeTab === 'banned' 
    ? users.filter(user => user.banned)
    : users;

  const tabs = [
    { id: 'all', label: 'All Users', count: users.length },
    { id: 'banned', label: 'Banned Users', count: users.filter(u => u.banned).length },
  ] as const;

  const handleToggleBan = (userId: string) => {
    toggleBan(userId, 'user');
  };

  const renderUserCard = (user: any) => {
    return (
      <motion.div
        key={user.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}&size=60&background=random`}
              alt={user.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Joined {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user.banned ? (
              <UserX className="h-4 w-4 text-red-500" />
            ) : (
              <UserCheck className="h-4 w-4 text-green-500" />
            )}
            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium border',
              user.banned
                ? 'text-red-600 bg-red-50 border-red-200'
                : 'text-green-600 bg-green-50 border-green-200'
            )}>
              {user.banned ? 'Banned' : 'Active'}
            </span>
          </div>
        </div>

        <div className="flex space-x-3 pt-4 border-t border-border">
          <button
            onClick={() => handleToggleBan(user.id)}
            className={cn(
              'flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors',
              user.banned
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            )}
          >
            {user.banned ? (
              <>
                <UserCheck className="h-4 w-4" />
                <span>Unban User</span>
              </>
            ) : (
              <>
                <UserX className="h-4 w-4" />
                <span>Ban User</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  const renderTabContent = () => {
    if (filteredUsers.length === 0) {
      return (
        <EmptyState
          icon={activeTab === 'banned' ? UserX : UsersIcon}
          title={`No ${activeTab === 'banned' ? 'banned' : ''} users`}
          description={activeTab === 'banned' 
            ? 'No users are currently banned.'
            : 'No users found.'
          }
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(renderUserCard)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <UsersIcon className="h-5 w-5 text-blue-500" />
          </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => !u.banned).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <UserX className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Banned Users</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.banned).length}
                </p>
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
      </div>
    </div>
  );
};

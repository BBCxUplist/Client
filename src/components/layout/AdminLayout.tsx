import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Music, 
  AlertTriangle, 
  Flag, 
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { logout } = useAuth();
  const currentUser = useCurrentUser();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Appeals', href: '/admin/appeals', icon: AlertTriangle },
    { name: 'Reports', href: '/admin/reports', icon: Flag },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Artists', href: '/admin/artists', icon: Music },
  ];

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name}&size=32&background=random`}
                alt={currentUser?.name}
                className="h-8 w-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-1 lg:hidden" />
            
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-foreground">
                {navigation.find(item => item.href === location.pathname)?.name || 'Admin'}
              </h1>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

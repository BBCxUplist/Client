import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/stores/store';
import UserDashboard from './UserDashboard';
import ArtistDashboard from './ArtistDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user, isAuthenticated } = useStore();
  const navigate = useNavigate();

  // Get role directly from user object to avoid function recreation
  const userRole = user?.role;

  useEffect(() => {
    // Redirect to auth if not authenticated
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    // If no role is set, redirect to auth
    if (!userRole) {
      navigate('/auth');
      return;
    }
  }, [isAuthenticated, userRole, navigate]);

  // Show loading or redirect if not authenticated
  if (!isAuthenticated || !userRole) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black'>
        <div className='text-white'>Loading...</div>
      </div>
    );
  }

  // Render appropriate dashboard based on role
  switch (userRole) {
    case 'user':
      return <UserDashboard />;
    case 'artist':
      return <ArtistDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <div className='min-h-screen flex items-center justify-center bg-black'>
          <div className='text-white'>Invalid user role</div>
        </div>
      );
  }
};

export default Dashboard;

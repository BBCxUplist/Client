import { useNavigate } from 'react-router-dom';
import { useStore } from '@/stores/store';

interface ErrorStateProps {
  title: string;
  message: string;
  actionText?: string;
  actionPath?: string;
  onAction?: () => void;
  type?: 'auth' | 'error' | 'not-found';
}

const ErrorState = ({
  title,
  message,
  actionText = 'Go to Login',
  actionPath = '/auth',
  onAction,
  type = 'error',
}: ErrorStateProps) => {
  const navigate = useNavigate();
  const { logout } = useStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to home
      navigate('/');
    }
  };

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigate(actionPath);
    }
  };

  const getActionButton = () => {
    if (type === 'auth') {
      return (
        <div className='flex gap-3 justify-center'>
          <button
            onClick={handleAction}
            className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
          >
            {actionText}
          </button>
          <button
            onClick={handleLogout}
            className='bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-2 font-semibold hover:bg-red-500/30 transition-colors'
          >
            Logout
          </button>
        </div>
      );
    }

    if (type === 'error') {
      return (
        <div className='flex gap-3 justify-center'>
          <button
            onClick={onAction || (() => window.location.reload())}
            className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
          >
            {onAction ? actionText : 'Try Again'}
          </button>
          <button
            onClick={handleLogout}
            className='bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-2 font-semibold hover:bg-red-500/30 transition-colors'
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className='flex gap-3 justify-center'>
        <button
          onClick={handleAction}
          className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
        >
          {actionText}
        </button>
        <button
          onClick={handleLogout}
          className='bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-2 font-semibold hover:bg-red-500/30 transition-colors'
        >
          Logout
        </button>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-2'>{title}</h1>
        <p className='text-white/60 mb-4'>{message}</p>
        {getActionButton()}
      </div>
    </div>
  );
};

export default ErrorState;

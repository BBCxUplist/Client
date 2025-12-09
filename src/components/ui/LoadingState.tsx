interface LoadingStateProps {
  message?: string;
  type?: 'dashboard' | 'admin';
}

const LoadingState = ({
  message = 'Loading your dashboard...',
  type = 'dashboard',
}: LoadingStateProps) => {
  if (type === 'admin') {
    return (
      <div className='min-h-screen bg-neutral-950 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-white text-lg'>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4'></div>
        <p className='text-white/60'>{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;

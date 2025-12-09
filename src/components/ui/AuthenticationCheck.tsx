import ErrorState from './ErrorState';

interface AuthenticationCheckProps {
  isAuthenticated: boolean;
  user: any;
  children: React.ReactNode;
}

const AuthenticationCheck = ({
  isAuthenticated,
  user,
  children,
}: AuthenticationCheckProps) => {
  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <ErrorState
        title='Authentication Required'
        message='Please log in to access your dashboard.'
        actionText='Go to Login'
        actionPath='/auth'
        type='auth'
      />
    );
  }

  return <>{children}</>;
};

export default AuthenticationCheck;

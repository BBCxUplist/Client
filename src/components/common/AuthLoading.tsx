import { Loader2 } from 'lucide-react';

export const AuthLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-neutral-600">Loading...</p>
      </div>
    </div>
  );
};

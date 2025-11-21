import { useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success'
  ) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    hideToast,
    showSuccess: (message: string) => showToast(message, 'success'),
    showError: (message: string) => showToast(message, 'error'),
    showInfo: (message: string) => showToast(message, 'info'),
  };
};

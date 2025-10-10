import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { setupAxiosInterceptors } from '@/lib/axiosInterceptors';
import { initializeStorageMigration } from '@/lib/storageMigration';

// Initialize storage migration and setup axios interceptors
initializeStorageMigration();
setupAxiosInterceptors();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

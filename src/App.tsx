import { Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import ArtistProfile from './pages/ArtistProfile';
import ArtistEdit from './pages/ArtistEdit';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Messages from './pages/Messages';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import PaymentExpire from './pages/PaymentExpire';
import PaymentFailed from './pages/PaymentFailed';
import { QueryProvider } from './providers/QueryProvider';
import GlobalModelPreloader from './components/3D/GlobalModelPreloader';
import AuthStateListener from './components/auth/AuthStateListener';
import AuthProvider from './components/auth/AuthProvider';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <div>
          <GlobalModelPreloader />
          {/* Auth State Listener for Google Login */}
          <AuthStateListener />
          <Toaster
            position='top-right'
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.4)',
                color: '#0a0a0a',
                border: '2px solid #ffffff',
                borderRadius: '0px',
                fontFamily: 'NonNaturalGrotesk, sans-serif',
                fontSize: '14px',
                fontWeight: '400',
                boxShadow:
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(8px)',
                padding: '12px',
                minWidth: '60px',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              // Success toasts
              success: {
                style: {
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: '#16a34a',
                  border: '2px solid #ffffff',
                  borderRadius: '0px',
                },
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff',
                },
              },
              // Error toasts
              error: {
                style: {
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: '#dc2626',
                  border: '2px solid #ffffff',
                  borderRadius: '0px',
                },
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
              // Loading toasts
              loading: {
                style: {
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: '#ea580c',
                  border: '2px solid #ffffff',
                  borderRadius: '0px',
                },
                iconTheme: {
                  primary: '#f97316',
                  secondary: '#ffffff',
                },
              },
              // Animation duration
              duration: 4000,
            }}
          />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/explore' element={<Explore />} />
            <Route path='/artist/:username' element={<ArtistProfile />} />
            <Route path='/dashboard/edit' element={<ArtistEdit />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/terms' element={<Terms />} />
            <Route path='/privacy' element={<Privacy />} />
            <Route path='/payment/success' element={<PaymentSuccess />} />
            <Route path='/payment/cancel' element={<PaymentCancel />} />
            <Route path='/payment/expire' element={<PaymentExpire />} />
            <Route path='/payment/failed' element={<PaymentFailed />} />
          </Routes>
        </div>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;

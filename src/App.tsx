import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/common/PageTransition';
import { useIsBanned } from '@/hooks/useAuth';

// Layouts
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Pages
import { Landing } from '@/routes/Landing';
import { Login } from '@/routes/Login';
import { Explore } from '@/routes/Explore';
import { Artist } from '@/routes/Artist';
import { Book } from '@/routes/Book';
import { Chat } from '@/routes/Chat';
import { Profile } from '@/routes/Profile';
import { Dashboard } from '@/routes/Dashboard';
import { Admin } from '@/routes/Admin';

// Admin pages
import { Appeals } from '@/routes/Admin/Appeals';
import { Reports } from '@/routes/Admin/Reports';
import { Users } from '@/routes/Admin/Users';
import { Artists } from '@/routes/Admin/Artists';

function App() {
  const isBanned = useIsBanned();

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        {isBanned && (
          <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm">
            Your account has been suspended. Please contact support for assistance.
          </div>
        )}
        
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <PageTransition>
                <Landing />
              </PageTransition>
            } />

            <Route path="/login" element={
              <PageTransition>
                <AuthLayout>
                  <Login />
                </AuthLayout>
              </PageTransition>
            } />
            
            <Route path="/explore" element={
              <PageTransition>
                <AppLayout>
                  <Explore />
                </AppLayout>
              </PageTransition>
            } />
            
            <Route path="/artist/:slug" element={
              <PageTransition>
                <AppLayout>
                  <Artist />
                </AppLayout>
              </PageTransition>
            } />
            
            <Route path="/profile/:userId" element={
              <PageTransition>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </PageTransition>
            } />
            
            {/* Protected routes */}
            <Route path="/book/:artistId" element={
              <PageTransition>
                <AppLayout>
                  <Book />
                </AppLayout>
              </PageTransition>
            } />
            
            <Route path="/chat/:threadId" element={
              <PageTransition>
                <AppLayout>
                  <Chat />
                </AppLayout>
              </PageTransition>
            } />
            
            <Route path="/dashboard" element={
              <PageTransition>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </PageTransition>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <PageTransition>
                <AdminLayout>
                  <Admin />
                </AdminLayout>
              </PageTransition>
            } />
            
            <Route path="/admin/appeals" element={
              <PageTransition>
                <AdminLayout>
                  <Appeals />
                </AdminLayout>
              </PageTransition>
            } />
            
            <Route path="/admin/reports" element={
              <PageTransition>
                <AdminLayout>
                  <Reports />
                </AdminLayout>
              </PageTransition>
            } />
            
            <Route path="/admin/users" element={
              <PageTransition>
                <AdminLayout>
                  <Users />
                </AdminLayout>
              </PageTransition>
            } />
            
            <Route path="/admin/artists" element={
              <PageTransition>
                <AdminLayout>
                  <Artists />
                </AdminLayout>
              </PageTransition>
            } />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;

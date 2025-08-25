import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24">
        {children}
      </main>

      <Footer />
    </div>
  );
};

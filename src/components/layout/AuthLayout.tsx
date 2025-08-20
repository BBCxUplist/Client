import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2">
              <Music className="h-12 w-12 text-primary" />
              <span className="text-3xl font-bold text-foreground">UPlist</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect with talented musicians
            </p>
          </div>

          {/* Auth Form */}
          {children}
        </motion.div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="h-full flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center max-w-lg"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Book Amazing Live Music
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Discover talented musicians, book secure performances, and create unforgettable experiences for your events.
            </p>
            
            <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Verified artists with reviews</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Secure escrow payments</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Direct messaging and coordination</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

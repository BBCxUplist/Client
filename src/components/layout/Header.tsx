import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, User, Menu, X, MessageCircle } from "lucide-react";
import { useAuth, useCurrentUser } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { isAuthenticated } = useAuth();
  const currentUser = useCurrentUser();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Beautiful Header */}
      <motion.div
        className={
          "p-2 sm:p-4 sticky top-0 z-20 w-full transition-all duration-300"
        }
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className={`border bg-white border-neutral-200 shadow-sm inset-shadow-sm shadow-orange-500/5 mx-auto rounded-2xl sm:rounded-3xl flex justify-between items-center transition-all duration-300 ${
            isScrolled ? "max-w-4xl p-1.5 sm:p-2" : "max-w-6xl p-2 sm:p-3"
          }`}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`bg-black aspect-square transition-all duration-300 ${
                isScrolled
                  ? "p-0.5 rounded-full"
                  : "p-0.5 sm:p-1 rounded-xl sm:rounded-2xl"
              }`}
            >
              <img
                src="/logo/logo.png"
                alt="uplist"
                className={`transition-all duration-300 ${
                  isScrolled
                    ? "w-6 sm:w-8 h-6 sm:h-8"
                    : "w-7 sm:w-10 h-7 sm:h-10"
                }`}
              />
            </div>
            <p
              className={`font-bold font-dm-sans transition-all duration-300 ${
                isScrolled ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
              }`}
            >
              Uplist
            </p>
          </div>

          {/* Navigation Items - Centered */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              to="/explore"
              className={cn(
                "font-semibold text-sm transition-colors",
                location.pathname === "/explore"
                  ? "text-orange-500"
                  : "text-neutral-600 hover:text-orange-500"
              )}
            >
              Explore
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/chat"
                  className={cn(
                    "font-medium text-sm transition-colors flex items-center gap-1",
                    location.pathname === "/chat"
                      ? "text-orange-500"
                      : "text-neutral-600 hover:text-orange-500"
                  )}
                >
                  <MessageCircle className="h-4 w-4" />
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className={cn(
                    "font-medium text-sm transition-colors flex items-center gap-1",
                    location.pathname === "/profile"
                      ? "text-orange-500"
                      : "text-neutral-600 hover:text-orange-500"
                  )}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <img
                  src={
                    currentUser?.avatar ||
                    `https://ui-avatars.com/api/?name=${currentUser?.name}&size=32&background=random`
                  }
                  alt={currentUser?.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium text-neutral-700">
                  {currentUser?.name}
                </span>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-2xl text-neutral-600 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden fixed top-20 left-4 right-4 z-10 bg-white border-2 border-neutral-200 rounded-2xl shadow-lg"
        >
          <div className="p-4 space-y-2">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-xl text-base font-medium transition-all duration-200",
                location.pathname === "/explore"
                  ? "bg-orange-50 text-orange-500"
                  : "text-neutral-600 hover:text-orange-500 hover:bg-orange-50"
              )}
            >
              <Search className="h-5 w-5" />
              <span>Explore</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-xl text-base font-medium transition-all duration-200",
                    location.pathname === "/chat"
                      ? "bg-orange-50 text-orange-500"
                      : "text-neutral-600 hover:text-orange-500 hover:bg-orange-50"
                  )}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Messages</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-xl text-base font-medium transition-all duration-200",
                    location.pathname === "/profile"
                      ? "bg-orange-50 text-orange-500"
                      : "text-neutral-600 hover:text-orange-500 hover:bg-orange-50"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

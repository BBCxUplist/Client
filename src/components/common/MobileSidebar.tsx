import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFeaturedArtistsClick: () => void;
}

export const MobileSidebar = ({
  isOpen,
  onClose,
  onFeaturedArtistsClick,
}: MobileSidebarProps) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/explore");
    onClose();
  };

  const handleSignInClick = () => {
    navigate("/login");
    onClose();
  };

  const handleFeaturedArtistsClick = () => {
    onFeaturedArtistsClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-neutral-50 to-neutral-100 shadow-2xl z-50 md:hidden border-l border-neutral-200"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="bg-black p-1 rounded-xl">
                    <img
                      src="/logo/logo.png"
                      alt="uplist"
                      className="w-8 h-8"
                    />
                  </div>
                  <h2 className="text-xl font-bold font-dm-sans text-neutral-800">
                    Menu
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-neutral-200 transition-colors duration-200 group"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6 text-neutral-600 group-hover:text-neutral-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-4 flex-1">
                <motion.button
                  className="w-full text-left text-lg font-semibold text-neutral-700 hover:text-orange-600 hover:bg-white hover:shadow-md rounded-2xl transition-all duration-200 group border border-transparent hover:border-orange-100"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  onClick={handleExploreClick}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Explore</p>
                      <p className="text-sm text-neutral-500 group-hover:text-neutral-600">
                        Discover amazing artists
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  className="w-full text-left text-lg font-semibold text-neutral-700 hover:text-orange-600 hover:bg-white hover:shadow-md rounded-2xl transition-all duration-200 group border border-transparent hover:border-orange-100"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  onClick={handleFeaturedArtistsClick}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Featured Artists</p>
                      <p className="text-sm text-neutral-500 group-hover:text-neutral-600">
                        View top performers
                      </p>
                    </div>
                  </div>
                </motion.button>
              </nav>

              {/* Bottom CTA */}
              <motion.div
                className="mt-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
                  <h3 className="font-bold text-lg mb-2">
                    Ready to get started?
                  </h3>
                  <p className="text-orange-100 text-sm mb-4">
                    Join thousands of satisfied customers
                  </p>
                  <button
                    onClick={handleSignInClick}
                    className="w-full bg-white text-orange-600 font-bold py-2 px-4 rounded-xl hover:bg-orange-50 transition-colors duration-200"
                  >
                    Sign In Now
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

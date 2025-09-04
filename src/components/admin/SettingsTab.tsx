import { motion } from "framer-motion";

const SettingsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-mondwest text-3xl lg:text-4xl font-bold text-white mb-8">
        Platform Settings
      </h2>

      <div className="space-y-8">
        {/* Featured Artists */}
        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 font-mondwest">
            Featured Artists
          </h3>
          <p className="text-white/70 mb-4">
            Manage artists displayed on the homepage
          </p>
          <button className="bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors">
            MANAGE FEATURED ARTISTS
          </button>
        </div>

        {/* FAQ Management */}
        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 font-mondwest">
            FAQ Management
          </h3>
          <p className="text-white/70 mb-4">
            Edit frequently asked questions and answers
          </p>
          <button className="bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors">
            EDIT FAQ
          </button>
        </div>

        {/* Platform Configuration */}
        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 font-mondwest">
            Platform Configuration
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">
                Allow new artist registrations
              </span>
              <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Maintenance mode</span>
              <button className="w-12 h-6 bg-white/10 relative border border-white/30">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;

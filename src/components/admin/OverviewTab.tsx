import { motion } from "framer-motion";

const OverviewTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-mondwest text-3xl lg:text-4xl font-bold text-white mb-8">
        Platform Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-white/70 text-sm mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-orange-500 font-mondwest">
            ₹8.9L
          </p>
          <p className="text-green-400 text-xs mt-1">
            ↗ +12% this month
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-white/70 text-sm mb-2">Active Artists</h3>
          <p className="text-3xl font-bold text-orange-500 font-mondwest">
            89
          </p>
          <p className="text-green-400 text-xs mt-1">↗ +5 this week</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-white/70 text-sm mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-orange-500 font-mondwest">
            1.2K
          </p>
          <p className="text-green-400 text-xs mt-1">
            ↗ +8% this month
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-white/70 text-sm mb-2">Bookings Today</h3>
          <p className="text-3xl font-bold text-orange-500 font-mondwest">
            23
          </p>
          <p className="text-yellow-400 text-xs mt-1">
            → +2 from yesterday
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 p-6">
        <h3 className="text-xl font-semibold text-white mb-4 font-mondwest">
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-white/5">
            <div className="w-2 h-2 bg-green-500"></div>
            <div>
              <p className="text-white text-sm">
                New artist registration: Priya Singh
              </p>
              <p className="text-white/60 text-xs">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white/5">
            <div className="w-2 h-2 bg-orange-500"></div>
            <div>
              <p className="text-white text-sm">
                Booking confirmed: ₹75,000
              </p>
              <p className="text-white/60 text-xs">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white/5">
            <div className="w-2 h-2 bg-red-500"></div>
            <div>
              <p className="text-white text-sm">
                Report submitted: User behavior
              </p>
              <p className="text-white/60 text-xs">6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;

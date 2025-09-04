import { motion } from "framer-motion";

const OverviewTab = () => {
  // Mock data for demonstration
  const stats = [
    { label: "Total Users", value: "2,847", change: "+12%", changeType: "positive" },
    { label: "Verified Artists", value: "156", change: "+8%", changeType: "positive" },
    { label: "Total Bookings", value: "1,234", change: "+23%", changeType: "positive" },
    { label: "Revenue", value: "$45,678", change: "+18%", changeType: "positive" },
    { label: "Total Commission", value: "$4,567", change: "+15%", changeType: "positive" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Platform Overview</h2>
        <p className="text-white/70">Key metrics and performance indicators</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/60 text-sm">{stat.label}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                stat.changeType === "positive" 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-red-500/20 text-red-400"
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white font-mondwest">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/5 border border-white/10 p-6"
        >
          <h3 className="text-white font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-orange-500/20 border border-orange-500/30 text-orange-400 p-3 text-left hover:bg-orange-500/30 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Verify New Artist</span>
              </div>
            </button>
            <button className="w-full bg-white/5 border border-white/10 text-white/70 p-3 text-left hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Review Reports</span>
              </div>
            </button>
            <button className="w-full bg-white/5 border border-white/10 text-white/70 p-3 text-left hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>Process Refunds</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/5 border border-white/10 p-6"
        >
          <h3 className="text-white font-semibold text-lg mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/80 text-sm">Database: Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/80 text-sm">API: Operational</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/80 text-sm">Payments: Active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/80 text-sm">Commission: Active</span>
            </div>
          </div>
        </motion.div>

        {/* Commission Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/5 border border-white/10 p-6"
        >
          <h3 className="text-white font-semibold text-lg mb-4">Commission Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">This Month</span>
              <span className="text-white font-semibold">$1,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Last Month</span>
              <span className="text-white font-semibold">$987</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Total YTD</span>
              <span className="text-white font-semibold">$4,567</span>
            </div>
            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Commission Rate</span>
                <span className="text-orange-400 font-semibold">10%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;

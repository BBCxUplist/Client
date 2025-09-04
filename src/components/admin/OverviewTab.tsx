import { motion } from "framer-motion";

interface OverviewTabProps {
  dashboardStats: {
    totalArtists: number;
    verifiedArtists: number;
    pendingArtists: number;
    totalRevenue: number;
    averageRating: string;
    featuredArtists: number;
  };
  formatPrice: (price: number) => string;
}

const OverviewTab = ({ dashboardStats, formatPrice }: OverviewTabProps) => {
  // Use real data from dashboard
  const stats = [
    { label: "Total Artists", value: dashboardStats.totalArtists.toString(), change: "+5%", changeType: "positive" as const },
    { label: "Verified Artists", value: dashboardStats.verifiedArtists.toString(), change: "+8%", changeType: "positive" as const },
    { label: "Pending Artists", value: dashboardStats.pendingArtists.toString(), change: "+2%", changeType: "positive" as const },
    { label: "Total Revenue", value: formatPrice(dashboardStats.totalRevenue), change: "+18%", changeType: "positive" as const },
    { label: "Featured Artists", value: dashboardStats.featuredArtists.toString(), change: "+3%", changeType: "positive" as const },
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

      {/* Top Artists by Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/5 border border-white/10 p-6"
      >
        <h3 className="text-white font-semibold text-lg mb-4">Top Artists by Revenue</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black text-sm font-bold">
                D
              </div>
              <div>
                <p className="text-white font-semibold">Divine</p>
                <p className="text-white/60 text-xs">Hip-Hop, Rap</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-orange-400 font-bold">{formatPrice(2500000)}</p>
              <p className="text-white/60 text-xs">₹25L</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black text-sm font-bold">
                R
              </div>
              <div>
                <p className="text-white font-semibold">Raftaar</p>
                <p className="text-white/60 text-xs">Hip-Hop, Producer</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-orange-400 font-bold">{formatPrice(3000000)}</p>
              <p className="text-white/60 text-xs">₹30L</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black text-sm font-bold">
                E
              </div>
              <div>
                <p className="text-white font-semibold">Emiway</p>
                <p className="text-white/60 text-xs">Hip-Hop, Independent</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-orange-400 font-bold">{formatPrice(2000000)}</p>
              <p className="text-white/60 text-xs">₹20L</p>
            </div>
          </div>
        </div>
      </motion.div>

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

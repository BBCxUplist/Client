// pages/ArtistDashboard.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { artists } from "@/constants/artists";

// Dummy dashboard data - in real app, fetch from API based on artist ID
const dummyDashboardData = {
  stats: {
    totalBookings: 45,
    totalEarnings: 2250000,
    averageRating: 4.8,
    responseTime: "2 hours",
    completionRate: 98,
    profileViews: 247,
    bookingRequests: 23,
    conversionRate: 68,
  },
  recentBookings: [
    {
      id: "1",
      eventType: "Wedding Reception",
      clientName: "Priya & Raj",
      date: "2025-01-15",
      amount: 85000,
      status: "confirmed",
      location: "Mumbai",
    },
    {
      id: "2",
      eventType: "Birthday Party",
      clientName: "Sharma Family",
      date: "2025-01-28",
      amount: 45000,
      status: "pending",
      location: "Delhi",
    },
    {
      id: "3",
      eventType: "Corporate Event",
      clientName: "Tech Corp",
      date: "2025-02-05",
      amount: 120000,
      status: "confirmed",
      location: "Bangalore",
    },
    {
      id: "4",
      eventType: "Festival Performance",
      clientName: "Cultural Society",
      date: "2025-02-15",
      amount: 65000,
      status: "pending",
      location: "Pune",
    },
  ],
  monthlyData: [
    { month: "Oct", bookings: 8, earnings: 400000 },
    { month: "Nov", bookings: 12, earnings: 600000 },
    { month: "Dec", bookings: 15, earnings: 750000 },
    { month: "Jan", bookings: 10, earnings: 500000 },
  ],
  upcomingBookings: [
    { date: "2025-01-15", event: "Wedding Reception", location: "Mumbai" },
    { date: "2025-01-28", event: "Birthday Party", location: "Delhi" },
    { date: "2025-02-05", event: "Corporate Event", location: "Bangalore" },
  ],
  notifications: [
    {
      id: 1,
      type: "booking",
      message: "New booking request from Sharma Family",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      type: "payment",
      message: "Payment received for Wedding Reception - ₹85,000",
      time: "1 day ago",
      unread: false,
    },
    {
      id: 3,
      type: "review",
      message: "New 5-star review from Priya & Raj",
      time: "2 days ago",
      unread: false,
    },
  ],
};

const ArtistDashboard = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "analytics" | "settings"
  >("overview");

  // Find artist data (in real app, verify this matches logged-in user)
  const artist = artists.find((a) => a.slug === username);
  const dashboardData = dummyDashboardData;

  if (!artist) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Artist Not Found</h1>
          <p className="text-white/60">Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/40";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  return (
    <div className="w-full p-4 md:p-6 lg:p-8">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="font-mondwest text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
            YOUR DASHBOARD
          </h1>
          <p className="text-white/70 text-lg">Welcome back, {artist.name}</p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
          <Link to={`/artist/${username}`}>
            <button className="bg-white/10 border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/20 transition-colors">
              VIEW PUBLIC PROFILE
            </button>
          </Link>
          <Link to={`/artist/${username}/edit`}>
            <button className="bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors">
              EDIT PROFILE
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-white/70 text-sm mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold text-orange-500 font-mondwest">
            {formatPrice(dashboardData.stats.totalEarnings)}
          </p>
          <p className="text-green-400 text-xs mt-1">↗ +12% this month</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-white/70 text-sm mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-orange-500 font-mondwest">
            {dashboardData.stats.totalBookings}
          </p>
          <p className="text-green-400 text-xs mt-1">↗ +5 this month</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-white/70 text-sm mb-2">Average Rating</h3>
          <p className="text-3xl font-bold text-orange-500 font-mondwest">
            ⭐ {dashboardData.stats.averageRating}
          </p>
          <p className="text-green-400 text-xs mt-1">↗ +0.2 this month</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-white/70 text-sm mb-2">Response Time</h3>
          <p className="text-3xl font-bold text-orange-500 font-mondwest">
            {dashboardData.stats.responseTime}
          </p>
          <p className="text-yellow-400 text-xs mt-1">→ Same as last month</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-4 mb-8 border-b border-dashed border-white pb-4">
        {["overview", "bookings", "analytics", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-sm md:text-base font-semibold transition-all duration-300 border ${
              activeTab === tab
                ? "bg-white text-black border-white"
                : "text-white border-white/30 hover:border-white/60"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Bookings */}
              <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white font-mondwest">
                    Recent Bookings
                  </h3>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="text-orange-500 hover:text-orange-400 text-sm"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-4">
                  {dashboardData.recentBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-white/5 border border-white/10"
                    >
                      <div className="flex-1">
                        <p className="text-white font-semibold">
                          {booking.eventType}
                        </p>
                        <p className="text-white/60 text-sm">
                          {booking.clientName} • {booking.date}
                        </p>
                        <p className="text-white/50 text-xs">
                          {booking.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-orange-500 font-bold font-mondwest">
                          {formatPrice(booking.amount)}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs font-semibold border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions & Notifications */}
              <div className="space-y-6">
                {/* Upcoming Events */}
                <div className="bg-white/5 border border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 font-mondwest">
                    Upcoming Events
                  </h3>
                  <div className="space-y-3">
                    {dashboardData.upcomingBookings
                      .slice(0, 3)
                      .map((booking, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white/5"
                        >
                          <div className="w-2 h-2 bg-orange-500 flex-shrink-0"></div>
                          <div>
                            <p className="text-white text-sm font-semibold">
                              {booking.event}
                            </p>
                            <p className="text-white/60 text-xs">
                              {booking.date} • {booking.location}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/5 border border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 font-mondwest">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Link to={`/artist/${username}/edit`}>
                      <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                        <span className="text-white text-sm">
                          📝 Update Profile
                        </span>
                      </button>
                    </Link>
                    <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                      <span className="text-white text-sm">
                        💰 View Earnings
                      </span>
                    </button>
                    <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                      <span className="text-white text-sm">
                        ⚙️ Account Settings
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Performance Chart Placeholder */}
            <div className="bg-white/5 border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">
                Monthly Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dashboardData.monthlyData.map((month, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white/5 border border-white/10"
                  >
                    <p className="text-white/70 text-sm mb-2">
                      {month.month} 2025
                    </p>
                    <p className="text-2xl font-bold text-orange-500 font-mondwest">
                      {month.bookings}
                    </p>
                    <p className="text-white/60 text-xs">bookings</p>
                    <p className="text-orange-400 text-sm mt-2">
                      {formatPrice(month.earnings)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-2xl font-semibold text-white mb-4 sm:mb-0 font-mondwest">
                All Bookings
              </h3>
              <div className="flex gap-2">
                <select className="bg-white/5 border border-white/20 text-white p-2 text-sm">
                  <option>All Status</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                </select>
                <select className="bg-white/5 border border-white/20 text-white p-2 text-sm">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>All Time</option>
                </select>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-white/70 font-semibold">
                      Event
                    </th>
                    <th className="text-left p-4 text-white/70 font-semibold">
                      Client
                    </th>
                    <th className="text-left p-4 text-white/70 font-semibold">
                      Date
                    </th>
                    <th className="text-left p-4 text-white/70 font-semibold">
                      Location
                    </th>
                    <th className="text-left p-4 text-white/70 font-semibold">
                      Amount
                    </th>
                    <th className="text-left p-4 text-white/70 font-semibold">
                      Status
                    </th>
                    <th className="text-left p-4 text-white/70 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-white/5">
                      <td className="p-4 text-white">{booking.eventType}</td>
                      <td className="p-4 text-white">{booking.clientName}</td>
                      <td className="p-4 text-white">{booking.date}</td>
                      <td className="p-4 text-white/60">{booking.location}</td>
                      <td className="p-4 text-orange-500 font-semibold">
                        {formatPrice(booking.amount)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-orange-500 hover:text-orange-400 text-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-white font-mondwest">
              Performance Analytics
            </h3>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 p-6">
                <h4 className="text-white/70 text-sm mb-2">
                  Profile Views (This Month)
                </h4>
                <p className="text-3xl font-bold text-orange-500 font-mondwest">
                  {dashboardData.stats.profileViews}
                </p>
                <p className="text-green-400 text-xs mt-1">
                  ↗ +18% from last month
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6">
                <h4 className="text-white/70 text-sm mb-2">Booking Requests</h4>
                <p className="text-3xl font-bold text-orange-500 font-mondwest">
                  {dashboardData.stats.bookingRequests}
                </p>
                <p className="text-green-400 text-xs mt-1">
                  ↗ +12% from last month
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6">
                <h4 className="text-white/70 text-sm mb-2">Conversion Rate</h4>
                <p className="text-3xl font-bold text-orange-500 font-mondwest">
                  {dashboardData.stats.conversionRate}%
                </p>
                <p className="text-yellow-400 text-xs mt-1">
                  → Same as last month
                </p>
              </div>
            </div>

            {/* Improvement Tips */}
            <div className="bg-orange-500/10 border border-orange-500/30 p-6">
              <h4 className="text-xl font-semibold text-orange-400 mb-4 font-mondwest">
                Tips to Improve Performance
              </h4>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0"></div>
                  <span>
                    Update your gallery with recent performance photos to
                    attract more bookings
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0"></div>
                  <span>
                    Respond to booking requests within 1 hour to improve your
                    response time
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0"></div>
                  <span>
                    Add more music samples to showcase your versatility
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 mt-2 flex-shrink-0"></div>
                  <span>
                    Keep your availability calendar updated to avoid booking
                    conflicts
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-white font-mondwest">
              Account Settings
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Settings */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h4 className="text-xl font-semibold text-white mb-4 font-mondwest">
                  Profile Settings
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Profile Visibility</span>
                    <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Accept Bookings</span>
                    <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Show Contact Info</span>
                    <button className="w-12 h-6 bg-white/10 relative border border-white/30">
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h4 className="text-xl font-semibold text-white mb-4 font-mondwest">
                  Notifications
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Email Notifications</span>
                    <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">SMS Notifications</span>
                    <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                      <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Push Notifications</span>
                    <button className="w-12 h-6 bg-white/10 relative border border-white/30">
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Management */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h4 className="text-xl font-semibold text-white mb-4 font-mondwest">
                  Account Management
                </h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <span className="text-white text-sm">
                      🔐 Change Password
                    </span>
                  </button>
                  <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <span className="text-white text-sm">
                      💳 Payment Settings
                    </span>
                  </button>
                  <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <span className="text-white text-sm">📄 Download Data</span>
                  </button>
                  <button className="w-full text-left p-3 bg-red-500/20 hover:bg-red-500/30 transition-colors border border-red-500/40">
                    <span className="text-red-400 text-sm">
                      ⚠️ Deactivate Account
                    </span>
                  </button>
                </div>
              </div>

              {/* Help & Support */}
              <div className="bg-white/5 border border-white/10 p-6">
                <h4 className="text-xl font-semibold text-white mb-4 font-mondwest">
                  Help & Support
                </h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <span className="text-white text-sm">📚 Help Center</span>
                  </button>
                  <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <span className="text-white text-sm">
                      💬 Contact Support
                    </span>
                  </button>
                  <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                    <span className="text-white text-sm">
                      📋 Terms of Service
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArtistDashboard;

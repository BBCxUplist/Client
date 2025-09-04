// pages/UserDashboard.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";

// Dummy user dashboard data - in real app, fetch from API based on user ID
const dummyUserData = {
  user: {
    id: "user-123",
    name: "Vikash Gupta",
    email: "vikash@example.com",
    avatar: "/images/user-placeholder.jpg",
    memberSince: "2024-01-20",
    location: "Mumbai, Maharashtra",
  },
  stats: {
    totalBookings: 12,
    totalSpent: 850000,
    averageRating: 4.6,
    savedArtists: 8,
    upcomingEvents: 2,
    completedEvents: 10,
  },
  recentBookings: [
    {
      id: "1",
      artistName: "Rajesh Kumar",
      artistSlug: "rajesh-kumar",
      artistAvatar: "/images/artist-1.jpg",
      eventType: "Wedding Reception",
      date: "2025-01-15",
      amount: 85000,
      status: "confirmed",
      location: "Mumbai",
      rating: null,
    },
    {
      id: "2",
      artistName: "Priya Singh",
      artistSlug: "priya-singh",
      artistAvatar: "/images/artist-2.jpg",
      eventType: "Birthday Party",
      date: "2025-02-20",
      amount: 55000,
      status: "pending",
      location: "Delhi",
      rating: null,
    },
    {
      id: "3",
      artistName: "Amit Sharma",
      artistSlug: "amit-sharma",
      artistAvatar: "/images/artist-3.jpg",
      eventType: "Anniversary Celebration",
      date: "2024-12-15",
      amount: 75000,
      status: "completed",
      location: "Pune",
      rating: 5,
    },
    {
      id: "4",
      artistName: "Neha Patel",
      artistSlug: "neha-patel",
      artistAvatar: "/images/artist-4.jpg",
      eventType: "Corporate Event",
      date: "2024-11-28",
      amount: 120000,
      status: "completed",
      location: "Bangalore",
      rating: 4,
    },
  ],
  savedArtists: [
    {
      id: "1",
      name: "Rajesh Kumar",
      slug: "rajesh-kumar",
      avatar: "/images/artist-1.jpg",
      rating: 4.8,
      price: 75000,
      categories: ["Classical", "Bollywood"],
      isBookable: true,
    },
    {
      id: "2",
      name: "Kavita Krishnamurthy",
      slug: "kavita-krishnamurthy",
      avatar: "/images/artist-2.jpg",
      rating: 4.9,
      price: 150000,
      categories: ["Classical", "Devotional"],
      isBookable: true,
    },
    {
      id: "3",
      name: "Arijit Singh",
      slug: "arijit-singh",
      avatar: "/images/artist-3.jpg",
      rating: 4.7,
      price: 200000,
      categories: ["Bollywood", "Romance"],
      isBookable: false,
    },
  ],
  upcomingEvents: [
    {
      id: "1",
      artistName: "Rajesh Kumar",
      eventType: "Wedding Reception",
      date: "2025-01-15",
      location: "Mumbai",
      amount: 85000,
      status: "confirmed",
    },
    {
      id: "2",
      artistName: "Priya Singh",
      eventType: "Birthday Party",
      date: "2025-02-20",
      location: "Delhi",
      amount: 55000,
      status: "pending",
    },
  ],
  recommendations: [
    {
      id: "1",
      name: "Sunidhi Chauhan",
      slug: "sunidhi-chauhan",
      avatar: "/images/artist-rec-1.jpg",
      rating: 4.8,
      price: 180000,
      categories: ["Bollywood", "Pop"],
      reason: "Based on your previous bookings",
    },
    {
      id: "2",
      name: "Shankar Mahadevan",
      slug: "shankar-mahadevan",
      avatar: "/images/artist-rec-2.jpg",
      rating: 4.9,
      price: 220000,
      categories: ["Classical", "Fusion"],
      reason: "Trending in your area",
    },
  ],
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "saved" | "settings"
  >("overview");

  const userData = dummyUserData;

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
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  const handleLogout = () => {
    // Implement logout logic
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />

      <div className="w-full p-4 md:p-6 lg:p-8">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-6 mb-6 lg:mb-0">
            {/* User Avatar */}
            <div className="relative">
              <img
                src="https://i.pinimg.com/1200x/09/e4/0a/09e40a3f556058ae2f57ba22bce36f12.jpg"
                alt={userData.user.name}
                className="w-20 h-20 lg:w-24 lg:h-24 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/userNotFound.jpeg";
                }}
              />
              <div className="absolute -bottom-2 -right-2 bg-orange-500 text-black px-2 py-1 text-xs font-semibold">
                USER
              </div>
            </div>

            <div>
              <h1 className="font-mondwest text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {userData.user.name}
              </h1>
              <p className="text-white/70 text-lg">{userData.user.location}</p>
              <p className="text-white/50 text-sm">
                Member since {userData.user.memberSince}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/explore">
              <button className="bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors">
                EXPLORE ARTISTS
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/10 border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/20 transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 p-4 md:p-6">
            <h3 className="text-white/70 text-xs md:text-sm mb-2">
              Total Bookings
            </h3>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest">
              {userData.stats.totalBookings}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 md:p-6">
            <h3 className="text-white/70 text-xs md:text-sm mb-2">
              Total Spent
            </h3>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest">
              {formatPrice(userData.stats.totalSpent)}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 md:p-6">
            <h3 className="text-white/70 text-xs md:text-sm mb-2">
              Avg Rating Given
            </h3>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest">
              ⭐ {userData.stats.averageRating}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 md:p-6">
            <h3 className="text-white/70 text-xs md:text-sm mb-2">
              Saved Artists
            </h3>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest">
              {userData.stats.savedArtists}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 md:p-6">
            <h3 className="text-white/70 text-xs md:text-sm mb-2">Upcoming</h3>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest">
              {userData.stats.upcomingEvents}
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 md:p-6">
            <h3 className="text-white/70 text-xs md:text-sm mb-2">Completed</h3>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest">
              {userData.stats.completedEvents}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-dashed border-white pb-4">
          {["overview", "bookings", "saved", "settings"].map((tab) => (
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
                {/* Upcoming Events */}
                <div className="lg:col-span-2">
                  <div className="bg-white/5 border border-white/10 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white font-mondwest">
                        Upcoming Events
                      </h3>
                      <button
                        onClick={() => setActiveTab("bookings")}
                        className="text-orange-500 hover:text-orange-400 text-sm"
                      >
                        View All →
                      </button>
                    </div>
                    {userData.upcomingEvents.length > 0 ? (
                      <div className="space-y-4">
                        {userData.upcomingEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10"
                          >
                            <div>
                              <p className="text-white font-semibold">
                                {event.eventType}
                              </p>
                              <p className="text-white/60 text-sm">
                                {event.artistName} • {event.date}
                              </p>
                              <p className="text-white/50 text-xs">
                                {event.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-orange-500 font-bold font-mondwest">
                                {formatPrice(event.amount)}
                              </p>
                              <span
                                className={`px-2 py-1 text-xs font-semibold border ${getStatusColor(
                                  event.status
                                )}`}
                              >
                                {event.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-white/60 mb-4">No upcoming events</p>
                        <Link to="/explore">
                          <button className="bg-orange-500 text-black px-4 py-2 font-semibold">
                            BOOK AN ARTIST
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Recent Bookings */}
                  <div className="bg-white/5 border border-white/10 p-6">
                    <h3 className="text-xl font-semibold text-white mb-6 font-mondwest">
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {userData.recentBookings.slice(0, 3).map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center gap-4 p-4 bg-white/5 border border-white/10"
                        >
                          <img
                            src={booking.artistAvatar}
                            alt={booking.artistName}
                            className="w-12 h-12 object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/images/artistNotFound.jpeg";
                            }}
                          />
                          <div className="flex-1">
                            <p className="text-white font-semibold">
                              {booking.eventType}
                            </p>
                            <p className="text-white/60 text-sm">
                              {booking.artistName} • {booking.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-2 py-1 text-xs font-semibold border ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status.toUpperCase()}
                            </span>
                            {booking.status === "completed" &&
                              !booking.rating && (
                                <button className="block mt-1 text-orange-500 hover:text-orange-400 text-xs">
                                  Rate Artist
                                </button>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Recommendations */}
                  <div className="bg-white/5 border border-white/10 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 font-mondwest">
                      Recommended Artists
                    </h3>
                    <div className="space-y-4">
                      {userData.recommendations.map((artist) => (
                        <Link
                          key={artist.id}
                          to={`/artist/${artist.slug}`}
                          className="block"
                        >
                          <div className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                            <img
                              src={artist.avatar}
                              alt={artist.name}
                              className="w-10 h-10 object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/images/artistNotFound.jpeg";
                              }}
                            />
                            <div className="flex-1">
                              <p className="text-white text-sm font-semibold">
                                {artist.name}
                              </p>
                              <p className="text-white/60 text-xs">
                                ⭐ {artist.rating} • {formatPrice(artist.price)}
                              </p>
                              <p className="text-orange-400 text-xs">
                                {artist.reason}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/5 border border-white/10 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 font-mondwest">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Link to="/explore">
                        <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                          <span className="text-white text-sm">
                            🔍 Explore Artists
                          </span>
                        </button>
                      </Link>
                      <button
                        onClick={() => setActiveTab("saved")}
                        className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <span className="text-white text-sm">
                          ❤️ Saved Artists
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveTab("bookings")}
                        className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <span className="text-white text-sm">
                          📅 My Bookings
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveTab("settings")}
                        className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <span className="text-white text-sm">
                          ⚙️ Account Settings
                        </span>
                      </button>
                    </div>
                  </div>
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
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                  <select className="bg-white/5 border border-white/20 text-white p-2 text-sm">
                    <option>All Time</option>
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6">
                {userData.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white/5 border border-white/10 p-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Link to={`/artist/${booking.artistSlug}`}>
                          <img
                            src={booking.artistAvatar}
                            alt={booking.artistName}
                            className="w-16 h-16 object-cover hover:opacity-80 transition-opacity"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/images/artistNotFound.jpeg";
                            }}
                          />
                        </Link>
                        <div>
                          <h4 className="text-white font-semibold text-lg">
                            {booking.eventType}
                          </h4>
                          <Link
                            to={`/artist/${booking.artistSlug}`}
                            className="text-orange-500 hover:text-orange-400"
                          >
                            {booking.artistName}
                          </Link>
                          <p className="text-white/60 text-sm">
                            {booking.date} • {booking.location}
                          </p>
                          <p className="text-orange-500 font-bold font-mondwest">
                            {formatPrice(booking.amount)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                        <div className="flex gap-2">
                          {booking.status === "completed" &&
                            !booking.rating && (
                              <button className="bg-orange-500 text-black px-3 py-1 text-xs font-semibold hover:bg-orange-600">
                                RATE ARTIST
                              </button>
                            )}
                          {booking.status === "pending" && (
                            <button className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 text-xs font-semibold hover:bg-red-500/30">
                              CANCEL
                            </button>
                          )}
                          <button className="text-orange-500 hover:text-orange-400 text-xs underline">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Saved Artists Tab */}
          {activeTab === "saved" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-semibold text-white font-mondwest">
                Saved Artists
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.savedArtists.map((artist) => (
                  <div
                    key={artist.id}
                    className="bg-white/5 border border-white/10 p-4"
                  >
                    <Link to={`/artist/${artist.slug}`}>
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-full aspect-square object-cover mb-4 hover:opacity-80 transition-opacity"
                        onError={(e) => {
                          e.currentTarget.src = "/images/artistNotFound.jpeg";
                        }}
                      />
                    </Link>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Link
                          to={`/artist/${artist.slug}`}
                          className="text-white font-semibold text-lg hover:text-orange-500"
                        >
                          {artist.name}
                        </Link>
                        <p className="text-white/60 text-sm">
                          ⭐ {artist.rating}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {artist.categories.map((category, index) => (
                            <span
                              key={index}
                              className="bg-white/10 text-white text-xs px-2 py-1"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="text-red-400 hover:text-red-300 ml-2">
                        ❤️
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-orange-500 font-bold font-mondwest text-sm">
                        {formatPrice(artist.price)}
                      </p>
                      {artist.isBookable ? (
                        <Link to={`/artist/${artist.slug}`}>
                          <button className="bg-orange-500 text-black px-3 py-1 text-xs font-semibold hover:bg-orange-600">
                            BOOK NOW
                          </button>
                        </Link>
                      ) : (
                        <span className="text-white/50 text-xs">
                          UNAVAILABLE
                        </span>
                      )}
                    </div>
                  </div>
                ))}
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
                {/* Profile Information */}
                <div className="bg-white/5 border border-white/10 p-6">
                  <h4 className="text-xl font-semibold text-white mb-4 font-mondwest">
                    Profile Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userData.user.name}
                        className="w-full bg-white/5 border border-white/20 text-white p-3"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={userData.user.email}
                        className="w-full bg-white/5 border border-white/20 text-white p-3"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={userData.user.location}
                        className="w-full bg-white/5 border border-white/20 text-white p-3"
                      />
                    </div>
                    <button className="bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600">
                      UPDATE PROFILE
                    </button>
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
                      <span className="text-white">Booking Reminders</span>
                      <button className="w-12 h-6 bg-orange-500 relative border border-orange-500">
                        <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Artist Recommendations</span>
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
                        💳 Payment Methods
                      </span>
                    </button>
                    <button className="w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                      <span className="text-white text-sm">
                        📄 Download Data
                      </span>
                    </button>
                    <button className="w-full text-left p-3 bg-red-500/20 hover:bg-red-500/30 transition-colors border border-red-500/40">
                      <span className="text-red-400 text-sm">
                        ⚠️ Delete Account
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
                        ⭐ Rate the App
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

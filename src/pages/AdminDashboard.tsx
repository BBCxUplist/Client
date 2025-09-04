// pages/AdminDashboard.tsx
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import OverviewTab from "@/components/admin/OverviewTab";
import ArtistsTab from "@/components/admin/ArtistsTab";
import UsersTab from "@/components/admin/UsersTab";
import ReportsTab from "@/components/admin/ReportsTab";
import RecentActivityTab from "@/components/admin/RecentActivityTab";
import SettingsTab from "@/components/admin/SettingsTab";
import { artists } from "@/constants/artists";

interface Artist {
  id: string;
  name: string;
  email: string;
  status: "verified" | "appeal" | "rejected" | "suspended";
  joinDate: string;
  bookings: number;
  revenue: number;
  rating: number;
  slug: string;
  avatar: string | undefined;
  bio: string | undefined;
  price: number;
  tags: string[];
  categories: string[];
  isBookable: boolean;
  appealStatus: string;
  featured: boolean;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "banned";
  joinDate: string;
  bookings: number;
  totalSpent: number;
}



interface Report {
  id: string;
  type: "content" | "user" | "artist";
  reportedBy: string;
  reportedItem: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  priority: "low" | "medium" | "high";
  createdAt: string;
}

// Transform artists data to match admin interface
const adminArtists: Artist[] = artists.map((artist) => ({
  id: artist.id,
  name: artist.name,
  email: `${artist.slug}@example.com`, // Generate email from slug
  status: artist.appealStatus === "approved" ? "verified" : 
          artist.appealStatus === "pending" ? "appeal" : 
          artist.appealStatus === "rejected" ? "rejected" : "suspended",
  joinDate: artist.createdAt.split('T')[0], // Extract date from ISO string
  bookings: Math.floor(Math.random() * 50) + 10, // Random bookings for demo
  revenue: artist.price * (Math.floor(Math.random() * 20) + 5), // Random revenue based on price
  rating: artist.rating,
  slug: artist.slug,
  avatar: artist.avatar,
  bio: artist.bio,
  price: artist.price,
  tags: artist.tags,
  categories: artist.categories,
  isBookable: artist.isBookable,
  appealStatus: artist.appealStatus,
  featured: artist.featured || false,
  createdAt: artist.createdAt,
}));

const dummyUsers: User[] = [
  {
    id: "1",
    name: "Vikash Gupta",
    email: "vikash@example.com",
    status: "active",
    joinDate: "2024-01-20",
    bookings: 8,
    totalSpent: 240000,
  },
  {
    id: "2",
    name: "Sunita Rao",
    email: "sunita@example.com",
    status: "active",
    joinDate: "2024-02-15",
    bookings: 5,
    totalSpent: 150000,
  },
  {
    id: "3",
    name: "Rahul Verma",
    email: "rahul@example.com",
    status: "suspended",
    joinDate: "2024-03-01",
    bookings: 2,
    totalSpent: 60000,
  },
];



const dummyReports: Report[] = [
  {
    id: "1",
    type: "user",
    reportedBy: "Rajesh Kumar",
    reportedItem: "Rahul Verma",
    reason: "Inappropriate behavior during event",
    status: "pending",
    priority: "high",
    createdAt: "2024-12-20",
  },
  {
    id: "2",
    type: "content",
    reportedBy: "User123",
    reportedItem: "Artist Profile Content",
    reason: "Misleading information",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-12-18",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "artists" | "users" | "reports" | "recent-activity" | "settings"
  >("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate dashboard statistics from real artist data
  const dashboardStats = useMemo(() => {
    const totalArtists = adminArtists.length;
    const verifiedArtists = adminArtists.filter(a => a.status === "verified").length;
    const pendingArtists = adminArtists.filter(a => a.status === "appeal").length;
    const totalRevenue = adminArtists.reduce((sum, a) => sum + a.revenue, 0);
    const averageRating = adminArtists.reduce((sum, a) => sum + a.rating, 0) / totalArtists;
    const featuredArtists = adminArtists.filter(a => a.featured).length;
    
    return {
      totalArtists,
      verifiedArtists,
      pendingArtists,
      totalRevenue,
      averageRating: averageRating.toFixed(1),
      featuredArtists
    };
  }, []);

  // Filtering logic
  const filteredArtists = useMemo(() => {
    return adminArtists.filter((artist) => {
      const matchesSearch =
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || artist.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const filteredUsers = useMemo(() => {
    return dummyUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || user.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);



  const handleStatusChange = (
    id: string,
    newStatus: string,
    type: "artist" | "user"
  ) => {
    console.log(`Changing ${type} ${id} status to ${newStatus}`);
    // Implement status change logic here
  };

  const handleLogout = () => {
    // Implement logout logic
    navigate("/admin");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-black/50 border-b border-dashed border-white/20 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="relative">
              <p className="font-mondwest text-xl lg:text-2xl font-bold text-white py-2 px-4 border border-white/20">
                UPLIST
              </p>
              <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-orange-500"></span>
              <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-orange-500"></span>
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-orange-500"></span>
              <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-orange-500"></span>
            </Link>
                      <div className="hidden lg:block">
            <h1 className="font-mondwest text-xl font-bold text-white">
              ADMIN DASHBOARD
            </h1>
            <p className="text-white/60 text-sm">
              Administrative Control Panel
            </p>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-white/80">
                Artists: {dashboardStats.totalArtists} | 
                Verified: {dashboardStats.verifiedArtists} | 
                Pending: {dashboardStats.pendingArtists}
              </span>
              <span className="text-orange-400">
                Total Revenue: {formatPrice(dashboardStats.totalRevenue)}
              </span>
            </div>
          </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-2 hover:bg-red-500/30 transition-colors text-sm font-semibold"
          >
            LOGOUT
          </button>
        </div>
      </div>  

      <div className="flex flex-col lg:flex-row min-h-full flex-1">
        {/* Mobile Menu Button */}
        <div className="lg:hidden bg-neutral-900 border-b border-dashed border-white/20 p-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-between w-full p-3 bg-white/5 border border-white/20"
          >
            <div className="flex items-center gap-3">
              <img 
                src={[
                  { id: "overview", icon: "/icons/overview.png" },
                  { id: "artists", icon: "/icons/artist.png" },
                  { id: "users", icon: "/icons/users.png" },
                  { id: "bookings", icon: "/icons/calendar.png" },
                  { id: "reports", icon: "/icons/report.png" },
                  { id: "settings", icon: "/icons/settings.png" },
                ].find(tab => tab.id === activeTab)?.icon} 
                alt="Active tab" 
                className="w-6 h-6 invert" 
              /> 
              <span className="text-white font-semibold">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "artists", label: "Artists" },
                  { id: "users", label: "Users" },
                  { id: "bookings", label: "Bookings" },
                  { id: "reports", label: "Reports" },
                  { id: "settings", label: "Settings" },
                ].find(tab => tab.id === activeTab)?.label}
              </span>
            </div>
            <img src="/icons/angleDown.png" alt="arrowDown" className={`w-5 h-5 transition-transform duration-300 invert ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden bg-neutral-900 border-b border-dashed border-white/20 transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
            <nav className="p-4 space-y-2">
              {[
                { id: "overview", label: "Overview", icon: "/icons/overview.png" },
                { id: "artists", label: "Artists", icon: "/icons/artist.png" },
                { id: "users", label: "Users", icon: "/icons/users.png" },
                { id: "reports", label: "Reports", icon: "/icons/report.png" },
                { id: "recent-activity", label: "Recent Activity", icon: "/icons/overview.png" },
                { id: "settings", label: "Settings", icon: "/icons/settings.png" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as "overview" | "artists" | "users" | "reports" | "recent-activity" | "settings");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left p-3 font-semibold transition-all duration-300 flex items-center gap-3  ${
                    activeTab === tab.id
                      ? "bg-orange-500 text-black"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <img 
                    src={tab.icon} 
                    alt={tab.label} 
                    className={`w-6 h-6 ${activeTab === tab.id ? "" : "invert"}`} 
                  />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64 bg-neutral-900 border-r border-dashed border-white/20 p-4">
          <nav className="space-y-2">
            {[
              { id: "overview", label: "Overview", icon: "/icons/overview.png" },
              { id: "artists", label: "Artists", icon: "/icons/artist.png" },
              { id: "users", label: "Users", icon: "/icons/users.png" },
              { id: "reports", label: "Reports", icon: "/icons/report.png" },
              { id: "recent-activity", label: "Recent Activity", icon: "/icons/overview.png" },
              { id: "settings", label: "Settings", icon: "/icons/settings.png" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "artists" | "users" | "reports" | "recent-activity" | "settings")}
                className={`w-full text-left p-3 font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-black"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <img src={tab.icon} alt={tab.label} className={`w-7 h-7 ${activeTab === tab.id ? "" : "invert"}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && <OverviewTab dashboardStats={dashboardStats} formatPrice={formatPrice} />}

          {/* Artists Tab */}
          {activeTab === "artists" && (
            <ArtistsTab
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              filteredArtists={filteredArtists}
              onSearchChange={setSearchTerm}
              onFilterChange={setFilterStatus}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <UsersTab
              searchTerm={searchTerm}
              filteredUsers={filteredUsers}
              onSearchChange={setSearchTerm}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* Recent Activity Tab */}
          {activeTab === "recent-activity" && <RecentActivityTab />}

          {/* Reports Tab */}
          {activeTab === "reports" && <ReportsTab dummyReports={dummyReports} />}

          {/* Settings Tab */}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

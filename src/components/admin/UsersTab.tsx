import { motion } from "framer-motion";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended" | "banned";
  joinDate: string;
  bookings: number;
  totalSpent: number;
}

interface UsersTabProps {
  searchTerm: string;
  filteredUsers: User[];
  onSearchChange: (value: string) => void;
  onStatusChange: (id: string, newStatus: string, type: "artist" | "user") => void;
}

const UsersTab = ({
  searchTerm,
  filteredUsers,
  onSearchChange,
  onStatusChange,
}: UsersTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/20";
      case "suspended":
        return "text-yellow-400 bg-yellow-500/20";
      case "banned":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-white/60 bg-white/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "suspended":
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "banned":
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">User Management</h2>
        <p className="text-white/70">Manage user accounts and permissions</p>
      </div>

      {/* Search */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
        <div>
          <label className="block text-white/70 text-sm mb-2">Search Users</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Users Count */}
      <div className="flex items-center justify-between">
        <p className="text-white/70">
          Showing {filteredUsers.length} users
        </p>
        <div className="flex gap-2">
          <button className="bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded text-sm hover:bg-green-500/30 transition-colors">
            Bulk Activate
          </button>
          <button className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-3 py-1 rounded text-sm hover:bg-yellow-500/30 transition-colors">
            Export Users
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 p-4 rounded-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(user.status)}
                <div>
                  <h4 className="text-white font-semibold">{user.name}</h4>
                  <p className="text-white/60 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
              <div>
                <span className="text-white/70">Join Date: </span>
                <span className="text-white">{new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-white/70">Bookings: </span>
                <span className="text-white">{user.bookings}</span>
              </div>
              <div>
                <span className="text-white/70">Total Spent: </span>
                <span className="text-white">{formatCurrency(user.totalSpent)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded hover:bg-white/20 transition-colors text-sm">
                  View Profile
                </button>
                <button className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded hover:bg-white/20 transition-colors text-sm">
                  View History
                </button>
              </div>
              <div className="flex gap-2">
                {user.status === "suspended" && (
                  <button
                    onClick={() => onStatusChange(user.id, "active", "user")}
                    className="bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded hover:bg-green-500/30 transition-colors text-sm"
                  >
                    Reactivate
                  </button>
                )}
                {user.status === "active" && (
                  <>
                    <button
                      onClick={() => onStatusChange(user.id, "suspended", "user")}
                      className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-3 py-1 rounded hover:bg-yellow-500/30 transition-colors text-sm"
                    >
                      Suspend
                    </button>
                    <button
                      onClick={() => onStatusChange(user.id, "banned", "user")}
                      className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors text-sm"
                    >
                      Ban
                    </button>
                  </>
                )}
                {user.status === "banned" && (
                  <button
                    onClick={() => onStatusChange(user.id, "active", "user")}
                    className="bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded hover:bg-green-500/30 transition-colors text-sm"
                  >
                    Unban
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/60 text-lg">No users found matching your criteria</p>
          <button
            onClick={() => onSearchChange("")}
            className="text-orange-400 hover:text-orange-300 mt-2"
          >
            Clear search
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default UsersTab;

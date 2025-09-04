import { motion } from "framer-motion";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
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
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <h2 className="font-mondwest text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-0">
          Users Management
        </h2>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors"
        />
      </div>

      <div className="bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="text-left p-4 text-white/70 font-semibold">
                User
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                Status
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                Bookings
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                Total Spent
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-white/5">
                <td className="p-4">
                  <div>
                    <p className="text-white font-semibold">
                      {user.name}
                    </p>
                    <p className="text-white/60 text-sm">
                      {user.email}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold ${
                      user.status === "active"
                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                        : user.status === "suspended"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                        : "bg-red-500/20 text-red-400 border border-red-500/40"
                    }`}
                  >
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-white">{user.bookings}</td>
                <td className="p-4 text-white">
                  {formatCurrency(user.totalSpent)}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {user.status === "active" && (
                      <button
                        onClick={() =>
                          onStatusChange(
                            user.id,
                            "suspended",
                            "user"
                          )
                        }
                        className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-3 py-1 text-xs hover:bg-yellow-500/30 transition-colors"
                      >
                        SUSPEND
                      </button>
                    )}
                    {user.status === "suspended" && (
                      <button
                        onClick={() =>
                          onStatusChange(user.id, "active", "user")
                        }
                        className="bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 text-xs hover:bg-green-500/30 transition-colors"
                      >
                        REACTIVATE
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersTab;

import { motion } from "framer-motion";

interface Artist {
  id: string;
  name: string;
  email: string;
  status: string;
  bookings: number;
  revenue: number;
  rating: number;
}

interface ArtistsTabProps {
  searchTerm: string;
  filterStatus: string;
  filteredArtists: Artist[];
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onStatusChange: (id: string, newStatus: string, type: "artist" | "user") => void;
}

const ArtistsTab = ({
  searchTerm,
  filterStatus,
  filteredArtists,
  onSearchChange,
  onFilterChange,
  onStatusChange,
}: ArtistsTabProps) => {
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
          Artists Management
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-white/5 border border-white/20 text-white placeholder:text-white/50 p-3 focus:border-orange-500 focus:outline-none transition-colors"
          />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="bg-white/5 border border-white/20 text-white p-3 focus:border-orange-500 focus:outline-none transition-colors"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Artists Table */}
      <div className="bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="text-left p-4 text-white/70 font-semibold">
                Artist
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                Status
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                Bookings
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                Revenue
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                Rating
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredArtists.map((artist) => (
              <tr key={artist.id} className="border-b border-white/5">
                <td className="p-4">
                  <div>
                    <p className="text-white font-semibold">
                      {artist.name}
                    </p>
                    <p className="text-white/60 text-sm">
                      {artist.email}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold ${
                      artist.status === "verified"
                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                        : artist.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                        : artist.status === "suspended"
                        ? "bg-red-500/20 text-red-400 border border-red-500/40"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/40"
                    }`}
                  >
                    {artist.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-white">{artist.bookings}</td>
                <td className="p-4 text-white">
                  {formatCurrency(artist.revenue)}
                </td>
                <td className="p-4 text-white">
                  ⭐ {artist.rating.toFixed(1)}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {artist.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            onStatusChange(
                              artist.id,
                              "verified",
                              "artist"
                            )
                          }
                          className="bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 text-xs hover:bg-green-500/30 transition-colors"
                        >
                          APPROVE
                        </button>
                        <button
                          onClick={() =>
                            onStatusChange(
                              artist.id,
                              "rejected",
                              "artist"
                            )
                          }
                          className="bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 text-xs hover:bg-red-500/30 transition-colors"
                        >
                          REJECT
                        </button>
                      </>
                    )}
                    {artist.status === "verified" && (
                      <button
                        onClick={() =>
                          onStatusChange(
                            artist.id,
                            "suspended",
                            "artist"
                          )
                        }
                        className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-3 py-1 text-xs hover:bg-yellow-500/30 transition-colors"
                      >
                        SUSPEND
                      </button>
                    )}
                    {artist.status === "suspended" && (
                      <button
                        onClick={() =>
                          onStatusChange(
                            artist.id,
                            "verified",
                            "artist"
                          )
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

export default ArtistsTab;

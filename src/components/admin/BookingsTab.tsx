import { motion } from "framer-motion";

interface Booking {
  id: string;
  artistName: string;
  userName: string;
  eventDate: string;
  amount: number;
  status: string;
}

interface BookingsTabProps {
  dummyBookings: Booking[];
}

const BookingsTab = ({ dummyBookings }: BookingsTabProps) => {
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
      <h2 className="font-mondwest text-3xl lg:text-4xl font-bold text-white mb-8">
        Bookings Management
      </h2>

      <div className="bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="text-left p-4 text-white/70 font-semibold">
                Booking ID
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                Artist
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                User
              </th>
              <th className="text-left p-4 text-white/70 font-semibold">
                Event Date
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
            {dummyBookings.map((booking) => (
              <tr key={booking.id} className="border-b border-white/5">
                <td className="p-4 text-white font-mono">
                  #{booking.id}
                </td>
                <td className="p-4 text-white">{booking.artistName}</td>
                <td className="p-4 text-white">{booking.userName}</td>
                <td className="p-4 text-white">{booking.eventDate}</td>
                <td className="p-4 text-white">
                  {formatCurrency(booking.amount)}
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold ${
                      booking.status === "confirmed"
                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                        : booking.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                        : booking.status === "disputed"
                        ? "bg-red-500/20 text-red-400 border border-red-500/40"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/40"
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {booking.status === "disputed" && (
                    <button className="bg-orange-500/20 border border-orange-500/40 text-orange-400 px-3 py-1 text-xs hover:bg-orange-500/30 transition-colors">
                      RESOLVE
                    </button>
                  )}
                  {booking.status === "pending" && (
                    <button className="bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 text-xs hover:bg-green-500/30 transition-colors">
                      APPROVE
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BookingsTab;

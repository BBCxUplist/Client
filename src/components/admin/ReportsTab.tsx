import { motion } from "framer-motion";

interface Report {
  id: string;
  type: string;
  status: string;
  reportedItem: string;
  reportedBy: string;
  reason: string;
  createdAt: string;
}

interface ReportsTabProps {
  dummyReports: Report[];
}

const ReportsTab = ({ dummyReports }: ReportsTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-mondwest text-3xl lg:text-4xl font-bold text-white mb-8">
        Reports & Moderation
      </h2>

      <div className="bg-white/5 border border-white/10">
        {dummyReports.map((report) => (
          <div
            key={report.id}
            className="p-6 border-b border-white/5 last:border-b-0"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold ${
                      report.type === "user"
                        ? "bg-red-500/20 text-red-400"
                        : report.type === "content"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {report.type.toUpperCase()}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold ${
                      report.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : report.status === "resolved"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-white font-semibold">
                  Reported: {report.reportedItem}
                </p>
                <p className="text-white/70 text-sm">
                  By: {report.reportedBy}
                </p>
                <p className="text-white/60 text-sm">
                  Reason: {report.reason}
                </p>
                <p className="text-white/40 text-xs">
                  {report.createdAt}
                </p>
              </div>
              {report.status === "pending" && (
                <div className="flex gap-2">
                  <button className="bg-green-500/20 border border-green-500/40 text-green-400 px-4 py-2 text-sm hover:bg-green-500/30 transition-colors">
                    RESOLVE
                  </button>
                  <button className="bg-gray-500/20 border border-gray-500/40 text-gray-400 px-4 py-2 text-sm hover:bg-gray-500/30 transition-colors">
                    DISMISS
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReportsTab;

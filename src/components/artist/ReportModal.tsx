import React from 'react';
import { motion } from 'framer-motion';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  reportReason: string;
  reportDetails: string;
  onReasonChange: (reason: string) => void;
  onDetailsChange: (details: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reportReason,
  reportDetails,
  onReasonChange,
  onDetailsChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border-2 border-neutral-200 rounded-2xl sm:rounded-3xl shadow-md p-4 sm:p-6 max-w-md w-full"
      >
        <h3 className="text-base sm:text-lg font-bold text-neutral-800 mb-3 sm:mb-4">Report Artist</h3>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-2">
              Reason
            </label>
            <select
              value={reportReason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-neutral-200 rounded-xl sm:rounded-2xl bg-white text-neutral-800 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-sm sm:text-base"
            >
              <option value="">Select a reason</option>
              <option value="inappropriate">Inappropriate behavior</option>
              <option value="spam">Spam</option>
              <option value="harassment">Harassment</option>
              <option value="fake">Fake profile</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-2">
              Details
            </label>
            <textarea
              value={reportDetails}
              onChange={(e) => onDetailsChange(e.target.value)}
              rows={3}
              placeholder="Please provide additional details..."
              className="w-full px-3 py-2 border-2 border-neutral-200 rounded-xl sm:rounded-2xl bg-white text-neutral-800 placeholder:text-neutral-600 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-sm sm:text-base"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 border border-input bg-background text-neutral-800 rounded-xl sm:rounded-2xl font-medium hover:bg-accent hover:text-accent-foreground transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!reportReason}
              className="flex-1 px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-xl sm:rounded-2xl font-semibold hover:bg-orange-600 shadow-lg hover:shadow-xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Submit Report
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

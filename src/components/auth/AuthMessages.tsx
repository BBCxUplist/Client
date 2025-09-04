import { motion } from "framer-motion";

interface AuthMessagesProps {
  error: string;
  successMessage: string;
}

const AuthMessages = ({ error, successMessage }: AuthMessagesProps) => {
  return (
    <>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
        >
          {successMessage}
        </motion.div>
      )}
    </>
  );
};

export default AuthMessages;

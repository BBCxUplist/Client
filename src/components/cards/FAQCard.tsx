import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQCardProps {
  question: string;
  answer: string;
  category: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQCard = ({
  question,
  answer,
  category,
  isOpen,
  onToggle,
}: FAQCardProps) => {
  return (
    <motion.div
      className=""
      initial={false}
      animate={{ height: isOpen ? "auto" : "auto" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 text-left flex justify-between items-center "
      >
        <div className="flex-1">
          <h3 className=" font-medium font-dm-sans text-neutral-800">
            {question}
          </h3>
          <span className="inline-block mt-1 text-orange-600 text-xs font-medium rounded-full">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>
        <motion.div
          className="ml-4"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-orange-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 ">
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="text-neutral-600 text-sm leading-relaxed"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQCard;

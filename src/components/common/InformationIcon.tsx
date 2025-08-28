import { motion } from "framer-motion";
import { Info, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InformationIconProps {
  text: string;
  icon?: "info" | "help";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const InformationIcon = ({
  text,
  icon = "info",
  className,
  size = "md",
}: InformationIconProps) => {
  const IconComponent = icon === "info" ? Info : HelpCircle;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className="relative group">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="inline-flex"
      >
        <IconComponent
          className={cn(
            "text-muted-foreground cursor-help transition-colors hover:text-foreground",
            sizeClasses[size],
            className
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        whileHover={{ opacity: 1, scale: 1, y: 0 }}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg border pointer-events-none z-50 max-w-xs whitespace-normal"
        style={{ width: "max-content", maxWidth: "200px" }}
      >
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
      </motion.div>
    </div>
  );
};

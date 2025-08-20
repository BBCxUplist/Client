import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="mb-4"
        >
          <Icon className="h-12 w-12 text-muted-foreground" />
        </motion.div>
      )}
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>
      
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground mb-6 max-w-sm"
        >
          {description}
        </motion.p>
      )}
      
      {action && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className={cn(
            'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
            {
              'bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2': action.variant === 'default' || !action.variant,
              'border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2': action.variant === 'outline',
              'bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2': action.variant === 'secondary',
              'hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2': action.variant === 'ghost',
              'text-primary underline-offset-4 hover:underline h-10 px-4 py-2': action.variant === 'link',
              'bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2': action.variant === 'destructive',
            }
          )}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

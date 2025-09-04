import { motion } from 'framer-motion';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

const Toggle = ({ enabled, onChange, label }: ToggleProps) => {
  return (
    <div className='flex items-center justify-between'>
      {label && <span className='text-white'>{label}</span>}
      <button
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 relative border transition-colors duration-200 ${
          enabled
            ? 'bg-orange-500 border-orange-500'
            : 'bg-white/10 border-white/30'
        }`}
      >
        <motion.div
          className='absolute top-0.5 w-5 h-5 bg-white'
          animate={{
            x: enabled ? 24 : 2,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      </button>
    </div>
  );
};

export default Toggle;

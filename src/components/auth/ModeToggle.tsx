import type { AuthMode } from './types';

interface ModeToggleProps {
  activeMode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  className?: string;
}

const ModeToggle = ({
  activeMode,
  onModeChange,
  className = '',
}: ModeToggleProps) => {
  return (
    <div className={`bg-white/5 p-1 mb-8 border border-white/10 ${className}`}>
      <div className='grid grid-cols-2 gap-0'>
        <button
          onClick={() => onModeChange('signin')}
          className={`py-3 text-sm md:text-base font-semibold transition-all duration-300 ${
            activeMode === 'signin'
              ? 'bg-white text-black'
              : 'text-white hover:bg-white/10'
          }`}
        >
          SIGN IN
        </button>
        <button
          onClick={() => onModeChange('register')}
          className={`py-3 text-sm md:text-base font-semibold transition-all duration-300 ${
            activeMode === 'register'
              ? 'bg-white text-black'
              : 'text-white hover:bg-white/10'
          }`}
        >
          REGISTER
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;

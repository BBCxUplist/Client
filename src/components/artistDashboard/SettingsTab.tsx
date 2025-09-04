import { motion } from 'framer-motion';
import Toggle from '@/components/ui/Toggle';

interface SettingsTabProps {
  profileVisibility: boolean;
  setProfileVisibility: (value: boolean) => void;
  acceptBookings: boolean;
  setAcceptBookings: (value: boolean) => void;
  showContact: boolean;
  setShowContact: (value: boolean) => void;
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  smsNotifications: boolean;
  setSmsNotifications: (value: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
}

const SettingsTab = ({
  profileVisibility,
  setProfileVisibility,
  acceptBookings,
  setAcceptBookings,
  showContact,
  setShowContact,
  emailNotifications,
  setEmailNotifications,
  smsNotifications,
  setSmsNotifications,
  pushNotifications,
  setPushNotifications,
}: SettingsTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-8'
    >
      <h3 className='text-2xl font-semibold text-white font-mondwest'>
        Account Settings
      </h3>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Profile Settings */}
        <div className='bg-white/5 border border-white/10 p-6'>
          <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
            Profile Settings
          </h4>
          <div className='space-y-4'>
            <Toggle
              enabled={profileVisibility}
              onChange={setProfileVisibility}
              label='Profile Visibility'
            />
            <Toggle
              enabled={acceptBookings}
              onChange={setAcceptBookings}
              label='Accept Bookings'
            />
            <Toggle
              enabled={showContact}
              onChange={setShowContact}
              label='Show Contact Info'
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className='bg-white/5 border border-white/10 p-6'>
          <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
            Notifications
          </h4>
          <div className='space-y-4'>
            <Toggle
              enabled={emailNotifications}
              onChange={setEmailNotifications}
              label='Email Notifications'
            />
            <Toggle
              enabled={smsNotifications}
              onChange={setSmsNotifications}
              label='SMS Notifications'
            />
            <Toggle
              enabled={pushNotifications}
              onChange={setPushNotifications}
              label='Push Notifications'
            />
          </div>
        </div>

        {/* Account Management */}
        <div className='bg-white/5 border border-white/10 p-6'>
          <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
            Account Management
          </h4>
          <div className='space-y-3'>
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>🔐 Change Password</span>
            </button>
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>💳 Payment Settings</span>
            </button>
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>📄 Download Data</span>
            </button>
            <button className='w-full text-left p-3 bg-red-500/20 hover:bg-red-500/30 transition-colors border border-red-500/40'>
              <span className='text-red-400 text-sm'>
                ⚠️ Deactivate Account
              </span>
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className='bg-white/5 border border-white/10 p-6'>
          <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
            Help & Support
          </h4>
          <div className='space-y-3'>
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>📚 Help Center</span>
            </button>
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>💬 Contact Support</span>
            </button>
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>📋 Terms of Service</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;

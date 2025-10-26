import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
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
  onProfileSettingsUpdate: (settings: {
    profileVisibility?: boolean;
    acceptBookings?: boolean;
    showContact?: boolean;
  }) => Promise<void>;
  onNotificationSettingsUpdate: (notificationSettings: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    bookingReminders?: boolean;
  }) => Promise<void>;
  updateProfileMutation: any;
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
  onProfileSettingsUpdate,
  onNotificationSettingsUpdate,
}: SettingsTabProps) => {
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
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
              onChange={async value => {
                setProfileVisibility(value);
                await onProfileSettingsUpdate({ profileVisibility: value });
              }}
              label='Profile Visibility'
            />
            <Toggle
              enabled={acceptBookings}
              onChange={async value => {
                setAcceptBookings(value);
                await onProfileSettingsUpdate({ acceptBookings: value });
              }}
              label='Accept Bookings'
            />
            <Toggle
              enabled={showContact}
              onChange={async value => {
                setShowContact(value);
                await onProfileSettingsUpdate({ showContact: value });
              }}
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
              onChange={async value => {
                setEmailNotifications(value);
                await onNotificationSettingsUpdate({
                  emailNotifications: value,
                });
              }}
              label='Email Notifications'
            />
            <Toggle
              enabled={smsNotifications}
              onChange={async value => {
                setSmsNotifications(value);
                await onNotificationSettingsUpdate({ smsNotifications: value });
              }}
              label='SMS Notifications'
            />
            <Toggle
              enabled={pushNotifications}
              onChange={async value => {
                setPushNotifications(value);
                await onNotificationSettingsUpdate({ bookingReminders: value });
              }}
              label='Booking Reminders'
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
            <div>
              <button
                onClick={() => setIsHelpCenterOpen(!isHelpCenterOpen)}
                className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-between'
              >
                <span className='text-white text-sm'>📚 Help Center</span>
                <motion.span
                  animate={{ rotate: isHelpCenterOpen ? 45 : 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className='text-white/60 text-sm'
                >
                  +
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: isHelpCenterOpen ? 'auto' : 0,
                  opacity: isHelpCenterOpen ? 1 : 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
                className='overflow-hidden'
              >
                <div className='mt-3 p-4 bg-white/5 border border-white/10'>
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: isHelpCenterOpen ? 1 : 0,
                      y: isHelpCenterOpen ? 0 : -10,
                    }}
                    transition={{
                      delay: isHelpCenterOpen ? 0.1 : 0,
                      duration: 0.2,
                    }}
                    className='text-white/80 text-sm mb-2'
                  >
                    Need help? We're here to assist you with any questions or
                    issues you might have.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: isHelpCenterOpen ? 1 : 0,
                      y: isHelpCenterOpen ? 0 : -10,
                    }}
                    transition={{
                      delay: isHelpCenterOpen ? 0.15 : 0,
                      duration: 0.2,
                    }}
                    className='text-white/80 text-sm mb-2'
                  >
                    For immediate support and updates, please message us on our
                    Instagram.
                  </motion.p>
                  <motion.a
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: isHelpCenterOpen ? 1 : 0,
                      y: isHelpCenterOpen ? 0 : -10,
                    }}
                    transition={{
                      delay: isHelpCenterOpen ? 0.2 : 0,
                      duration: 0.2,
                    }}
                    href='https://www.instagram.com/upl1st/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-orange-400 hover:text-orange-300 text-sm font-semibold'
                  >
                    @upl1st
                  </motion.a>
                </div>
              </motion.div>
            </div>

            <Link to='/terms'>
              <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
                <span className='text-white text-sm'>
                  📋 Terms & Conditions
                </span>
              </button>
            </Link>

            <Link to='/privacy'>
              <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 mt-3'>
                <span className='text-white text-sm'>🔒 Privacy Policy</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;

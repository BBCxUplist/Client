import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Toggle from '@/components/ui/Toggle';
import ChangePasswordModal from '@/components/ui/ChangePasswordModal';
import DeleteAccountModal from '@/components/ui/DeleteAccountModal';
import { useDeleteArtistAccount } from '@/hooks/artist/useDeleteArtistAccount';
import {
  useCreateStripeConnection,
  useGetStripeStatus,
  useGetStripeManageLink,
  useGetStripeAuthLink,
} from '@/hooks/artist/useStripeConnection';
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Delete account mutation
  const deleteAccountMutation = useDeleteArtistAccount();

  // Stripe connection hooks - following the flow:
  // Step 4 & 5: Check account status (GET /stripe/status)
  const { data: stripeStatus, isLoading: isStripeLoading } =
    useGetStripeStatus();
  // Step 1: Create connection (POST /stripe/)
  const createStripeConnection = useCreateStripeConnection();
  // Step 6: Get manage link (GET /stripe/manage)
  const getManageLink = useGetStripeManageLink();
  // For re-authentication if needed
  const getAuthLink = useGetStripeAuthLink();

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  // Step 1 & 2: Handle Stripe connect button click - creates account and redirects to onboarding
  const handleConnectStripe = async () => {
    try {
      const result = await createStripeConnection.mutateAsync();
      if (result.data?.redirect) {
        window.location.href = result.data.redirect;
      }
    } catch (error) {
      console.error('Failed to create Stripe connection:', error);
    }
  };

  // Step 6: Handle Stripe manage button click - opens Stripe Express Dashboard
  const handleManageStripe = async () => {
    try {
      const result = await getManageLink.mutateAsync();
      if (result.data?.redirect) {
        window.open(result.data.redirect, '_blank');
      }
    } catch (error) {
      console.error('Failed to get Stripe manage link:', error);
    }
  };

  // Handle Stripe re-authenticate button click (for incomplete onboarding)
  // First try to use onboardingLink from status, otherwise call authenticate endpoint
  const handleReauthenticateStripe = async () => {
    try {
      // Check if status already has an onboardingLink
      if (stripeStatus?.data?.onboardingLink) {
        window.location.href = stripeStatus.data.onboardingLink;
        return;
      }

      // Fallback to authenticate endpoint if no link in status
      const result = await getAuthLink.mutateAsync();
      if (result.data?.redirect) {
        window.location.href = result.data.redirect;
      }
    } catch (error) {
      console.error('Failed to get Stripe auth link:', error);
    }
  };

  // Determine Stripe connection state based on status endpoint
  // Status endpoint returns: status, chargesEnabled, payoutsEnabled, isReadyForPayments, isReadyForPayouts, etc.
  const hasStripeAccount = stripeStatus?.data?.status !== 'not_created';
  const isStripeActive =
    hasStripeAccount &&
    stripeStatus?.data?.isReadyForPayments &&
    stripeStatus?.data?.isReadyForPayouts;

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

        {/* Bank Account / Stripe Connection */}
        <div className='bg-white/5 border border-white/10 p-6'>
          <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
            Bank Account
          </h4>
          <p className='text-white/60 text-sm mb-4'>
            Connect your bank account via Stripe to receive payouts from
            bookings.
          </p>

          {isStripeLoading ? (
            <div className='flex items-center gap-2 text-white/60'>
              <Loader2 className='w-4 h-4 animate-spin' />
              <span className='text-sm'>Checking connection status...</span>
            </div>
          ) : isStripeActive ? (
            // Connected and active
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-green-400'>
                <CheckCircle className='w-5 h-5' />
                <span className='font-semibold'>Bank Account Connected</span>
              </div>
              <p className='text-white/60 text-xs'>
                Your Stripe account is set up and ready to receive payouts.
              </p>
              <button
                onClick={handleManageStripe}
                disabled={getManageLink.isPending}
                className='w-full flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 transition-colors border border-white/20 disabled:opacity-50'
              >
                {getManageLink.isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <ExternalLink className='w-4 h-4' />
                )}
                <span className='text-white text-sm font-semibold'>
                  Manage Stripe Account
                </span>
              </button>
            </div>
          ) : hasStripeAccount && !isStripeActive ? (
            // Connection exists but onboarding incomplete or payouts not enabled
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-yellow-400'>
                <AlertCircle className='w-5 h-5' />
                <span className='font-semibold'>Setup Incomplete</span>
              </div>
              <p className='text-white/60 text-xs'>
                Your Stripe account setup is incomplete. Please complete the
                onboarding process to receive payouts.
              </p>
              <button
                onClick={handleReauthenticateStripe}
                disabled={getAuthLink.isPending}
                className='w-full flex items-center justify-center gap-2 p-3 bg-yellow-500 hover:bg-yellow-600 transition-colors disabled:opacity-50'
              >
                {getAuthLink.isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <ExternalLink className='w-4 h-4' />
                )}
                <span className='text-black text-sm font-semibold'>
                  Complete Setup
                </span>
              </button>
              {stripeStatus?.data?.onboardingLink && (
                <p className='text-white/40 text-xs text-center'>
                  Click to continue Stripe onboarding
                </p>
              )}
            </div>
          ) : (
            // No connection - show connect button
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-white/60'>
                <AlertCircle className='w-5 h-5' />
                <span className='text-sm'>No bank account connected</span>
              </div>
              <button
                onClick={handleConnectStripe}
                disabled={createStripeConnection.isPending}
                className='w-full flex items-center justify-center gap-2 p-3 bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-50'
              >
                {createStripeConnection.isPending ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <svg
                    className='w-5 h-5'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z' />
                  </svg>
                )}
                <span className='text-black text-sm font-semibold'>
                  {createStripeConnection.isPending
                    ? 'Connecting...'
                    : 'Connect Bank Account'}
                </span>
              </button>
              <p className='text-white/40 text-xs text-center'>
                Powered by Stripe - Secure payment processing
              </p>
            </div>
          )}
        </div>

        {/* Account Management */}
        <div className='bg-white/5 border border-white/10 p-6'>
          <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
            Account Management
          </h4>
          <div className='space-y-3'>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'
            >
              <span className='text-white text-sm'>🔐 Change Password</span>
            </button>

            {/* <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>💳 Payment Settings</span>
            </button>
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>📄 Download Data</span>
            </button> */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className='w-full text-left p-3 bg-red-500/20 hover:bg-red-500/30 transition-colors border border-red-500/40'
            >
              <span className='text-red-400 text-sm'>⚠️ Delete Account</span>
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

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={deleteAccountMutation.isPending}
      />
    </motion.div>
  );
};

export default SettingsTab;

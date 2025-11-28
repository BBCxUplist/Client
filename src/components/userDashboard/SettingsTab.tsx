import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChangePasswordModal from '@/components/ui/ChangePasswordModal';
import DeleteAccountModal from '@/components/ui/DeleteAccountModal';
import { useDeleteAccount } from '@/hooks/user/useDeleteAccount';

interface SettingsTabProps {
  userData: any;
  profileForm: any;
  setProfileForm: (form: any) => void;
  handleUsernameChange: (value: string) => void;
  handlePhoneChange: (value: string) => void;
  handleAvatarUpload: (file: File) => void;
  handleProfileUpdate: () => void;
  updateProfileMutation: any;
  uploading: boolean;
  uploadError: string | null;
  uploadedUrl: string | null;
  reset: () => void;
  validateUsername: (username: string) => boolean;
  validatePhone: (phone: string) => boolean;
  isProfileIncomplete?: boolean;
  missingFields?: string[];
  handleNotificationUpdate: (settings: any) => void;
}

const SettingsTab = ({
  userData,
  profileForm,
  setProfileForm,
  handleUsernameChange,
  handlePhoneChange,
  handleAvatarUpload,
  handleProfileUpdate,
  updateProfileMutation,
  uploading,
  uploadError,
  uploadedUrl,
  reset,
  validateUsername,
  validatePhone,
  isProfileIncomplete = false,
  missingFields = [],
  handleNotificationUpdate,
}: SettingsTabProps) => {
  const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Delete account mutation
  const deleteAccountMutation = useDeleteAccount();

  // Handle notification toggle changes
  const handleNotificationToggle = (setting: string, value: boolean) => {
    const currentSettings = userData?.notificationSettings || {};
    const updatedSettings = {
      ...currentSettings,
      [setting]: value,
    };
    handleNotificationUpdate(updatedSettings);
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

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

      {/* Profile Completion Warning */}
      {isProfileIncomplete && (
        <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6'>
          <div className='flex items-start gap-3'>
            <div className='text-yellow-400 text-xl'>⚠️</div>
            <div className='flex-1'>
              <h4 className='text-yellow-400 font-semibold mb-1'>
                Please Complete Your Profile
              </h4>
              <p className='text-white/70 text-sm mb-2'>
                Your profile is missing important information. Complete your
                profile to get the best experience.
              </p>
              <div className='text-white/60 text-xs'>
                <strong>Missing:</strong> {missingFields.join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Profile Information */}
        <div className='bg-white/5 border border-white/10 p-6'>
          <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
            Profile Information
          </h4>
          <div className='space-y-4'>
            <div>
              <label className='block text-white/70 text-sm mb-2'>
                Username
              </label>
              <input
                type='text'
                value={profileForm.username}
                onChange={e => handleUsernameChange(e.target.value)}
                className={`w-full bg-white/5 border text-white p-3 ${
                  profileForm.username &&
                  !validateUsername(profileForm.username)
                    ? 'border-red-500'
                    : 'border-white/20'
                }`}
                placeholder='username (lowercase, numbers, dots, underscores only)'
              />
              {profileForm.username &&
                !validateUsername(profileForm.username) && (
                  <p className='text-red-400 text-xs mt-1'>
                    Username can only contain lowercase letters, numbers, dots,
                    and underscores
                  </p>
                )}
            </div>
            <div>
              <label className='block text-white/70 text-sm mb-2'>
                Display Name
              </label>
              <input
                type='text'
                value={profileForm.displayName}
                onChange={e =>
                  setProfileForm((prev: any) => ({
                    ...prev,
                    displayName: e.target.value,
                  }))
                }
                className='w-full bg-white/5 border border-white/20 text-white p-3'
              />
            </div>
            <div>
              <label className='block text-white/70 text-sm mb-2'>Email</label>
              <input
                type='email'
                value={userData.useremail}
                className='w-full bg-white/5 border border-white/20 text-white p-3'
                readOnly
              />
            </div>
            <div>
              <label className='block text-white/70 text-sm mb-2'>Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={e =>
                  setProfileForm((prev: any) => ({
                    ...prev,
                    bio: e.target.value,
                  }))
                }
                className='w-full bg-white/5 border border-white/20 text-white p-3 h-20 resize-none'
                placeholder='Tell us about yourself...'
              />
            </div>
            <div>
              <label className='block text-white/70 text-sm mb-2'>Phone</label>
              <input
                type='tel'
                value={profileForm.phone}
                onChange={e => handlePhoneChange(e.target.value)}
                className={`w-full bg-white/5 border text-white p-3 ${
                  profileForm.phone && !validatePhone(profileForm.phone)
                    ? 'border-red-500'
                    : 'border-white/20'
                }`}
                placeholder='+1 (555) 123-4567'
              />
              {profileForm.phone && !validatePhone(profileForm.phone) && (
                <p className='text-red-400 text-xs mt-1'>
                  Please enter a valid phone number
                </p>
              )}
            </div>
            <div>
              <label className='block text-white/70 text-sm mb-2'>
                Location
              </label>
              <input
                type='text'
                value={profileForm.location}
                onChange={e =>
                  setProfileForm((prev: any) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className='w-full bg-white/5 border border-white/20 text-white p-3'
              />
            </div>
            <div>
              <label className='block text-white/70 text-sm mb-2'>
                Profile Picture
              </label>
              <div className='space-y-4'>
                {/* Current/Uploaded Image Preview */}
                {(uploadedUrl || profileForm.avatar) && (
                  <div className='relative inline-block'>
                    <img
                      src={uploadedUrl || profileForm.avatar}
                      alt='Profile preview'
                      className='w-32 h-32 object-cover rounded-lg border border-white/20'
                    />
                    <button
                      type='button'
                      onClick={() => {
                        reset();
                        setProfileForm((prev: any) => ({
                          ...prev,
                          avatar: '',
                        }));
                      }}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors'
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* File Input */}
                <input
                  type='file'
                  accept='image/*'
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleAvatarUpload(file);
                    }
                  }}
                  className='hidden'
                  id='avatar-upload'
                />
                <label
                  htmlFor='avatar-upload'
                  className='inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 text-white rounded cursor-pointer hover:bg-white/20 transition-colors'
                >
                  {uploading ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                      Uploading...
                    </>
                  ) : (
                    <>📷 Choose Photo</>
                  )}
                </label>

                {uploadError && (
                  <p className='text-red-400 text-xs'>{uploadError}</p>
                )}

                <p className='text-white/50 text-xs'>
                  Upload a profile picture (JPG, PNG, max 5MB)
                </p>
              </div>
            </div>
            <button
              onClick={handleProfileUpdate}
              disabled={
                updateProfileMutation.isPending ||
                uploading ||
                (!!profileForm.username &&
                  !validateUsername(profileForm.username)) ||
                (!!profileForm.phone && !validatePhone(profileForm.phone))
              }
              className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {updateProfileMutation.isPending
                ? 'UPDATING...'
                : 'UPDATE PROFILE'}
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className='bg-white/5 border border-white/10 p-6'>
          <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
            Notifications
          </h4>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-white'>Email Notifications</span>
              <button
                onClick={() =>
                  handleNotificationToggle(
                    'emailNotifications',
                    !userData?.notificationSettings?.emailNotifications
                  )
                }
                disabled={updateProfileMutation.isPending}
                className={`w-12 h-6 relative border transition-colors ${
                  userData?.notificationSettings?.emailNotifications
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white/10 border-white/30'
                } ${updateProfileMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white transition-all duration-200 ${
                    userData?.notificationSettings?.emailNotifications
                      ? 'right-0.5'
                      : 'left-0.5'
                  }`}
                ></div>
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-white'>SMS Notifications</span>
              <button
                onClick={() =>
                  handleNotificationToggle(
                    'smsNotifications',
                    !userData?.notificationSettings?.smsNotifications
                  )
                }
                disabled={updateProfileMutation.isPending}
                className={`w-12 h-6 relative border transition-colors ${
                  userData?.notificationSettings?.smsNotifications
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white/10 border-white/30'
                } ${updateProfileMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white transition-all duration-200 ${
                    userData?.notificationSettings?.smsNotifications
                      ? 'right-0.5'
                      : 'left-0.5'
                  }`}
                ></div>
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-white'>Booking Reminders</span>
              <button
                onClick={() =>
                  handleNotificationToggle(
                    'bookingReminders',
                    !userData?.notificationSettings?.bookingReminders
                  )
                }
                disabled={updateProfileMutation.isPending}
                className={`w-12 h-6 relative border transition-colors ${
                  userData?.notificationSettings?.bookingReminders
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white/10 border-white/30'
                } ${updateProfileMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white transition-all duration-200 ${
                    userData?.notificationSettings?.bookingReminders
                      ? 'right-0.5'
                      : 'left-0.5'
                  }`}
                ></div>
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-white'>Artist Recommendations</span>
              <button
                onClick={() =>
                  handleNotificationToggle(
                    'artistRecommendations',
                    !userData?.notificationSettings?.artistRecommendations
                  )
                }
                disabled={updateProfileMutation.isPending}
                className={`w-12 h-6 relative border transition-colors ${
                  userData?.notificationSettings?.artistRecommendations
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-white/10 border-white/30'
                } ${updateProfileMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white transition-all duration-200 ${
                    userData?.notificationSettings?.artistRecommendations
                      ? 'right-0.5'
                      : 'left-0.5'
                  }`}
                ></div>
              </button>
            </div>
          </div>
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
              <span className='text-white text-sm'>💳 Payment Methods</span>
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

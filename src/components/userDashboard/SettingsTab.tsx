import { motion } from 'framer-motion';

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
                  setProfileForm(prev => ({
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
                  setProfileForm(prev => ({
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
                  setProfileForm(prev => ({
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
                        setProfileForm(prev => ({
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
              <button className='w-12 h-6 bg-orange-500 relative border border-orange-500'>
                <div className='absolute top-0.5 right-0.5 w-5 h-5 bg-white'></div>
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-white'>SMS Notifications</span>
              <button className='w-12 h-6 bg-orange-500 relative border border-orange-500'>
                <div className='absolute top-0.5 right-0.5 w-5 h-5 bg-white'></div>
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-white'>Booking Reminders</span>
              <button className='w-12 h-6 bg-orange-500 relative border border-orange-500'>
                <div className='absolute top-0.5 right-0.5 w-5 h-5 bg-white'></div>
              </button>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-white'>Artist Recommendations</span>
              <button className='w-12 h-6 bg-white/10 relative border border-white/30'>
                <div className='absolute top-0.5 left-0.5 w-5 h-5 bg-white'></div>
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
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>🔐 Change Password</span>
            </button>
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>💳 Payment Methods</span>
            </button>
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>📄 Download Data</span>
            </button>
            <button className='w-full text-left p-3 bg-red-500/20 hover:bg-red-500/30 transition-colors border border-red-500/40'>
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
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>📚 Help Center</span>
            </button>
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>💬 Contact Support</span>
            </button>
            <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
              <span className='text-white text-sm'>⭐ Rate the App</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;

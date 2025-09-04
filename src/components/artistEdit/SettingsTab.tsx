import { useState } from 'react';
import Toggle from '@/components/ui/Toggle';
import type { Artist } from '@/types';

interface SettingsTabProps {
  artist: Artist;
}

const SettingsTab = ({ artist }: SettingsTabProps) => {
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);

  return (
    <div className='space-y-8'>
      {/* Account Settings */}
      <div className='bg-white/5 border border-white/10 p-6'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Account Settings
        </h3>

        <div className='space-y-4'>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Email Address
            </label>
            <input
              type='email'
              value={`${artist.slug}@example.com`}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500'
              readOnly
            />
            <p className='text-white/50 text-xs mt-1'>
              Contact support to change email
            </p>
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Phone Number
            </label>
            <input
              type='tel'
              placeholder='+91 98765 43210'
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500'
            />
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>Location</label>
            <input
              type='text'
              placeholder='Mumbai, Maharashtra'
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500'
            />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className='bg-white/5 border border-white/10 p-6'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Privacy & Visibility
        </h3>

        <div className='space-y-4'>
          <Toggle
            enabled={profileVisibility}
            onChange={setProfileVisibility}
            label='Profile Visibility'
          />

          <Toggle
            enabled={showContact}
            onChange={setShowContact}
            label='Show Contact Information'
          />

          <Toggle
            enabled={allowMessages}
            onChange={setAllowMessages}
            label='Allow Direct Messages'
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div className='bg-white/5 border border-white/10 p-6'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Notifications
        </h3>

        <div className='space-y-4'>
          <Toggle
            enabled={emailNotifications}
            onChange={setEmailNotifications}
            label='Email Notifications'
          />

          <Toggle
            enabled={bookingReminders}
            onChange={setBookingReminders}
            label='Booking Reminders'
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className='bg-red-500/10 border border-red-500/30 p-6'>
        <h3 className='text-xl font-semibold text-red-400 mb-6 font-mondwest'>
          Danger Zone
        </h3>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white font-semibold'>Delete Account</p>
              <p className='text-white/60 text-sm'>
                Permanently remove your account and all data
              </p>
            </div>
            <button className='bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition-colors'>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;

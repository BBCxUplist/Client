import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
 
  Edit, 
  Save, 
  X,
  Camera,
  Star
} from 'lucide-react';
import { useAuth, useCurrentUser } from '@/hooks/useAuth';
import { EmptyState } from '@/components/common/EmptyState';

export const Profile = () => {
  const { isAuthenticated } = useAuth();
  const currentUser = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    bio: currentUser?.bio || '',
  });

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={User}
            title="Authentication Required"
            description="Please sign in to view your profile."
          />
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // In a real app, this would update the user profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      location: currentUser?.location || '',
      bio: currentUser?.bio || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">Profile</h1>
              <p className="text-neutral-600 mt-1">Manage your account information</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name}&size=120&background=random`}
                    alt={currentUser.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-lg"
                  />
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="mb-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="text-2xl sm:text-3xl font-bold text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 w-full focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    ) : (
                      <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800">{currentUser.name}</h2>
                    )}
                    <p className="text-neutral-600 mt-1">Member since {new Date().getFullYear()}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-neutral-800">12</div>
                      <div className="text-sm text-neutral-600">Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-neutral-800">4.8</div>
                      <div className="text-sm text-neutral-600 flex items-center justify-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        Rating
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-neutral-800">8</div>
                      <div className="text-sm text-neutral-600">Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold text-neutral-800 mb-4 sm:mb-6">Contact Information</h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-neutral-400" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  ) : (
                    <span className="text-neutral-700">{currentUser.email}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-neutral-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Add phone number"
                      className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  ) : (
                    <span className="text-neutral-700">{currentUser.phone || 'Not provided'}</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-neutral-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Add location"
                      className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  ) : (
                    <span className="text-neutral-700">{currentUser.location || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold text-neutral-800 mb-4 sm:mb-6">About</h3>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
                />
              ) : (
                <p className="text-neutral-700 leading-relaxed">
                  {currentUser.bio || 'No bio available. Click edit to add one.'}
                </p>
              )}
            </motion.div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6 sm:space-y-8">
            {/* Save Button */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
              >
                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-colors mt-3"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-neutral-800 mb-4">Account Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Total Spent</span>
                  <span className="font-semibold text-neutral-800">$2,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Favorite Artists</span>
                  <span className="font-semibold text-neutral-800">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Events Attended</span>
                  <span className="font-semibold text-neutral-800">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Reviews Given</span>
                  <span className="font-semibold text-neutral-800">6</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-neutral-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-neutral-600">Booked Sarah Johnson</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-neutral-600">Completed event with Mike Davis</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-neutral-600">Left review for Alex Wilson</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

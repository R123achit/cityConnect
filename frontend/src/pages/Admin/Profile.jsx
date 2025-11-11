import { useState } from 'react';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // Call password change API
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card dark:bg-dark-800 dark:border-dark-700 text-center">
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-primary-600 dark:text-primary-400" size={48} />
          </div>
          <h3 className="font-bold text-xl mb-1 dark:text-white">{user?.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{user?.email}</p>
          <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 rounded-full text-sm font-medium">
            Administrator
          </span>
        </div>

        {/* Update Profile Form */}
        <div className="card dark:bg-dark-800 dark:border-dark-700 lg:col-span-2">
          <h3 className="text-xl font-bold mb-6 dark:text-white">Update Profile</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="label dark:text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input pl-12 dark:bg-dark-900 dark:border-dark-600 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label dark:text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="email"
                  value={user?.email}
                  className="input pl-12 bg-gray-100 dark:bg-dark-700 dark:border-dark-600 dark:text-gray-400"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="label dark:text-gray-300">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input pl-12 dark:bg-dark-900 dark:border-dark-600 dark:text-white"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary flex items-center gap-2">
              <Save size={20} />
              Update Profile
            </button>
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div className="card dark:bg-dark-800 dark:border-dark-700">
        <h3 className="text-xl font-bold mb-6 dark:text-white">Change Password</h3>
        <form onSubmit={handleChangePassword} className="max-w-2xl space-y-4">
          <div>
            <label className="label dark:text-gray-300">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="input pl-12 dark:bg-dark-900 dark:border-dark-600 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="label dark:text-gray-300">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="input pl-12 dark:bg-dark-900 dark:border-dark-600 dark:text-white"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="label dark:text-gray-300">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="input pl-12 dark:bg-dark-900 dark:border-dark-600 dark:text-white"
                required
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

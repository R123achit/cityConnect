import { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, CreditCard, Bus, Route as RouteIcon } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';

const Profile = () => {
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [assignedBus, setAssignedBus] = useState(null);
  const [assignedRoute, setAssignedRoute] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const [busRes, routeRes] = await Promise.all([
        api.get('/driver/assigned-bus'),
        api.get('/driver/assigned-route')
      ]);
      setAssignedBus(busRes.data.data);
      setAssignedRoute(routeRes.data.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card dark:bg-dark-800 dark:border-dark-700 text-center">
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-primary-600 dark:text-primary-400" size={48} />
          </div>
          <h3 className="font-bold text-xl mb-1 dark:text-white">{user?.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">{user?.email}</p>
          <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
            Active Driver
          </span>

          {user?.licenseNumber && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">License Number</p>
              <p className="font-medium dark:text-white">{user.licenseNumber}</p>
            </div>
          )}
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

            <button type="submit" className="btn btn-primary dark:bg-gradient-to-r dark:from-purple-600 dark:to-purple-700 flex items-center gap-2">
              <Save size={20} />
              Update Profile
            </button>
          </form>
        </div>
      </div>

      {/* Assignment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card dark:bg-dark-800 dark:border-dark-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Bus className="text-primary-600 dark:text-primary-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold dark:text-white">Assigned Bus</h3>
          </div>
          {assignedBus ? (
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-700">
                <span className="text-gray-600 dark:text-gray-400">Bus Number:</span>
                <span className="font-bold dark:text-white">{assignedBus.busNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-700">
                <span className="text-gray-600 dark:text-gray-400">Registration:</span>
                <span className="font-medium dark:text-white">{assignedBus.registrationNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-700">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span className="font-medium dark:text-white">{assignedBus.type || 'Standard'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                <span className="font-medium dark:text-white">{assignedBus.capacity || 40} passengers</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Bus className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={48} />
              <p className="text-gray-500 dark:text-gray-400">No bus assigned</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Contact admin for assignment</p>
            </div>
          )}
        </div>

        <div className="card dark:bg-dark-800 dark:border-dark-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
              <RouteIcon className="text-secondary-600 dark:text-secondary-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold dark:text-white">Assigned Route</h3>
          </div>
          {assignedRoute ? (
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-700">
                <span className="text-gray-600 dark:text-gray-400">Route Number:</span>
                <span className="font-bold dark:text-white">{assignedRoute.routeNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-700">
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="font-medium dark:text-white">{assignedRoute.routeName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-700">
                <span className="text-gray-600 dark:text-gray-400">Total Stops:</span>
                <span className="font-medium dark:text-white">{assignedRoute.stops?.length || 0}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                <span className="font-medium dark:text-white">{assignedRoute.totalDistance || 'N/A'} km</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <RouteIcon className="mx-auto text-gray-300 dark:text-gray-600 mb-2" size={48} />
              <p className="text-gray-500 dark:text-gray-400">No route assigned</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Contact admin for assignment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

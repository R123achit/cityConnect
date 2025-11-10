import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Play, Square, AlertCircle, Navigation, Bell, Wifi, WifiOff } from 'lucide-react';
import socketService from '../../utils/socket';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Dashboard = () => {
  const [assignedBus, setAssignedBus] = useState(null);
  const [assignedRoute, setAssignedRoute] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tripActive, setTripActive] = useState(false);
  const [tripStartTime, setTripStartTime] = useState(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [locationWatcher, setLocationWatcher] = useState(null);

  useEffect(() => {
    fetchDriverData();
    fetchNotifications();
    connectSocket();

    return () => {
      if (locationWatcher) {
        navigator.geolocation.clearWatch(locationWatcher);
      }
      socketService.disconnect();
    };
  }, []);

  const fetchDriverData = async () => {
    try {
      const [busRes, routeRes] = await Promise.all([
        api.get('/driver/assigned-bus'),
        api.get('/driver/assigned-route')
      ]);

      setAssignedBus(busRes.data.data);
      setAssignedRoute(routeRes.data.data);
    } catch (error) {
      console.error('Error fetching driver data:', error);
      toast.error('Failed to fetch assignment data');
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/driver/notifications');
      const allNotifications = response.data.data;
      setNotifications(allNotifications);
      
      // Count unread notifications
      const userId = JSON.parse(localStorage.getItem('user'))?._id;
      const unread = allNotifications.filter(n => 
        !n.isRead.some(r => r.user === userId)
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const connectSocket = () => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      setIsOnline(true);
      console.log('✅ Driver connected to socket');
      
      // Notify backend that driver is online
      if (assignedBus) {
        socket.emit('driver:online', {
          driverId: JSON.parse(localStorage.getItem('user'))?._id,
          busId: assignedBus._id
        });
      }
    });

    socket.on('disconnect', () => {
      setIsOnline(false);
      console.log('❌ Driver disconnected from socket');
    });

    socket.on('notification:broadcast', (data) => {
      toast(data.message, {
        icon: '📢',
        duration: 5000,
      });
      fetchNotifications();
    });

    // Listen for admin alerts
    socket.on('admin:alert', (data) => {
      toast.error(data.message, {
        icon: '⚠️',
        duration: 7000,
      });
      fetchNotifications();
    });

    // Listen for admin messages
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    if (userId) {
      socket.on(`driver:message:${userId}`, (message) => {
        toast(message, {
          icon: '💬',
          duration: 5000,
        });
      });

      // Listen for personal notifications
      socket.on(`notification:${userId}`, (data) => {
        toast(data.message, {
          icon: data.type === 'alert' ? '⚠️' : '📢',
          duration: 6000,
        });
        fetchNotifications();
      });
    }
  };

  const startTrip = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    try {
      // First get initial position to verify GPS works
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Initial position obtained successfully
          const initialLocation = {
            coordinates: [position.coords.longitude, position.coords.latitude]
          };
          
          setCurrentLocation(initialLocation);
          toast.success('GPS location obtained! Starting trip...');

          // Now start the trip
          await api.put('/driver/start-trip');
          setTripActive(true);
          setTripStartTime(new Date());

          socketService.emit('driver:start-trip', {
            busId: assignedBus._id,
            timestamp: new Date()
          });

          // Start continuous location tracking
          const watcherId = navigator.geolocation.watchPosition(
            (position) => {
              const location = {
                coordinates: [position.coords.longitude, position.coords.latitude]
              };
              
              setCurrentLocation(location);
              updateLocation(location);
            },
            (error) => {
              console.error('Geolocation watch error:', error);
              // Don't show error toast on every update failure, just log it
              if (error.code === error.PERMISSION_DENIED) {
                toast.error('Location permission denied. Please enable GPS.');
              }
            },
            {
              enableHighAccuracy: true,
              maximumAge: 5000,
              timeout: 15000
            }
          );

          setLocationWatcher(watcherId);
        },
        (error) => {
          // Handle initial position error
          console.error('Initial geolocation error:', error);
          let errorMessage = 'Could not get location. ';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access in browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'GPS signal not available. Try moving outdoors.';
              break;
            case error.TIMEOUT:
              errorMessage += 'GPS timeout. Please try again.';
              break;
            default:
              errorMessage += 'Unknown error occurred.';
          }
          
          toast.error(errorMessage, { duration: 5000 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (error) {
      toast.error('Failed to start trip');
    }
  };

  const stopTrip = async () => {
    try {
      await api.put('/driver/stop-trip');
      setTripActive(false);
      setTripStartTime(null);
      toast.success('Trip ended');

      socketService.emit('driver:stop-trip', {
        busId: assignedBus._id,
        timestamp: new Date()
      });

      if (locationWatcher) {
        navigator.geolocation.clearWatch(locationWatcher);
        setLocationWatcher(null);
      }
    } catch (error) {
      toast.error('Failed to stop trip');
    }
  };

  const updateLocation = async (location) => {
    if (!assignedBus || !assignedRoute) return;

    const currentStop = assignedRoute.stops[currentStopIndex]?.name || '';
    const nextStop = assignedRoute.stops[currentStopIndex + 1]?.name || 'End';

    try {
      // Update backend database
      const response = await api.put('/driver/update-location', {
        coordinates: location.coordinates,
        currentStop,
        nextStop
      });

      // Emit real-time update to all connected clients (users and admin)
      socketService.emit('driver:location-update', {
        driverId: JSON.parse(localStorage.getItem('user'))?._id,
        busId: assignedBus._id,
        busNumber: assignedBus.busNumber,
        routeId: assignedRoute._id,
        routeNumber: assignedRoute.routeNumber,
        location: {
          type: 'Point',
          coordinates: location.coordinates
        },
        currentStop,
        nextStop,
        status: tripActive ? 'active' : 'idle',
        timestamp: new Date().toISOString()
      });

      console.log('📍 Location updated:', location.coordinates);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const sendSOS = async () => {
    if (!currentLocation) {
      toast.error('Location not available');
      return;
    }

    const description = prompt('Describe the emergency (optional):');

    try {
      const response = await api.post('/driver/sos', {
        location: currentLocation,
        description: description || 'Emergency alert'
      });

      socketService.emit('driver:sos', response.data.data);
      toast.success('🚨 SOS alert sent to admin!', { duration: 5000 });
    } catch (error) {
      toast.error('Failed to send SOS');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/driver/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const isNotificationRead = (notification) => {
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    return notification.isRead.some(r => r.user === userId);
  };

  const deleteNotification = async (notificationId) => {
    if (!window.confirm('Delete this notification?')) return;
    
    try {
      await api.delete(`/driver/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const nextStop = () => {
    if (currentStopIndex < assignedRoute.stops.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1);
      toast.success('Moved to next stop');
    }
  };

  const getTripDuration = () => {
    if (!tripStartTime) return '00:00:00';
    
    const diff = new Date() - tripStartTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const center = currentLocation 
    ? [currentLocation.coordinates[1], currentLocation.coordinates[0]]
    : assignedRoute?.stops[0]?.location.coordinates 
    ? [assignedRoute.stops[0].location.coordinates[1], assignedRoute.stops[0].location.coordinates[0]]
    : [28.6139, 77.2090];

  if (!assignedBus || !assignedRoute) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-gray-500">No bus or route assigned to you</p>
          <p className="text-sm text-gray-400 mt-2">Please contact admin for assignment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assignment Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Assigned Bus Info */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🚌</span>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">Assigned Bus</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Bus Number</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-white">{assignedBus.busNumber}</p>
            </div>
            <div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Registration</p>
              <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">{assignedBus.registrationNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-200 dark:border-blue-700">
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Type</p>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{assignedBus.type || 'AC'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-700 dark:text-blue-300">Capacity</p>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{assignedBus.capacity || 40} seats</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Route Info */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 border border-pink-200 dark:border-pink-800 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🗺️</span>
            <h3 className="text-sm font-semibold text-pink-900 dark:text-pink-200">Assigned Route</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">Route Number</p>
              <p className="text-2xl font-bold text-pink-900 dark:text-white">{assignedRoute.routeNumber}</p>
            </div>
            <div>
              <p className="text-xs text-pink-700 dark:text-pink-300 mb-1">Route Name</p>
              <p className="text-lg font-semibold text-pink-800 dark:text-pink-200">{assignedRoute.routeName}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-pink-200 dark:border-pink-700">
              <div>
                <p className="text-xs text-pink-700 dark:text-pink-300">Total Stops</p>
                <p className="text-sm font-medium text-pink-800 dark:text-pink-200">{assignedRoute.stops?.length || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-pink-700 dark:text-pink-300">Distance</p>
                <p className="text-sm font-medium text-pink-800 dark:text-pink-200">{assignedRoute.totalDistance || 'N/A'} Km</p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver License Info */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200 dark:border-orange-800 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">👤</span>
            <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-200">Driver Info</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">License Number</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-white">
                {JSON.parse(localStorage.getItem('user'))?.licenseNumber || '110'}
              </p>
            </div>
            <div>
              <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">Status</p>
              <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-lg shadow-sm">
                Active Driver
              </span>
            </div>
            <div className="pt-2 border-t border-orange-200 dark:border-orange-700">
              <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">Connection</p>
              <span className={`inline-block px-3 py-1 ${isOnline ? 'bg-green-500' : 'bg-red-500'} text-white text-sm font-medium rounded-lg shadow-sm`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Bus {assignedBus.busNumber} - Route {assignedRoute.routeNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 bg-white dark:bg-dark-800 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Bell size={24} className="text-gray-700 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {isOnline ? (
            <span className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm font-medium">
              <Wifi size={16} />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-sm font-medium">
              <WifiOff size={16} />
              Disconnected
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card dark:bg-dark-800 dark:border-dark-700 text-center p-4">
          {!tripActive ? (
            <button
              onClick={startTrip}
              className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Play size={20} />
              Start Trip
            </button>
          ) : (
            <button
              onClick={stopTrip}
              className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Square size={20} />
              Stop Trip
            </button>
          )}
        </div>

        <div className="card dark:bg-dark-800 dark:border-dark-700 text-center p-4">
          <button
            onClick={sendSOS}
            disabled={!tripActive}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            <AlertCircle size={20} />
            SOS Alert
          </button>
        </div>

        <div className="card dark:bg-dark-800 dark:border-dark-700 text-center p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Trip Duration</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{getTripDuration()}</p>
        </div>

        <div className="card dark:bg-dark-800 dark:border-dark-700 text-center p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</p>
          <p className="text-xl font-bold">
            {tripActive ? (
              <span className="text-green-600 dark:text-green-400">Active</span>
            ) : (
              <span className="text-gray-600 dark:text-gray-400">Inactive</span>
            )}
          </p>
        </div>
      </div>

      {/* Route Progress */}
      <div className="card dark:bg-dark-800 dark:border-dark-700">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Route Progress</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Stop</p>
            <p className="font-bold text-lg dark:text-white">
              {assignedRoute.stops[currentStopIndex]?.name || 'Not Started'}
            </p>
          </div>
          <button
            onClick={nextStop}
            disabled={!tripActive || currentStopIndex >= assignedRoute.stops.length - 1}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
          >
            Next Stop
          </button>
          <div className="flex-1 text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Next Stop</p>
            <p className="font-bold text-lg dark:text-white">
              {assignedRoute.stops[currentStopIndex + 1]?.name || 'End'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 dark:text-primary-400 bg-primary-200 dark:bg-primary-900/30">
                {currentStopIndex + 1} / {assignedRoute.stops.length} stops
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-primary-600 dark:text-primary-400">
                {Math.round(((currentStopIndex + 1) / assignedRoute.stops.length) * 100)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200 dark:bg-primary-900/30">
            <div
              style={{ width: `${((currentStopIndex + 1) / assignedRoute.stops.length) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600 transition-all duration-500"
            ></div>
          </div>
        </div>

        {/* All Stops */}
        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
          {assignedRoute.stops.map((stop, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex items-center justify-between ${
                index === currentStopIndex
                  ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500 border-2'
                  : index < currentStopIndex
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-gray-50 dark:bg-dark-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  index === currentStopIndex
                    ? 'bg-primary-600 text-white'
                    : index < currentStopIndex
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium dark:text-white">{stop.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{stop.estimatedTime} min from start</p>
                </div>
              </div>
              {index < currentStopIndex && (
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Completed</span>
              )}
              {index === currentStopIndex && (
                <span className="text-primary-600 dark:text-primary-400 text-sm font-medium">● Current</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNotifications(false)}>
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center">
              <h3 className="text-2xl font-bold dark:text-white">Notifications & Alerts</h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(80vh-100px)] p-6 space-y-3">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No notifications</p>
              ) : (
                notifications.map((notification) => {
                  const isRead = isNotificationRead(notification);
                  return (
                    <div
                      key={notification._id}
                      className={`p-4 rounded-lg border transition-all ${
                        isRead
                          ? 'bg-gray-50 dark:bg-dark-700/50 border-gray-200 dark:border-dark-600'
                          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${
                          notification.priority === 'high' ? 'text-red-500' :
                          notification.priority === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`}>
                          {notification.type === 'alert' ? '⚠️' :
                           notification.type === 'warning' ? '🚨' :
                           notification.type === 'info' ? 'ℹ️' : '📢'}
                        </div>
                        <div className="flex-1 cursor-pointer" onClick={() => !isRead && markAsRead(notification._id)}>
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-sm dark:text-white">{notification.title}</h4>
                            {!isRead && (
                              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                            <span>From: {notification.sender?.name || 'Admin'}</span>
                            <span>•</span>
                            <span>{new Date(notification.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Delete notification"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 card dark:bg-dark-800 dark:border-dark-700 p-0 overflow-hidden" style={{ height: '400px' }}>
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Current Location */}
            {currentLocation && (
              <Marker position={[currentLocation.coordinates[1], currentLocation.coordinates[0]]}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold">🚌 Your Location</p>
                    <p className="text-sm">{assignedBus.busNumber}</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Route Path */}
            {assignedRoute.stops && (
              <Polyline
                positions={assignedRoute.stops.map(stop => [
                  stop.location.coordinates[1],
                  stop.location.coordinates[0]
                ])}
                color="blue"
                weight={3}
                opacity={0.7}
              />
            )}

            {/* Route Stops */}
            {assignedRoute.stops && assignedRoute.stops.map((stop, index) => (
              <Marker
                key={index}
                position={[stop.location.coordinates[1], stop.location.coordinates[0]]}
                icon={L.divIcon({
                  className: 'custom-stop-marker',
                  html: `<div style="background-color: ${index === currentStopIndex ? '#2563eb' : index < currentStopIndex ? '#10b981' : 'white'}; border: 2px solid #2563eb; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; color: ${index <= currentStopIndex ? 'white' : '#2563eb'};">${index + 1}</div>`,
                  iconSize: [28, 28]
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold">{stop.name}</h4>
                    <p className="text-sm">Stop {index + 1}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Notifications Summary */}
        <div className="card dark:bg-dark-800 dark:border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Alerts & Messages</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.slice(0, 5).map((notification) => {
              const isRead = isNotificationRead(notification);
              return (
                <div
                  key={notification._id}
                  className={`p-3 rounded-lg transition-all ${
                    isRead
                      ? 'bg-gray-50 dark:bg-dark-700'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <Bell size={16} className={`mt-1 ${
                      isRead ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'
                    }`} />
                    <div className="flex-1 cursor-pointer" onClick={() => !isRead && markAsRead(notification._id)}>
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm mb-1 dark:text-white">{notification.title}</h4>
                        {!isRead && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
            {notifications.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">No messages</p>
            )}
          </div>
          {notifications.length > 5 && (
            <button
              onClick={() => setShowNotifications(true)}
              className="w-full mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              View All ({notifications.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

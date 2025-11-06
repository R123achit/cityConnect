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
      setNotifications(response.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const connectSocket = () => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      setIsOnline(true);
    });

    socket.on('disconnect', () => {
      setIsOnline(false);
    });

    socket.on('notification:broadcast', (data) => {
      toast(data.message, {
        icon: '📢',
        duration: 5000,
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
    }
  };

  const startTrip = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported');
      return;
    }

    try {
      await api.put('/driver/start-trip');
      setTripActive(true);
      setTripStartTime(new Date());
      toast.success('Trip started');

      socketService.emit('driver:start-trip', {
        busId: assignedBus._id,
        timestamp: new Date()
      });

      // Start location tracking
      const watcherId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            coordinates: [position.coords.longitude, position.coords.latitude]
          };
          
          setCurrentLocation(location);
          updateLocation(location);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Could not get location');
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000
        }
      );

      setLocationWatcher(watcherId);
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
    if (!tripActive || !assignedBus || !assignedRoute) return;

    const currentStop = assignedRoute.stops[currentStopIndex]?.name || '';
    const nextStop = assignedRoute.stops[currentStopIndex + 1]?.name || 'End';

    try {
      await api.put('/driver/update-location', {
        coordinates: location.coordinates,
        currentStop,
        nextStop
      });

      socketService.emit('driver:location-update', {
        driverId: JSON.parse(localStorage.getItem('user'))?._id,
        busId: assignedBus._id,
        location,
        currentStop,
        nextStop,
        status: 'active'
      });
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
      toast.success('SOS alert sent to admin');
    } catch (error) {
      toast.error('Failed to send SOS');
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
      {/* Header with Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-600 mt-1">Bus {assignedBus.busNumber} - Route {assignedRoute.routeNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <Wifi size={16} />
              Connected
            </span>
          ) : (
            <span className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              <WifiOff size={16} />
              Disconnected
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          {!tripActive ? (
            <button
              onClick={startTrip}
              className="btn btn-success w-full flex items-center justify-center gap-2"
            >
              <Play size={20} />
              Start Trip
            </button>
          ) : (
            <button
              onClick={stopTrip}
              className="btn btn-danger w-full flex items-center justify-center gap-2"
            >
              <Square size={20} />
              Stop Trip
            </button>
          )}
        </div>

        <div className="card text-center">
          <button
            onClick={sendSOS}
            disabled={!tripActive}
            className="btn btn-danger w-full flex items-center justify-center gap-2"
          >
            <AlertCircle size={20} />
            SOS Alert
          </button>
        </div>

        <div className="card text-center">
          <p className="text-sm text-gray-600">Trip Duration</p>
          <p className="text-2xl font-bold mt-1">{getTripDuration()}</p>
        </div>

        <div className="card text-center">
          <p className="text-sm text-gray-600">Status</p>
          <p className="text-xl font-bold mt-1">
            {tripActive ? (
              <span className="text-green-600">Active</span>
            ) : (
              <span className="text-gray-600">Inactive</span>
            )}
          </p>
        </div>
      </div>

      {/* Route Progress */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Route Progress</h3>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Current Stop</p>
            <p className="font-bold text-lg">
              {assignedRoute.stops[currentStopIndex]?.name || 'Not Started'}
            </p>
          </div>
          <button
            onClick={nextStop}
            disabled={!tripActive || currentStopIndex >= assignedRoute.stops.length - 1}
            className="btn btn-primary"
          >
            Next Stop
          </button>
          <div className="flex-1 text-right">
            <p className="text-sm text-gray-600">Next Stop</p>
            <p className="font-bold text-lg">
              {assignedRoute.stops[currentStopIndex + 1]?.name || 'End'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
                {currentStopIndex + 1} / {assignedRoute.stops.length} stops
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-primary-600">
                {Math.round(((currentStopIndex + 1) / assignedRoute.stops.length) * 100)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
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
                  ? 'bg-primary-100 border-primary-500 border-2'
                  : index < currentStopIndex
                  ? 'bg-green-50'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  index === currentStopIndex
                    ? 'bg-primary-600 text-white'
                    : index < currentStopIndex
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium">{stop.name}</p>
                  <p className="text-xs text-gray-600">{stop.estimatedTime} min from start</p>
                </div>
              </div>
              {index < currentStopIndex && (
                <span className="text-green-600 text-sm font-medium">✓ Completed</span>
              )}
              {index === currentStopIndex && (
                <span className="text-primary-600 text-sm font-medium">● Current</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 card p-0 overflow-hidden" style={{ height: '400px' }}>
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

        {/* Notifications */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Messages</h3>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification._id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Bell size={16} className="text-primary-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{notification.title}</h4>
                    <p className="text-xs text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-center text-gray-500 py-4 text-sm">No messages</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

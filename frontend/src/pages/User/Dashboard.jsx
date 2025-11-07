import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { MapPin, Navigation, Clock, Bus as BusIcon, Radio } from 'lucide-react';
import socketService from '../../utils/socket';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Dashboard = () => {
  const [activeBuses, setActiveBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedBus, setSelectedBus] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [center, setCenter] = useState([28.6139, 77.2090]);
  const [notifications, setNotifications] = useState([]);
  const [liveUpdates, setLiveUpdates] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchRoutes();
    fetchNotifications();
    connectSocket();
    getUserLocation();

    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      fetchBusesByRoute(selectedRoute);
    } else {
      fetchActiveBuses();
    }
  }, [selectedRoute]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          setCenter(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get your location');
        }
      );
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/user/routes');
      setRoutes(response.data.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchActiveBuses = async () => {
    try {
      const response = await api.get('/user/active-buses');
      setActiveBuses(response.data.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const fetchBusesByRoute = async (routeId) => {
    try {
      const response = await api.get(`/user/buses/route/${routeId}`);
      setActiveBuses(response.data.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/user/notifications');
      setNotifications(response.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const connectSocket = () => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      console.log('✅ User connected to socket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected from socket');
      setIsConnected(false);
    });

    // Listen for real-time bus location updates
    socket.on('bus:location-updated', (data) => {
      console.log('📍 Bus location updated:', data);
      setLiveUpdates(prev => prev + 1); // Increment counter for visual feedback
      
      setActiveBuses(prev => {
        const index = prev.findIndex(b => b._id === data.busId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            currentLocation: data.location,
            currentStop: data.currentStop,
            nextStop: data.nextStop,
            status: data.status,
            lastUpdate: data.timestamp
          };
          return updated;
        }
        return prev;
      });

      // Update selected bus if it's the one being updated
      if (selectedBus && selectedBus._id === data.busId) {
        setSelectedBus(prev => ({
          ...prev,
          currentLocation: data.location,
          currentStop: data.currentStop,
          nextStop: data.nextStop
        }));
        
        // Update map center to follow the bus
        if (data.location && data.location.coordinates) {
          setCenter([data.location.coordinates[1], data.location.coordinates[0]]);
        }
      }
    });

    // Listen for trip start events
    socket.on('bus:trip-started', (data) => {
      console.log('🚀 Bus trip started:', data);
      toast.success('A bus has started its trip!', { icon: '🚌' });
      fetchActiveBuses();
    });

    // Listen for trip stop events
    socket.on('bus:trip-stopped', (data) => {
      console.log('🛑 Bus trip stopped:', data);
      setActiveBuses(prev => prev.filter(b => b._id !== data.busId));
    });

    socket.on('notification:broadcast', (data) => {
      toast(data.message, {
        icon: '📢',
        duration: 5000,
      });
      fetchNotifications();
    });
  };

  const calculateETA = (bus) => {
    if (!userLocation || !bus.currentLocation) return 'N/A';
    
    const R = 6371; // Earth's radius in km
    const dLat = (userLocation[0] - bus.currentLocation.coordinates[1]) * Math.PI / 180;
    const dLon = (userLocation[1] - bus.currentLocation.coordinates[0]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(bus.currentLocation.coordinates[1] * Math.PI / 180) * 
              Math.cos(userLocation[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    const avgSpeed = 30; // km/h
    const eta = Math.round((distance / avgSpeed) * 60);
    return `~${eta} min`;
  };

  const handleTrackBus = (bus) => {
    setSelectedBus(bus);
    setCenter([bus.currentLocation.coordinates[1], bus.currentLocation.coordinates[0]]);
    
    // Add to trip history
    if (bus.assignedRoute) {
      api.post('/user/trip-history', {
        route: bus.assignedRoute._id,
        bus: bus._id
      }).catch(err => console.error('Error saving trip history:', err));
    }
  };

  const selectedRouteData = routes.find(r => r._id === selectedRoute);

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Header with Live Indicator */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Live Bus Tracking</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">Track buses in real-time</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="relative">
            <Radio className={`text-green-600 dark:text-green-400 ${isConnected ? 'animate-pulse' : ''}`} size={20} />
            {isConnected && (
              <span className="absolute top-0 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-green-900 dark:text-green-300">
              {isConnected ? 'LIVE' : 'Connecting...'}
            </p>
            <p className="text-xs text-green-700 dark:text-green-400">
              {liveUpdates} updates
            </p>
          </div>
        </div>
      </div>

      {/* Route Selection */}
      <div className="card dark:bg-dark-800 dark:border-dark-700">
        <label className="label text-sm md:text-base dark:text-gray-300">Select Route</label>
        <select
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          className="input text-sm md:text-base dark:bg-dark-900 dark:border-dark-600 dark:text-white"
        >
          <option value="">All Routes</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.routeNumber} - {route.routeName}
            </option>
          ))}
        </select>
      </div>

      {/* Map */}
      <div className="card dark:bg-dark-800 dark:border-dark-700 p-0 overflow-hidden" style={{ height: '400px', minHeight: '300px' }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* User Location */}
          {userLocation && (
            <>
              <Marker position={userLocation}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold">📍 Your Location</p>
                  </div>
                </Popup>
              </Marker>
              <Circle center={userLocation} radius={200} color="blue" fillOpacity={0.1} />
            </>
          )}

          {/* Route Path */}
          {selectedRouteData && selectedRouteData.stops && (
            <Polyline
              positions={selectedRouteData.stops.map(stop => [
                stop.location.coordinates[1],
                stop.location.coordinates[0]
              ])}
              color="blue"
              weight={3}
              opacity={0.7}
            />
          )}

          {/* Bus Markers */}
          {activeBuses.map((bus) => {
            if (!bus.currentLocation || !bus.currentLocation.coordinates) return null;
            
            const position = [
              bus.currentLocation.coordinates[1],
              bus.currentLocation.coordinates[0]
            ];

            return (
              <Marker key={bus._id} position={position}>
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg mb-2">🚌 {bus.busNumber}</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Driver:</strong> {bus.assignedDriver?.name || 'N/A'}</p>
                      <p><strong>Route:</strong> {bus.assignedRoute?.routeNumber || 'N/A'}</p>
                      <p><strong>Current:</strong> {bus.currentStop || 'N/A'}</p>
                      <p><strong>Next:</strong> {bus.nextStop || 'N/A'}</p>
                      <p><strong>ETA:</strong> {calculateETA(bus)}</p>
                    </div>
                    <button
                      onClick={() => handleTrackBus(bus)}
                      className="btn btn-primary w-full mt-2 text-sm"
                    >
                      Track This Bus
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Route Stops */}
          {selectedRouteData && selectedRouteData.stops && selectedRouteData.stops.map((stop, index) => (
            <Marker
              key={index}
              position={[stop.location.coordinates[1], stop.location.coordinates[0]]}
              icon={L.divIcon({
                className: 'custom-stop-marker',
                html: `<div style="background-color: white; border: 2px solid #2563eb; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px;">${index + 1}</div>`,
                iconSize: [24, 24]
              })}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold">{stop.name}</h4>
                  <p className="text-sm text-gray-600">Stop {index + 1}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Active Buses */}
        <div className="lg:col-span-2 card dark:bg-dark-800 dark:border-dark-700">
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 dark:text-white">Available Buses</h3>
          <div className="space-y-3 max-h-80 md:max-h-96 overflow-y-auto">
            {activeBuses.map((bus) => (
              <div
                key={bus._id}
                className={`p-3 md:p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                  selectedBus?._id === bus._id 
                    ? 'border-primary-500 bg-primary-50 dark:border-purple-500 dark:bg-purple-900/20' 
                    : 'border-gray-200 dark:border-dark-600 dark:bg-dark-700/50'
                }`}
                onClick={() => handleTrackBus(bus)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <BusIcon className="text-primary-600 dark:text-purple-400" size={20} />
                    <div>
                      <h4 className="font-bold text-sm md:text-base dark:text-white">{bus.busNumber}</h4>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        {bus.assignedRoute?.routeNumber} - {bus.assignedRoute?.routeName}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">
                    Online
                  </span>
                </div>
                <div className="mt-2 md:mt-3 grid grid-cols-2 gap-2 text-xs md:text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Current Stop</p>
                    <p className="font-medium truncate dark:text-white">{bus.currentStop || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Next Stop</p>
                    <p className="font-medium truncate dark:text-white">{bus.nextStop || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">ETA to You</p>
                    <p className="font-medium flex items-center gap-1 dark:text-white">
                      <Clock size={14} />
                      {calculateETA(bus)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {activeBuses.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm md:text-base py-8">No buses available on this route</p>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="card dark:bg-dark-800 dark:border-dark-700">
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 dark:text-white">Recent Notifications</h3>
          <div className="space-y-2 md:space-y-3 max-h-80 md:max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification._id} className="p-3 bg-gray-50 dark:bg-dark-700/50 rounded-lg border border-gray-100 dark:border-dark-600">
                <h4 className="font-medium text-xs md:text-sm mb-1 dark:text-white">{notification.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-xs md:text-sm">No new notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Bus as BusIcon, Navigation } from 'lucide-react';
import socketService from '../../utils/socket';
import api from '../../utils/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LiveTracking = () => {
  const [activeBuses, setActiveBuses] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [routes, setRoutes] = useState([]);
  const [center, setCenter] = useState([28.6139, 77.2090]); // Default: Delhi

  useEffect(() => {
    fetchRoutes();
    connectSocket();
    fetchActiveBuses();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/routes');
      setRoutes(response.data.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchActiveBuses = async () => {
    try {
      const response = await api.get('/buses');
      const buses = response.data.data.map(bus => ({
        busId: bus._id,
        busNumber: bus.busNumber,
        location: {
          coordinates: bus.currentLocation.coordinates
        },
        currentStop: bus.currentStop,
        nextStop: bus.nextStop,
        status: bus.status,
        driver: bus.assignedDriver,
        route: bus.assignedRoute
      }));
      setActiveBuses(buses);
    } catch (error) {
      console.error('Error fetching active buses:', error);
    }
  };

  const connectSocket = () => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      console.log('✅ Admin connected to socket');
      // Request all active buses on connect
      socket.emit('get:active-buses');
    });

    // Listen for real-time bus location updates
    socket.on('bus:location-updated', (data) => {
      console.log('📍 Admin received bus location update:', data);
      
      setActiveBuses(prev => {
        const index = prev.findIndex(b => b.busId === data.busId);
        if (index !== -1) {
          // Update existing bus
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            location: data.location,
            currentStop: data.currentStop,
            nextStop: data.nextStop,
            status: data.status,
            lastUpdate: data.timestamp
          };
          return updated;
        } else {
          // Add new bus if not in list
          return [...prev, data];
        }
      });
    });

    socket.on('bus:trip-started', (data) => {
      console.log('🚀 Bus trip started:', data);
      fetchActiveBuses();
    });

    socket.on('bus:trip-stopped', (data) => {
      console.log('🛑 Bus trip stopped:', data);
      setActiveBuses(prev => prev.filter(b => b.busId !== data.busId));
    });

    socket.on('bus:disconnected', (data) => {
      console.log('🔌 Bus disconnected:', data);
      setActiveBuses(prev => prev.filter(b => b.busId !== data.busId));
    });

    // Receive list of active buses
    socket.on('active-buses', (buses) => {
      console.log('📋 Received active buses:', buses);
      if (buses && buses.length > 0) {
        setActiveBuses(buses);
      }
    });
  };

  const filteredBuses = selectedRoute
    ? activeBuses.filter(bus => bus.route?._id === selectedRoute)
    : activeBuses;

  const selectedRouteData = routes.find(r => r._id === selectedRoute);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live Bus Tracking</h1>
        <p className="text-gray-600 mt-1">Monitor all buses in real-time</p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="label">Filter by Route</label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="input"
            >
              <option value="">All Routes</option>
              {routes.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.routeNumber} - {route.routeName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-medium">Active Buses:</span> {filteredBuses.length}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="card p-0 overflow-hidden" style={{ height: '600px' }}>
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

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
          {filteredBuses.map((bus) => {
            const position = [
              bus.location.coordinates[1] || 0,
              bus.location.coordinates[0] || 0
            ];

            return (
              <Marker key={bus.busId} position={position}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-2">🚌 {bus.busNumber}</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Driver:</strong> {bus.driver?.name || 'N/A'}</p>
                      <p><strong>Route:</strong> {bus.route?.routeNumber || 'N/A'}</p>
                      <p><strong>Current Stop:</strong> {bus.currentStop || 'N/A'}</p>
                      <p><strong>Next Stop:</strong> {bus.nextStop || 'N/A'}</p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className={`px-2 py-1 rounded text-xs ${
                          bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bus.status}
                        </span>
                      </p>
                    </div>
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
                  <p className="text-sm">Est. Time: {stop.estimatedTime} min</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Active Buses List */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Active Buses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuses.map((bus) => (
            <div key={bus.busId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BusIcon className="text-primary-600" size={20} />
                  <h4 className="font-bold">{bus.busNumber}</h4>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  Online
                </span>
              </div>
              <div className="text-sm space-y-1 text-gray-600">
                <p><strong>Driver:</strong> {bus.driver?.name || 'N/A'}</p>
                <p><strong>Route:</strong> {bus.route?.routeNumber || 'N/A'}</p>
                <p><strong>Current:</strong> {bus.currentStop || 'N/A'}</p>
                <p><strong>Next:</strong> {bus.nextStop || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
        {filteredBuses.length === 0 && (
          <p className="text-center text-gray-500 py-8">No active buses at the moment</p>
        )}
      </div>
    </div>
  );
};

export default LiveTracking;

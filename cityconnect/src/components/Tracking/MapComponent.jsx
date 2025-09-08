import React, { useEffect, useRef, useState } from 'react';
import { 
  FaLocationArrow, 
  FaPlus, 
  FaMinus, 
  FaFilter,
  FaInfoCircle 
} from 'react-icons/fa';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedBus, setSelectedBus] = useState('BUS101');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    showBuses: true,
    showStops: true,
    showRoutes: true,
    trafficLayer: false
  });

  // Sample bus data
  const [buses, setBuses] = useState([
    { id: 'BUS101', lat: 28.6139, lng: 77.2090, route: 'Downtown Loop' },
    { id: 'BUS202', lat: 28.6200, lng: 77.2020, route: 'University Express' },
    { id: 'BUS305', lat: 28.6080, lng: 77.2150, route: 'Riverfront Line' },
    { id: 'BUS418', lat: 28.6180, lng: 77.2250, route: 'East-West Connector' }
  ]);

  // Sample bus stops
  const busStops = [
    { name: 'Central Library', lat: 28.6100, lng: 77.2070 },
    { name: 'Tech Park', lat: 28.6150, lng: 77.2120 },
    { name: 'Museum Rd', lat: 28.6050, lng: 77.2100 },
    { name: 'Oak Street', lat: 28.6220, lng: 77.2200 },
    { name: 'City Center', lat: 28.6139, lng: 77.2085 },
    { name: 'Railway Station', lat: 28.6170, lng: 77.2130 }
  ];

  // Sample route coordinates
  const route101 = [
    [28.6139, 77.2085], [28.6120, 77.2080], [28.6100, 77.2070],
    [28.6085, 77.2080], [28.6070, 77.2090], [28.6080, 77.2110],
    [28.6090, 77.2120], [28.6100, 77.2130], [28.6110, 77.2140],
    [28.6120, 77.2150], [28.6130, 77.2160], [28.6140, 77.2150],
    [28.6150, 77.2140], [28.6160, 77.2130], [28.6170, 77.2120],
    [28.6180, 77.2110], [28.6170, 77.2090], [28.6155, 77.2085],
    [28.6139, 77.2085]
  ];

  useEffect(() => {
    // Initialize the map
    const initializeMap = () => {
      if (mapRef.current && !map) {
        const leaflet = window.L;
        if (leaflet) {
          const mapInstance = leaflet.map(mapRef.current).setView([28.6139, 77.2090], 13);
          
          // Add OpenStreetMap tiles
          leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapInstance);
          
          setMap(mapInstance);
          
          // Add route line
          leaflet.polyline(route101, {
            color: '#0066CC',
            weight: 5,
            opacity: 0.7
          }).addTo(mapInstance);
          
          // Add bus markers
          buses.forEach(bus => {
            const busIcon = leaflet.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097140.png',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            });
            
            leaflet.marker([bus.lat, bus.lng], { icon: busIcon })
              .addTo(mapInstance)
              .bindPopup(`<b>${bus.id}</b><br>${bus.route}`);
          });
          
          // Add bus stop markers
          busStops.forEach(stop => {
            const stopIcon = leaflet.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
            
            leaflet.marker([stop.lat, stop.lng], { icon: stopIcon })
              .addTo(mapInstance)
              .bindPopup(`<b>${stop.name}</b><br>Bus Stop`);
          });
        }
      }
    };

    // Load Leaflet dynamically
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = initializeMap;
      document.head.appendChild(script);
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    } else {
      initializeMap();
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Simulate bus movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.001,
          lng: bus.lng + (Math.random() - 0.5) * 0.001
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLocate = () => {
    if (map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.setView([position.coords.latitude, position.coords.longitude], 15);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please ensure location services are enabled.');
        }
      );
    }
  };

  const handleZoomIn = () => {
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    if (map) map.zoomOut();
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleFilterChange = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handleViewDetails = () => {
    alert(`Viewing details for ${selectedBus}`);
  };

  const handleSetAlert = () => {
    alert(`Setting alert for ${selectedBus}`);
  };

  return (
    <div className="map-container">
      <div ref={mapRef} id="map"></div>
      
      <div className="map-controls">
        <button className="control-btn" title="Locate me" onClick={handleLocate}>
          <FaLocationArrow />
        </button>
        <button className="control-btn" title="Zoom in" onClick={handleZoomIn}>
          <FaPlus />
        </button>
        <button className="control-btn" title="Zoom out" onClick={handleZoomOut}>
          <FaMinus />
        </button>
        <button className="control-btn" title="Filter options" onClick={toggleFilter}>
          <FaFilter />
        </button>
      </div>
      
      {isFilterVisible && (
        <div className="filter-panel">
          <div className="filter-title">
            <FaFilter />
            <span>Map Filters</span>
          </div>
          <div className="filter-options">
            <div className="filter-option">
              <input 
                type="checkbox" 
                id="show-buses" 
                checked={filters.showBuses}
                onChange={() => handleFilterChange('showBuses')}
              />
              <label htmlFor="show-buses">Show Buses</label>
            </div>
            <div className="filter-option">
              <input 
                type="checkbox" 
                id="show-stops" 
                checked={filters.showStops}
                onChange={() => handleFilterChange('showStops')}
              />
              <label htmlFor="show-stops">Show Stops</label>
            </div>
            <div className="filter-option">
              <input 
                type="checkbox" 
                id="show-routes" 
                checked={filters.showRoutes}
                onChange={() => handleFilterChange('showRoutes')}
              />
              <label htmlFor="show-routes">Show Routes</label>
            </div>
            <div className="filter-option">
              <input 
                type="checkbox" 
                id="traffic-layer" 
                checked={filters.trafficLayer}
                onChange={() => handleFilterChange('trafficLayer')}
              />
              <label htmlFor="traffic-layer">Traffic Layer</label>
            </div>
          </div>
        </div>
      )}
      
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color legend-bus"></div>
          <div className="legend-label">Buses</div>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-stop"></div>
          <div className="legend-label">Bus Stops</div>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-route"></div>
          <div className="legend-label">Routes</div>
        </div>
      </div>
      
      <div className="map-overlay">
        <div className="overlay-info">
          <div className="overlay-title">Bus 101 - Downtown Loop</div>
          <div className="overlay-subtitle">Next stop: Central Library (ETA 4 min)</div>
        </div>
        <div className="overlay-actions">
          <button className="action-btn" onClick={handleViewDetails}>
            <FaInfoCircle />
            <span>View Details</span>
          </button>
          <button className="action-btn" onClick={handleSetAlert}>
            Set Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
import React, { useState, useEffect } from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import NavSidebar from '../components/AuthorityDashboard/NavSidebar';
import MetricsGrid from '../components/AuthorityDashboard/MetricsGrid';

const AuthorityDashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [timeFilter, setTimeFilter] = useState('Today');

  // Initialize map when component mounts
  useEffect(() => {
    const initializeMap = () => {
      if (window.L && !document.getElementById('map').hasChildNodes()) {
        const map = window.L.map('map').setView([28.6139, 77.2090], 12);
        
        // Add OpenStreetMap tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add sample bus markers
        const busIcon = window.L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097140.png',
          iconSize: [25, 25],
          iconAnchor: [12, 12]
        });

        const busLocations = [
          { id: 'BUS-1027', lat: 28.6139, lng: 77.2090, route: '101 - Downtown Loop' },
          { id: 'BUS-2043', lat: 28.6200, lng: 77.2020, route: '202 - University Express' },
          { id: 'BUS-3056', lat: 28.6080, lng: 77.2150, route: '305 - Riverfront Line' },
          { id: 'BUS-1124', lat: 28.6150, lng: 77.2210, route: '101 - Downtown Loop' },
        ];

        busLocations.forEach(bus => {
          window.L.marker([bus.lat, bus.lng], { icon: busIcon })
            .addTo(map)
            .bindPopup(`<b>${bus.id}</b><br>${bus.route}`);
        });

        // Add incident markers
        const incidentIcon = window.L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png',
          iconSize: [25, 25],
          iconAnchor: [12, 12]
        });

        const incidentLocations = [
          { id: 'INC-001', lat: 28.6100, lng: 77.2070, type: 'Accident', severity: 'High' },
          { id: 'INC-002', lat: 28.6180, lng: 77.2130, type: 'Mechanical', severity: 'Medium' },
        ];

        incidentLocations.forEach(incident => {
          window.L.marker([incident.lat, incident.lng], { icon: incidentIcon })
            .addTo(map)
            .bindPopup(`<b>${incident.type}</b><br>Severity: ${incident.severity}`);
        });
      }
    };

    // Load Leaflet if not already loaded
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup map when component unmounts
      if (window.L && window.L.map) {
        window.L.map('map').remove();
      }
    };
  }, []);

  return (
    <div className="authority-dashboard">
      <header>
        <div className="logo">
          <FaShieldAlt />
          <h1>CityConnect</h1>
        </div>
        <div className="authority-info">
          <div className="authority-avatar">
            <FaShieldAlt />
          </div>
          <div className="authority-name">Traffic Control Center</div>
        </div>
      </header>

      <div className="main-container">
        <NavSidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        <MetricsGrid timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
      </div>
    </div>
  );
};

export default AuthorityDashboard;
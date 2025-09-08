import React from 'react';
import { FaChartLine, FaChartPie, FaExclamationTriangle, FaBus, FaBullhorn } from 'react-icons/fa';

const MetricsGrid = ({ timeFilter, setTimeFilter }) => {
  const stats = [
    { value: '97%', label: 'System Uptime' },
    { value: '42', label: 'Active Buses' },
    { value: '92%', label: 'On-Time Performance' },
    { value: '3', label: 'Active Incidents' }
  ];

  const incidents = [
    {
      id: 'INC-001',
      title: 'Accident on Route 101',
      description: 'Bus 1027 involved in minor collision',
      time: '15 min ago',
      status: 'new'
    },
    {
      id: 'INC-002',
      title: 'Mechanical Failure',
      description: 'Bus 2043 engine trouble',
      time: '42 min ago',
      status: 'inprogress'
    },
    {
      id: 'INC-003',
      title: 'Road Closure',
      description: 'Main Street closed for parade',
      time: '1 hr ago',
      status: 'inprogress'
    },
    {
      id: 'INC-004',
      title: 'Medical Emergency',
      description: 'Passenger assistance required',
      time: '2 hrs ago',
      status: 'resolved'
    }
  ];

  const vehicles = [
    {
      id: 'BUS-1027',
      route: 'Route 101 - Downtown Loop',
      status: 'active',
      performance: '94% On Time'
    },
    {
      id: 'BUS-2043',
      route: 'Route 202 - University Express',
      status: 'delayed',
      performance: '87% On Time'
    },
    {
      id: 'BUS-3056',
      route: 'Route 305 - Riverfront Line',
      status: 'active',
      performance: '91% On Time'
    },
    {
      id: 'BUS-4189',
      route: 'Route 418 - East-West Connector',
      status: 'inactive',
      performance: '89% On Time'
    }
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'inprogress': return 'status-inprogress';
      case 'resolved': return 'status-resolved';
      case 'active': return 'status-active';
      case 'delayed': return 'status-delayed';
      case 'inactive': return 'status-inactive';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'delayed': return 'status-delayed';
      case 'inactive': return 'status-inactive';
      default: return '';
    }
  };

  return (
    <div className="metrics-grid">
      <div className="dashboard-header">
        <div className="section-title">Authority Dashboard</div>
        <div className="time-filter">
          {['Today', 'Week', 'Month'].map(filter => (
            <button
              key={filter}
              className={`time-btn ${timeFilter === filter ? 'active' : ''}`}
              onClick={() => setTimeFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card card-full">
          <div className="card-title">
            <FaMapMarkedAlt />
            <span>Live Network Map</span>
          </div>
          <div className="map-container">
            <div id="map"></div>
            <div className="map-legend">
              <div className="legend-title">Map Legend</div>
              <div className="legend-item">
                <div className="legend-color legend-bus"></div>
                <div>Active Buses</div>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-incident"></div>
                <div>Incidents</div>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-stop"></div>
                <div>Bus Stops</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <FaExclamationTriangle />
            <span>Active Incidents</span>
          </div>
          <ul className="incident-list">
            {incidents.slice(0, 4).map(incident => (
              <li key={incident.id} className="incident-item">
                <div className="incident-info">
                  <div className="incident-title">{incident.title}</div>
                  <div className="incident-desc">{incident.description}</div>
                </div>
                <div className="incident-meta">
                  <div className="incident-time">{incident.time}</div>
                  <span className={`incident-status ${getStatusClass(incident.status)}`}>
                    {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="action-bar">
            <button className="action-btn">View All Incidents</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <FaBus />
            <span>Fleet Status</span>
          </div>
          <ul className="vehicle-list">
            {vehicles.map(vehicle => (
              <li key={vehicle.id} className="vehicle-item">
                <div className="vehicle-info">
                  <div className="vehicle-id">{vehicle.id}</div>
                  <div className="vehicle-route">{vehicle.route}</div>
                </div>
                <div className="vehicle-meta">
                  <div>
                    <span className={`vehicle-status ${getStatusIcon(vehicle.status)}`}></span>
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </div>
                  <div>{vehicle.performance}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="action-bar">
            <button className="action-btn">Fleet Overview</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <FaChartPie />
            <span>System Metrics</span>
          </div>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-half">
          <div className="card-title">
            <FaChartLine />
            <span>Passenger Volume Trends</span>
          </div>
          <div className="chart-container">
            <div className="chart-placeholder">
              <FaChartBar />
              <span>Passenger Volume Chart</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <FaBullhorn />
            <span>Quick Actions</span>
          </div>
          <div className="quick-actions">
            <button className="action-btn">
              <FaBullhorn />
              <span>Send System Alert</span>
            </button>
            <button className="action-btn">
              <FaMapMarkedAlt />
              <span>Adjust Routes</span>
            </button>
            <button className="action-btn alert">
              <FaExclamationTriangle />
              <span>Emergency Protocol</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsGrid;
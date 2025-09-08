import React from 'react';
import { 
  FaTachometerAlt, 
  FaMapMarkedAlt, 
  FaExclamationCircle, 
  FaBus, 
  FaChartBar, 
  FaCog,
  FaNetworkWired,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const NavSidebar = ({ activeNav, setActiveNav }) => {
  const navItems = [
    { id: 'dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { id: 'network', icon: <FaMapMarkedAlt />, label: 'Network Overview' },
    { id: 'incidents', icon: <FaExclamationCircle />, label: 'Incident Management' },
    { id: 'fleet', icon: <FaBus />, label: 'Fleet Management' },
    { id: 'analytics', icon: <FaChartBar />, label: 'Analytics & Reports' },
    { id: 'settings', icon: <FaCog />, label: 'System Settings' }
  ];

  const systemStatus = [
    { label: 'API Server', status: 'online' },
    { label: 'Database', status: 'online' },
    { label: 'GPS Tracking', status: 'online' },
    { label: 'Notification System', status: 'online' }
  ];

  return (
    <div className="sidebar">
      <div className="nav-items">
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="system-status">
        <div className="status-title">
          <FaNetworkWired />
          <span>System Status</span>
        </div>
        {systemStatus.map((item, index) => (
          <div key={index} className="status-item">
            <span>{item.label}</span>
            <span className={`status-value ${item.status === 'online' ? 'status-on' : 'status-off'}`}>
              {item.status === 'online' ? <FaCheckCircle /> : <FaTimesCircle />}
              {item.status === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavSidebar;
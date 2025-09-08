import React, { useState } from 'react';
import { FaExclamationCircle, FaCog, FaBell, FaHistory } from 'react-icons/fa';
import AlertFilters from '../components/Alerts/AlertFilters';
import AlertList from '../components/Alerts/AlertList';

const Alerts = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notificationPrefs, setNotificationPrefs] = useState({
    push: true,
    email: true,
    sms: false
  });

  // Sample alert data
  const alerts = [
    {
      id: 1,
      title: 'Major Delay on Route 101',
      time: 'Updated 15 min ago',
      route: 'Route 101 • Downtown Loop',
      description: 'Due to an accident on Main Street, Route 101 is experiencing significant delays of approximately 20-25 minutes. Expect longer wait times.',
      severity: 'critical',
      type: 'active',
      details: {
        started: 'Today, 8:15 AM',
        expectedEnd: 'Today, 11:30 AM',
        affectedStops: 'Central Library to City Hall',
        alternatives: 'Consider Routes 202 or 305 as alternatives'
      }
    },
    {
      id: 2,
      title: 'Road Construction on Oak Street',
      time: 'Updated 1 hour ago',
      route: 'Route 418 • East-West Connector',
      description: 'Ongoing road construction on Oak Street is causing minor delays of 5-10 minutes on Route 418. Temporary stop relocation at Oak & Pine.',
      severity: 'normal',
      type: 'active',
      details: {
        started: 'September 10, 7:00 AM',
        expectedEnd: 'September 15, 5:00 PM',
        affectedStops: 'Oak Street stop temporarily moved to Oak & Maple'
      }
    },
    {
      id: 3,
      title: 'Weekend Service Adjustment',
      time: 'Starts tomorrow',
      route: 'Multiple Routes',
      description: 'This weekend (Sept 16-17), Routes 101 and 202 will operate on a modified Saturday schedule due to the City Marathon. Expect increased frequency during peak hours.',
      severity: 'normal',
      type: 'planned',
      details: {
        started: 'September 16, 2023',
        expectedEnd: 'September 17, 2023',
        affectedStops: 'All stops on Routes 101, 202, 305',
        alternatives: 'Additional buses during peak hours'
      }
    },
    {
      id: 4,
      title: 'Signal Issue Fixed',
      time: 'Resolved today',
      route: 'Route 305 • Riverfront Line',
      description: 'The signal issue at Museum Road has been resolved. Route 305 has resumed normal service with regular frequency.',
      severity: 'resolved',
      type: 'resolved',
      details: {
        started: 'Today, 9:30 AM',
        expectedEnd: 'Today, 10:45 AM',
        affectedStops: 'Museum Road to Railway Station'
      }
    }
  ];

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const toggleNotificationPref = (pref) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [pref]: !prev[pref]
    }));
  };

  return (
    <div className="main-container">
      <div className="alerts-container">
        <div className="alerts-header">
          <h2><FaExclamationCircle /> Service Alerts</h2>
          <AlertFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />
        </div>
        
        <AlertList alerts={alerts} filter={activeFilter} />
      </div>
      
      <div className="sidebar">
        <div className="sidebar-title">
          <FaCog />
          <span>Alert Preferences</span>
        </div>
        
        <div className="notification-prefs">
          <div className="pref-item">
            <span className="pref-label">Push Notifications</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={notificationPrefs.push}
                onChange={() => toggleNotificationPref('push')}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="pref-item">
            <span className="pref-label">Email Alerts</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={notificationPrefs.email}
                onChange={() => toggleNotificationPref('email')}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="pref-item">
            <span className="pref-label">SMS Alerts</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={notificationPrefs.sms}
                onChange={() => toggleNotificationPref('sms')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
        
        <div className="sidebar-title">
          <FaBell />
          <span>Subscribe to Updates</span>
        </div>
        
        <div className="subscribe-box">
          <p>Get real-time alerts for your favorite routes</p>
          <button className="subscribe-btn">Manage Subscriptions</button>
        </div>
        
        <div className="sidebar-title" style={{marginTop: '1.5rem'}}>
          <FaHistory />
          <span>Alert History</span>
        </div>
        
        <div className="subscribe-box">
          <p>View past service alerts and notifications</p>
          <button className="subscribe-btn">View History</button>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
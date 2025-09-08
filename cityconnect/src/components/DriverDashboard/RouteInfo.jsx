import React, { useState, useEffect } from 'react';
import { FaRoute, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const RouteInfo = () => {
  const [routeInfo] = useState({
    route: '101 - Downtown Loop',
    busId: 'BUS-1027',
    startTime: '06:45 AM',
    nextBreak: '10:30 AM'
  });

  const [schedule, setSchedule] = useState([
    { time: '06:45 AM', stop: 'City Center Terminal', status: 'completed' },
    { time: '07:15 AM', stop: 'Main Street Mall', status: 'completed' },
    { time: '07:45 AM', stop: 'City Hall', status: 'completed' },
    { time: '08:20 AM', stop: 'Railway Station', status: 'completed' },
    { time: '08:55 AM', stop: 'Central Library', status: 'upcoming' },
    { time: '09:30 AM', stop: 'University Gate', status: 'upcoming' },
    { time: '10:05 AM', stop: 'Tech Park', status: 'upcoming' },
    { time: '10:40 AM', stop: 'Shopping District', status: 'upcoming' },
    { time: '11:15 AM', stop: 'City Center Terminal', status: 'upcoming' }
  ]);

  // Simulate schedule progression
  useEffect(() => {
    const interval = setInterval(() => {
      setSchedule(prev => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = `${currentHour % 12 || 12}:${currentMinute.toString().padStart(2, '0')} ${currentHour >= 12 ? 'PM' : 'AM'}`;
        
        return prev.map(item => {
          if (item.status === 'upcoming') {
            // Simple simulation - mark as completed if it's past the scheduled time
            const [time, period] = item.time.split(' ');
            const [hour, minute] = time.split(':').map(Number);
            const scheduleHour = period === 'PM' && hour !== 12 ? hour + 12 : hour;
            
            if (currentHour > scheduleHour || (currentHour === scheduleHour && currentMinute >= minute + 2)) {
              return { ...item, status: 'completed' };
            }
          }
          return item;
        });
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'upcoming': return 'status-upcoming';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'upcoming': return 'Upcoming';
      default: return status;
    }
  };

  return (
    <div className="route-info">
      <div className="info-header">
        <FaRoute />
        <h3>Route Information</h3>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Route:</span>
          <span className="info-value">{routeInfo.route}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Bus ID:</span>
          <span className="info-value">{routeInfo.busId}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Started At:</span>
          <span className="info-value">{routeInfo.startTime}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Next Break:</span>
          <span className="info-value">{routeInfo.nextBreak}</span>
        </div>
      </div>

      <div className="schedule-section">
        <div className="schedule-header">
          <FaClock />
          <h4>Schedule & Stops</h4>
        </div>
        
        <div className="schedule-list">
          {schedule.map((item, index) => (
            <div key={index} className="schedule-item">
              <div className="schedule-time">{item.time}</div>
              <div className="schedule-stop">{item.stop}</div>
              <div className={`schedule-status ${getStatusClass(item.status)}`}>
                {getStatusText(item.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="performance-stats">
        <div className="stats-header">
          <FaMapMarkerAlt />
          <h4>Today's Performance</h4>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">94%</div>
            <div className="stat-label">On-Time Performance</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">127</div>
            <div className="stat-label">Passengers Served</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">38.2</div>
            <div className="stat-label">Distance (km)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">5.2</div>
            <div className="stat-label">Avg. Speed (km/h)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteInfo;
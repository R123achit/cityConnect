import React, { useState, useEffect } from 'react';
import { FaUser, FaExclamationCircle } from 'react-icons/fa';

const StatusPanel = ({ onReportIncident }) => {
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [drivingTime, setDrivingTime] = useState('04:28:15');

  // Simulate driving time counter
  useEffect(() => {
    let interval;
    if (isOnDuty) {
      interval = setInterval(() => {
        setDrivingTime(prev => {
          const [hours, minutes, seconds] = prev.split(':').map(Number);
          let newSeconds = seconds + 1;
          let newMinutes = minutes;
          let newHours = hours;

          if (newSeconds === 60) {
            newSeconds = 0;
            newMinutes += 1;
          }

          if (newMinutes === 60) {
            newMinutes = 0;
            newHours += 1;
          }

          return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isOnDuty]);

  const toggleDutyStatus = () => {
    setIsOnDuty(!isOnDuty);
  };

  return (
    <div className="status-panel">
      <div className="status-card">
        <div className="status-title">Current Status</div>
        <div>
          <span className={`status-indicator ${isOnDuty ? 'status-on' : 'status-off'}`}></span>
          <span>{isOnDuty ? 'On Duty' : 'Off Duty'}</span>
        </div>
        <div className="status-value">{drivingTime}</div>
        <div className="status-subtext">Today's driving time</div>
        <button 
          className={`toggle-btn ${isOnDuty ? 'toggle-on' : 'toggle-off'}`}
          onClick={toggleDutyStatus}
        >
          {isOnDuty ? 'Go Off Duty' : 'Go On Duty'}
        </button>
      </div>

      <div className="driver-info">
        <div className="driver-avatar">
          <FaUser />
        </div>
        <div className="driver-details">
          <div className="driver-name">Rajesh Kumar</div>
          <div className="driver-id">ID: DRV-2047</div>
        </div>
      </div>

      <div className="next-stop">
        <div className="stop-number">5</div>
        <div className="stop-info">
          <div className="stop-name">Central Library</div>
          <div className="stop-eta">ETA: 4 min</div>
        </div>
      </div>

      <button className="incident-btn" onClick={onReportIncident}>
        <FaExclamationCircle />
        <span>Report Incident</span>
      </button>
    </div>
  );
};

export default StatusPanel;
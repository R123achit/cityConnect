import React, { useState } from 'react';
import { FaInfoCircle, FaShareAlt, FaChevronUp, FaChevronDown } from 'react-icons/fa';

const AlertList = ({ alerts, filter }) => {
  const [expandedAlerts, setExpandedAlerts] = useState({});

  const toggleAlertDetails = (alertId) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [alertId]: !prev[alertId]
    }));
  };

  const handleShareAlert = (alertTitle) => {
    alert(`Share this alert: "${alertTitle}"`);
  };

  // Filter alerts based on active filter
  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filter);

  if (filteredAlerts.length === 0) {
    return (
      <div className="no-alerts">
        <div>
          <FaInfoCircle />
          <p>No alerts found for the selected filter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-content">
      {filteredAlerts.map(alert => (
        <div key={alert.id} className={`alert-card ${alert.severity} ${expandedAlerts[alert.id] ? 'expanded' : ''}`}>
          <div className="alert-header">
            <div className="alert-title">{alert.title}</div>
            <div className="alert-time">{alert.time}</div>
          </div>
          <div className="alert-route">{alert.route}</div>
          <div className="alert-desc">{alert.description}</div>
          <div className="alert-actions">
            <button 
              className="action-btn more" 
              onClick={() => toggleAlertDetails(alert.id)}
            >
              {expandedAlerts[alert.id] ? <FaChevronUp /> : <FaInfoCircle />}
              <span>{expandedAlerts[alert.id] ? 'Less Details' : 'More Details'}</span>
            </button>
            <button 
              className="action-btn share" 
              onClick={() => handleShareAlert(alert.title)}
            >
              <FaShareAlt />
              <span>Share</span>
            </button>
          </div>
          
          {expandedAlerts[alert.id] && (
            <div className="alert-details">
              <div className="detail-item">
                <span className="detail-label">Started:</span>
                <span>{alert.details.started}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Expected End:</span>
                <span>{alert.details.expectedEnd}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Affected Stops:</span>
                <span>{alert.details.affectedStops}</span>
              </div>
              {alert.details.alternatives && (
                <div className="detail-item">
                  <span className="detail-label">Alternatives:</span>
                  <span>{alert.details.alternatives}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlertList;
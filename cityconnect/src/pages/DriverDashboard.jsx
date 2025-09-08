import React, { useState } from 'react';
import { FaBus } from 'react-icons/fa';
import StatusPanel from '../components/DriverDashboard/StatusPanel';
import RouteInfo from '../components/DriverDashboard/RouteInfo';
import MapComponent from '../components/Tracking/MapComponent';

const DriverDashboard = () => {
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const handleReportIncident = () => {
    setShowIncidentModal(true);
  };

  const handleCloseModal = () => {
    setShowIncidentModal(false);
  };

  return (
    <div className="driver-dashboard">
      <header>
        <div className="logo">
          <FaBus />
          <h1>CityConnect</h1>
        </div>
        <div className="driver-info">
          <div className="driver-avatar">
            <FaBus />
          </div>
          <div className="driver-name">Rajesh Kumar</div>
        </div>
      </header>

      <div className="main-container">
        <div className="sidebar">
          <StatusPanel onReportIncident={handleReportIncident} />
        </div>

        <div className="main-content">
          <div className="dashboard-row">
            <div className="card card-full">
              <div className="card-title">
                <FaBus />
                <span>Live Route Map</span>
              </div>
              <MapComponent isDriverView={true} />
            </div>
          </div>

          <div className="dashboard-row">
            <RouteInfo />
          </div>
        </div>
      </div>

      {showIncidentModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>
              &times;
            </button>
            <div className="modal-title">
              <FaBus />
              <span>Report Incident</span>
            </div>
            <div className="form-group">
              <label htmlFor="incident-type">Incident Type</label>
              <select id="incident-type">
                <option value="">Select incident type</option>
                <option value="accident">Accident</option>
                <option value="breakdown">Vehicle Breakdown</option>
                <option value="medical">Medical Emergency</option>
                <option value="traffic">Heavy Traffic</option>
                <option value="road_closure">Road Closure</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="incident-details">Details</label>
              <textarea 
                id="incident-details" 
                placeholder="Please provide details about the incident..."
                rows="4"
              ></textarea>
            </div>
            <button className="submit-btn">Submit Report</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
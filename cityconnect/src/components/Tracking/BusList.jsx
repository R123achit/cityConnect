import React from 'react';

const BusList = ({ buses, onBusSelect }) => {
  const handleBusClick = (busId) => {
    if (onBusSelect) {
      onBusSelect(busId);
    }
  };

  return (
    <div className="bus-list">
      {buses.map(bus => (
        <div 
          key={bus.id} 
          className={`bus-card ${bus.selected ? 'selected' : ''}`}
          onClick={() => handleBusClick(bus.id)}
        >
          <div className="bus-header">
            <span className="bus-id">{bus.id}</span>
            <span className="eta">ETA {bus.eta}</span>
          </div>
          <div className="bus-route">{bus.route}</div>
          <div className="bus-stats">
            <span>Next stop: {bus.nextStop}</span>
            <span>{bus.distance}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusList;
import React from 'react';
import { FaFilter, FaExclamationTriangle, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const AlertFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All', icon: <FaFilter /> },
    { id: 'active', label: 'Active', icon: <FaExclamationTriangle /> },
    { id: 'planned', label: 'Planned', icon: <FaCalendarAlt /> },
    { id: 'resolved', label: 'Resolved', icon: <FaCheckCircle /> }
  ];

  return (
    <div className="alert-filters">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.icon}
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AlertFilters;
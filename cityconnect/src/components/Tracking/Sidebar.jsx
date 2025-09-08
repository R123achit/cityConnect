import React, { useState } from 'react';
import { FaSearch, FaBus, FaStar, FaHeart } from 'react-icons/fa';
import BusList from './BusList';

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('nearby');

  const nearbyBuses = [
    {
      id: 'BUS101',
      route: 'Downtown Loop • To City Center',
      nextStop: 'Central Library',
      distance: '2.3 km away',
      eta: '4 min',
      selected: true
    },
    {
      id: 'BUS202',
      route: 'University Express • To North Campus',
      nextStop: 'Tech Park',
      distance: '4.1 km away',
      eta: '7 min',
      selected: false
    },
    {
      id: 'BUS305',
      route: 'Riverfront Line • To Waterfront',
      nextStop: 'Museum Rd',
      distance: '5.8 km away',
      eta: '12 min',
      selected: false
    },
    {
      id: 'BUS418',
      route: 'East-West Connector • To Suburbia',
      nextStop: 'Oak Street',
      distance: '7.2 km away',
      eta: '15 min',
      selected: false
    }
  ];

  const favoriteRoutes = [
    {
      id: 'ROUTE101',
      route: 'Downtown Loop • City Center ↔ Railway Station',
      frequency: 'Every 15 min'
    },
    {
      id: 'ROUTE202',
      route: 'University Express • North Campus ↔ Tech Park',
      frequency: 'Every 20 min'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="sidebar">
      <div className="search-box">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for a route or stop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'nearby' ? 'active' : ''}`}
          onClick={() => setActiveTab('nearby')}
        >
          <FaBus />
          <span>Nearby Buses</span>
        </button>
        <button 
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <FaHeart />
          <span>Favorites</span>
        </button>
      </div>

      {activeTab === 'nearby' ? (
        <>
          <div className="section-title">
            <FaBus />
            <span>Live Buses Near You</span>
          </div>
          <BusList buses={nearbyBuses} />
        </>
      ) : (
        <>
          <div className="section-title">
            <FaStar />
            <span>Favorite Routes</span>
          </div>
          <div className="bus-list">
            {favoriteRoutes.map(route => (
              <div key={route.id} className="bus-card">
                <div className="bus-header">
                  <span className="bus-id">{route.id}</span>
                  <span className="eta">{route.frequency}</span>
                </div>
                <div className="bus-route">{route.route}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
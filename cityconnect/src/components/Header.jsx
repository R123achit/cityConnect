import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBus, FaMapMarkerAlt, FaRoute, FaBell, FaUser, FaBars, FaTimes } from 'react-icons/fa'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header>
      <div className="logo">
        <FaBus />
        <h1>CityConnect</h1>
      </div>
      
      <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      <nav className={isMenuOpen ? 'nav-open' : ''}>
        <ul>
          <li>
            <Link to="/tracking" className={isActive('/tracking') ? 'active' : ''}>
              <FaMapMarkerAlt />
              <span>Live Map</span>
            </Link>
          </li>
          <li>
            <Link to="/tracking" className={isActive('/tracking') ? 'active' : ''}>
              <FaRoute />
              <span>Routes</span>
            </Link>
          </li>
          <li>
            <Link to="/alerts" className={isActive('/alerts') ? 'active' : ''}>
              <FaBell />
              <span>Alerts</span>
            </Link>
          </li>
          <li>
            <Link to="/login" className={isActive('/login') ? 'active' : ''}>
              <FaUser />
              <span>Login</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
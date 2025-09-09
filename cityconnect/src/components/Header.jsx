import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBus, FaMapMarkerAlt, FaRoute, FaBell, FaUser, FaBars, FaTimes } from 'react-icons/fa'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navRef = useRef(null)

  const isActive = (path) => location.pathname === path

  // Close menu on outside click (mobile only)
  useEffect(() => {
    if (!isMenuOpen) return
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target) && !e.target.classList.contains('menu-toggle')) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isMenuOpen])

  return (
    <header>
      <div className="logo">
        <FaBus />
        <h1>CityConnect</h1>
      </div>

      <button className="menu-toggle" onClick={() => setIsMenuOpen((v) => !v)} aria-label="Toggle menu">
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav ref={navRef} className={isMenuOpen ? 'nav-open' : ''}>
        <ul>
          <li>
            <Link to="/tracking" className={isActive('/tracking') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              <FaMapMarkerAlt />
              <span>Live Map</span>
            </Link>
          </li>
          <li>
            <Link to="/tracking" className={isActive('/tracking') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              <FaRoute />
              <span>Routes</span>
            </Link>
          </li>
          <li>
            <Link to="/alerts" className={isActive('/alerts') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
              <FaBell />
              <span>Alerts</span>
            </Link>
          </li>
          <li>
            <Link to="/login" className={isActive('/login') ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
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
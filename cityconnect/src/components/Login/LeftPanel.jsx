import React from 'react'
import { FaBus, FaMapMarkerAlt, FaClock, FaBell, FaRoute, FaUser, FaBars, FaTimes } from 'react-icons/fa'

const LeftPanel = () => {
  return (
    <div className="left-panel">
      <div className="app-name">
        {/* <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iMTAiIGZpbGw9IiMwMDY2Q0MiLz4KPHBhdGggZD0iTTE1IDI1TDMwIDQwTDQ1IDE1IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K" alt="CityConnect Logo" /> */}
        <FaBus className="app-logo" />
        CityConnect
      </div>
      <p className="app-tagline">Real-time bus tracking for smarter commuting</p>
      
      <ul className="features">
        <li><span><FaMapMarkerAlt /></span> Live bus location tracking</li>
        <li><span><FaClock /></span> Accurate arrival predictions</li>
        <li><span><FaBell /></span> Instant delay notifications</li>
        <li><span><FaRoute /></span> Optimal route planning</li>
      </ul>
    </div>
  )
}

export default LeftPanel
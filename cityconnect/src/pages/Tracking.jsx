import React from 'react'
import Sidebar from '../components/Tracking/Sidebar'
import MapComponent from '../components/Tracking/MapComponent'

const Tracking = () => {
  return (
    <div className="main-container">
      <Sidebar />
      <MapComponent />
    </div>
  )
}

export default Tracking
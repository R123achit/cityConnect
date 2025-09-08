import React from 'react'
import { FaUser, FaBus, FaShieldAlt } from 'react-icons/fa'

const UserTypeSelector = ({ userType, setUserType }) => {
  const userTypes = [
    { id: 'passenger-type', icon: <FaUser />, label: 'Passenger' },
    { id: 'driver-type', icon: <FaBus />, label: 'Driver' },
    { id: 'authority-type', icon: <FaShieldAlt />, label: 'Authority' }
  ]

  return (
    <div className="user-type-selector">
      {userTypes.map((type) => (
        <div
          key={type.id}
          className={`user-type ${userType === type.id ? 'active' : ''}`}
          onClick={() => setUserType(type.id)}
        >
          {type.icon}
          <span>{type.label}</span>
        </div>
      ))}
    </div>
  )
}

export default UserTypeSelector
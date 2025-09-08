import React, { useState } from 'react'
import UserTypeSelector from './UserTypeSelector'
import LoginForm from './LoginForm'

const RightPanel = () => {
  const [userType, setUserType] = useState('passenger-type')
  return (
    <div className="right-panel">
      <div className="login-header">
        <h2>Welcome Back</h2>
        <p>Sign in to access your account</p>
      </div>
      <UserTypeSelector userType={userType} setUserType={setUserType} />
      <LoginForm userType={userType} />
    </div>
  )
}

export default RightPanel
import React from 'react'
import LeftPanel from '../components/Login/LeftPanel'
import RightPanel from '../components/Login/RightPanel'
import './Login.css'

const Login = () => {
  return (
    <div className="login-container">
      <LeftPanel />
      <RightPanel />
    </div>
  )
}

export default Login
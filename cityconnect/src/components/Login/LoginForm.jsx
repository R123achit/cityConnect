// src/components/LoginForm.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF } from 'react-icons/fa'

const LoginForm = ({ userType }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()


  const handleSubmit = (e) => {
    e.preventDefault()
    // Use userType prop to determine navigation
    console.log('Login attempt:', { email, password, userType, rememberMe })
    if (userType === 'driver-type') {
      navigate('/driver-dashboard')
    } else if (userType === 'authority-type') {
      navigate('/authority-dashboard')
    } else {
      navigate('/tracking')
    }
  }

  const handleSocialLogin = (provider) => {
    alert(`${provider} login selected`)
  }

  return (
    <form id="login-form" onSubmit={handleSubmit}>
      {/* DEBUG: Show current userType */}
      <div style={{ color: 'red', marginBottom: '8px', fontSize: '0.9em' }}>
        <strong>Selected user type:</strong> {userType}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <div className="input-with-icon">
          <FaEnvelope />
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-with-icon">
          <FaLock />
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="remember-forgot">
        <div className="remember">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember">Remember me</label>
        </div>
        <a href="#" className="forgot-password">Forgot Password?</a>
      </div>
      
      <button type="submit" className="login-btn">Login to Account</button>
      
      <div className="divider">
        <span>Or continue with</span>
      </div>
      
      <div className="social-login">
        <div className="social-btn google" onClick={() => handleSocialLogin('Google')}>
          <FaGoogle />
        </div>
        <div className="social-btn facebook" onClick={() => handleSocialLogin('Facebook')}>
          <FaFacebookF />
        </div>
      </div>
      
      <div className="signup-link">
        Don&apos;t have an account? <a href="#">Sign up now</a>
      </div>
    </form>
  )
}

export default LoginForm

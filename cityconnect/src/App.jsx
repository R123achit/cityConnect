import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Tracking from './pages/Tracking'
import Alerts from './pages/Alerts'
import DriverDashboard from './pages/DriverDashboard'
import AuthorityDashboard from './pages/AuthorityDashboard'
import './App.css'

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
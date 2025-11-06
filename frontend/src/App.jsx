import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import BusManagement from './pages/Admin/BusManagement';
import RouteManagement from './pages/Admin/RouteManagement';
import DriverManagement from './pages/Admin/DriverManagement';
import LiveTracking from './pages/Admin/LiveTracking';
import AlertsNotifications from './pages/Admin/AlertsNotifications';
import Analytics from './pages/Admin/Analytics';
import EmergencyCenter from './pages/Admin/EmergencyCenter';
import AdminProfile from './pages/Admin/Profile';

// User Pages
import UserDashboard from './pages/User/Dashboard';
import UserProfile from './pages/User/Profile';
import TripHistory from './pages/User/TripHistory';

// Driver Pages
import DriverDashboard from './pages/Driver/Dashboard';
import DriverProfile from './pages/Driver/Profile';

// Layout
import Layout from './components/Layout';

function App() {
  const { isAuthenticated, user, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to={`/${user?.role}`} replace />
          ) : (
            <Login />
          )
        } />
        <Route path="/register" element={
          isAuthenticated ? (
            <Navigate to={`/${user?.role}`} replace />
          ) : (
            <Register />
          )
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="buses" element={<BusManagement />} />
          <Route path="routes" element={<RouteManagement />} />
          <Route path="drivers" element={<DriverManagement />} />
          <Route path="tracking" element={<LiveTracking />} />
          <Route path="alerts" element={<AlertsNotifications />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="emergency" element={<EmergencyCenter />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="history" element={<TripHistory />} />
        </Route>

        {/* Driver Routes */}
        <Route path="/driver" element={
          <ProtectedRoute allowedRoles={['driver']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<DriverDashboard />} />
          <Route path="profile" element={<DriverProfile />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={
          isAuthenticated ? (
            <Navigate to={`/${user?.role}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* Unauthorized */}
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

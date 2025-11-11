import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import useAuthStore from './store/authStore';

// Landing Page
import Landing from './pages/Landing';

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
import Tickets from './pages/User/Tickets';

// Driver Pages
import DriverDashboard from './pages/Driver/Dashboard';
import DriverProfile from './pages/Driver/Profile';
import ValidateTicket from './pages/Driver/ValidateTicket';

// Layout
import Layout from './components/Layout';

function App() {
  const { isAuthenticated, user, initializeAuth } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth immediately on mount
    initializeAuth();
    // Set initialized after a brief moment to ensure state is updated
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    // Debug logging
    console.log('🔒 ProtectedRoute check:', {
      isInitialized,
      isAuthenticated,
      userRole: user?.role,
      allowedRoles,
      hasToken: !!localStorage.getItem('token'),
      hasUser: !!localStorage.getItem('user')
    });

    // Wait for auth initialization before redirecting
    if (!isInitialized) {
      console.log('⏳ Waiting for initialization...');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login');
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      console.log('❌ Wrong role:', user?.role, 'Required:', allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }

    console.log('✅ Access granted:', user?.role);
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
          <Route path="tickets" element={<Tickets />} />
        </Route>

        {/* Driver Routes */}
        <Route path="/driver" element={
          <ProtectedRoute allowedRoles={['driver']}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<DriverDashboard />} />
          <Route path="profile" element={<DriverProfile />} />
          <Route path="validate-ticket" element={<ValidateTicket />} />
        </Route>

        {/* Landing & Default Route */}
        <Route path="/" element={<Landing />} />

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

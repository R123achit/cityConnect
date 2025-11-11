import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bus, 
  Route as RouteIcon, 
  Users, 
  MapPin, 
  Bell, 
  BarChart3, 
  AlertCircle, 
  User, 
  LogOut, 
  Menu, 
  X,
  History,
  Moon,
  Sun,
  Ticket,
  QrCode
} from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminMenuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Bus Management', path: '/admin/buses', icon: Bus },
    { name: 'Route Management', path: '/admin/routes', icon: RouteIcon },
    { name: 'Driver Management', path: '/admin/drivers', icon: Users },
    { name: 'Live Tracking', path: '/admin/tracking', icon: MapPin },
    { name: 'Alerts & Notifications', path: '/admin/alerts', icon: Bell },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Emergency Center', path: '/admin/emergency', icon: AlertCircle },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  const userMenuItems = [
    { name: 'Live Tracking', path: '/user', icon: MapPin },
    { name: 'My Tickets', path: '/user/tickets', icon: Ticket },
    { name: 'Trip History', path: '/user/history', icon: History },
    { name: 'Profile', path: '/user/profile', icon: User },
  ];

  const driverMenuItems = [
    { name: 'Dashboard', path: '/driver', icon: LayoutDashboard },
    { name: 'Validate Ticket', path: '/driver/validate-ticket', icon: QrCode },
    { name: 'Profile', path: '/driver/profile', icon: User },
  ];

  const getMenuItems = () => {
    if (user?.role === 'admin') return adminMenuItems;
    if (user?.role === 'driver') return driverMenuItems;
    return userMenuItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 transition-colors duration-300">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-purple-600 dark:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-dark-900 shadow-2xl dark:shadow-dark-glow transform transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-dark-700 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 dark:border-dark-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-800 dark:to-dark-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 dark:from-purple-600 dark:to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">CitiConnect</h1>
                <p className="text-xs font-semibold text-primary-600 dark:text-purple-400 uppercase tracking-wide">{user?.role} Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-600 to-primary-700 dark:from-purple-600 dark:to-purple-700 text-white shadow-lg shadow-primary-500/30 dark:shadow-purple-500/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-dark-800 dark:hover:to-dark-700 hover:text-primary-700 dark:hover:text-purple-400'
                      }`}
                    >
                      <Icon size={20} className={isActive ? '' : 'group-hover:scale-110 transition-transform'} />
                      <span className="text-sm font-semibold">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Theme Toggle & User Info */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-700 bg-gradient-to-r from-gray-50 to-primary-50 dark:from-dark-800 dark:to-dark-700">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-full mb-3 flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-all duration-200 shadow-sm border border-gray-200 dark:border-dark-600"
            >
              {isDark ? (
                <>
                  <Sun size={20} className="text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={20} className="text-purple-600" />
                  <span className="text-sm font-semibold text-gray-700">Dark Mode</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3 mb-3 px-4 py-3 bg-white dark:bg-dark-800 rounded-xl shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 dark:from-purple-500 dark:to-purple-600 flex items-center justify-center shadow-md">
                <User size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-red-600 dark:text-red-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 rounded-xl transition-all duration-200 font-semibold hover:shadow-lg active:scale-95 border-2 border-red-200 dark:border-red-800 hover:border-red-600"
            >
              <LogOut size={20} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0 transition-colors duration-300 relative z-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

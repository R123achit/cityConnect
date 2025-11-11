import { useEffect, useState } from 'react';
import { Bus, Users, Route, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import api from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { overview, busStatusBreakdown, busByType, recentAlerts } = analytics || {};

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const statCards = [
    {
      title: 'Total Buses',
      value: overview?.totalBuses || 0,
      icon: Bus,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Buses',
      value: overview?.activeBuses || 0,
      icon: Activity,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Drivers',
      value: overview?.totalDrivers || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: '+5%'
    },
    {
      title: 'Active Routes',
      value: overview?.totalRoutes || 0,
      icon: Route,
      color: 'bg-orange-500',
      change: '+3%'
    },
    {
      title: 'Total Users',
      value: overview?.totalUsers || 0,
      icon: Users,
      color: 'bg-indigo-500',
      change: '+15%'
    },
    {
      title: 'Active Alerts',
      value: overview?.activeAlerts || 0,
      icon: AlertCircle,
      color: 'bg-red-500',
      change: '-2%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to CitiConnect Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card dark:bg-dark-800 dark:border-dark-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-2 dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="text-white" size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bus Status Breakdown */}
        <div className="card dark:bg-dark-800 dark:border-dark-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Bus Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={busStatusBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, count }) => `${_id}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {busStatusBreakdown?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Buses by Type */}
        <div className="card dark:bg-dark-800 dark:border-dark-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Buses by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={busByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent SOS Alerts */}
      <div className="card dark:bg-dark-800 dark:border-dark-700">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent SOS Alerts</h3>
        {recentAlerts && recentAlerts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-600">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Bus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-600">
                {recentAlerts.map((alert) => (
                  <tr key={alert._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">{alert.driver?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300">{alert.bus?.busNumber || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        alert.status === 'active' ? 'bg-red-100 text-red-800' :
                        alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(alert.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent alerts</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

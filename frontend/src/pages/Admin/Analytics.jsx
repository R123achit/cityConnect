import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import api from '../../utils/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [routeUsage, setRouteUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dashboardRes, routeRes, alertsRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/route-usage'),
        api.get('/analytics/alerts-summary')
      ]);

      setAnalytics({
        ...dashboardRes.data.data,
        alerts: alertsRes.data.data
      });
      setRouteUsage(routeRes.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Visualize usage, delays, and performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Buses</p>
              <h3 className="text-2xl font-bold mt-1">{analytics?.overview?.totalBuses || 0}</h3>
            </div>
            <Activity className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Now</p>
              <h3 className="text-2xl font-bold mt-1">{analytics?.overview?.activeBuses || 0}</h3>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Routes</p>
              <h3 className="text-2xl font-bold mt-1">{analytics?.overview?.totalRoutes || 0}</h3>
            </div>
            <Activity className="text-purple-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">{analytics?.overview?.totalUsers || 0}</h3>
            </div>
            <TrendingUp className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Usage */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Route Usage Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routeUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="routeNumber" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalBuses" fill="#3b82f6" name="Total Buses" />
              <Bar dataKey="activeBuses" fill="#10b981" name="Active Buses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bus Type Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Bus Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.busByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, count }) => `${_id}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics?.busByType?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SOS Alerts Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">SOS Alerts (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.alerts?.alertsByDate || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} name="Alerts" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bus Status Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Bus Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.busStatusBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, count }) => `${_id}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics?.busStatusBreakdown?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Route Performance Table */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Route Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Buses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Buses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stops</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routeUsage.map((route, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {route.routeNumber} - {route.routeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.totalBuses}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {route.activeBuses}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.totalStops}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.distance} km</td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.duration} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SOS Alerts Summary */}
      {analytics?.alerts && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">SOS Alerts Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold">{analytics.alerts.summary.totalAlerts}</p>
              <p className="text-sm text-gray-600">Total Alerts</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{analytics.alerts.summary.activeAlerts}</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{analytics.alerts.summary.acknowledgedAlerts}</p>
              <p className="text-sm text-gray-600">Acknowledged</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{analytics.alerts.summary.resolvedAlerts}</p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

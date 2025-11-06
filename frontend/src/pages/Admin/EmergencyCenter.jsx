import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import socketService from '../../utils/socket';

const EmergencyCenter = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    connectSocket();

    return () => {
      socketService.off('admin:sos-alert');
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/admin/sos-alerts');
      setAlerts(response.data.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectSocket = () => {
    const socket = socketService.connect();
    
    socket.on('admin:sos-alert', (data) => {
      toast.error(`🚨 New SOS Alert from ${data.driver?.name}!`, {
        duration: 5000,
      });
      fetchAlerts();
    });
  };

  const handleAcknowledge = async (alertId) => {
    try {
      await api.put(`/admin/sos-alerts/${alertId}/acknowledge`);
      toast.success('Alert acknowledged');
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to acknowledge alert');
    }
  };

  const handleResolve = async (alertId) => {
    const notes = prompt('Enter resolution notes:');
    if (notes === null) return;

    try {
      await api.put(`/admin/sos-alerts/${alertId}/resolve`, { notes });
      toast.success('Alert resolved');
      fetchAlerts();
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  const filteredAlerts = filter === 'all'
    ? alerts
    : alerts.filter(alert => alert.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Emergency Center</h1>
        <p className="text-gray-600 mt-1">Monitor and respond to SOS alerts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600" size={32} />
            <div>
              <p className="text-sm text-red-600">Active Alerts</p>
              <h3 className="text-2xl font-bold text-red-900">
                {alerts.filter(a => a.status === 'active').length}
              </h3>
            </div>
          </div>
        </div>

        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-600" size={32} />
            <div>
              <p className="text-sm text-yellow-600">Acknowledged</p>
              <h3 className="text-2xl font-bold text-yellow-900">
                {alerts.filter(a => a.status === 'acknowledged').length}
              </h3>
            </div>
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={32} />
            <div>
              <p className="text-sm text-green-600">Resolved</p>
              <h3 className="text-2xl font-bold text-green-900">
                {alerts.filter(a => a.status === 'resolved').length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`btn ${filter === 'active' ? 'btn-danger' : 'btn-secondary'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('acknowledged')}
            className={`btn ${filter === 'acknowledged' ? 'btn-secondary' : 'btn-secondary'}`}
          >
            Acknowledged
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`btn ${filter === 'resolved' ? 'btn-success' : 'btn-secondary'}`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert._id}
            className={`card ${
              alert.status === 'active' ? 'border-l-4 border-red-500' :
              alert.status === 'acknowledged' ? 'border-l-4 border-yellow-500' :
              'border-l-4 border-green-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className={`${
                    alert.status === 'active' ? 'text-red-600' :
                    alert.status === 'acknowledged' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} size={24} />
                  <h3 className="font-bold text-lg">SOS Alert</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    alert.status === 'active' ? 'bg-red-100 text-red-800' :
                    alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Driver</p>
                    <p className="font-medium">{alert.driver?.name}</p>
                    <p className="text-sm text-gray-500">{alert.driver?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bus</p>
                    <p className="font-medium">{alert.bus?.busNumber}</p>
                    <p className="text-sm text-gray-500">{alert.bus?.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">
                      {alert.location.coordinates[1].toFixed(4)}, {alert.location.coordinates[0].toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {alert.description && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-gray-900">{alert.description}</p>
                  </div>
                )}

                {alert.notes && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">Resolution Notes</p>
                    <p className="text-gray-900">{alert.notes}</p>
                  </div>
                )}

                {alert.acknowledgedBy && (
                  <p className="text-sm text-gray-500 mt-2">
                    Acknowledged by {alert.acknowledgedBy.name} at {new Date(alert.acknowledgedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {alert.status === 'active' && (
                  <button
                    onClick={() => handleAcknowledge(alert._id)}
                    className="btn btn-secondary text-sm"
                  >
                    Acknowledge
                  </button>
                )}
                {(alert.status === 'active' || alert.status === 'acknowledged') && (
                  <button
                    onClick={() => handleResolve(alert._id)}
                    className="btn btn-success text-sm"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="card text-center py-12">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <p className="text-gray-500">No {filter !== 'all' ? filter : ''} alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyCenter;

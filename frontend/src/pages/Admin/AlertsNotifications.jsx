import { useEffect, useState } from 'react';
import { Plus, X, Send, Bell } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import socketService from '../../utils/socket';

const AlertsNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all',
    priority: 'medium',
    relatedRoute: '',
    relatedBus: ''
  });

  useEffect(() => {
    fetchNotifications();
    fetchRoutes();
    fetchBuses();
    connectSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/routes');
      setRoutes(response.data.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchBuses = async () => {
    try {
      const response = await api.get('/buses');
      setBuses(response.data.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const connectSocket = () => {
    socketService.connect();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/notifications', formData);
      toast.success('Notification sent successfully');
      
      // Emit via socket
      socketService.emit('admin:send-notification', response.data.data);
      
      fetchNotifications();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  const handleDelete = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await api.delete(`/notifications/${notificationId}`);
        toast.success('Notification deleted');
        fetchNotifications();
      } catch (error) {
        toast.error('Failed to delete notification');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      title: '',
      message: '',
      type: 'info',
      recipients: 'all',
      priority: 'medium',
      relatedRoute: '',
      relatedBus: ''
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'alert': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'announcement': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
          <p className="text-gray-600 mt-1">Send messages to drivers and users</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Notification
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="text-primary-600" size={20} />
                  <h3 className="font-bold text-lg">{notification.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                    {notification.type}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} title={notification.priority}></div>
                </div>
                <p className="text-gray-700 mb-3">{notification.message}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span><strong>Recipients:</strong> {notification.recipients}</span>
                  {notification.relatedRoute && (
                    <span><strong>Route:</strong> {notification.relatedRoute.routeNumber}</span>
                  )}
                  {notification.relatedBus && (
                    <span><strong>Bus:</strong> {notification.relatedBus.busNumber}</span>
                  )}
                  <span><strong>Sent by:</strong> {notification.sender?.name}</span>
                  <span>{new Date(notification.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(notification._id)}
                className="text-red-600 hover:text-red-800 ml-4"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="card text-center py-12">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No notifications sent yet</p>
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Send Notification</h2>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="input"
                    rows="4"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="alert">Alert</option>
                      <option value="emergency">Emergency</option>
                      <option value="announcement">Announcement</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Priority *</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Recipients *</label>
                    <select
                      name="recipients"
                      value={formData.recipients}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="all">All</option>
                      <option value="users">Users Only</option>
                      <option value="drivers">Drivers Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Related Route (Optional)</label>
                    <select
                      name="relatedRoute"
                      value={formData.relatedRoute}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">None</option>
                      {routes.map((route) => (
                        <option key={route._id} value={route._id}>
                          {route.routeNumber} - {route.routeName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Related Bus (Optional)</label>
                    <select
                      name="relatedBus"
                      value={formData.relatedBus}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">None</option>
                      {buses.map((bus) => (
                        <option key={bus._id} value={bus._id}>
                          {bus.busNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                    <Send size={20} />
                    Send Notification
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsNotifications;

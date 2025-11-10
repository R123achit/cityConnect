import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search, MessageSquare } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import socketService from '../../utils/socket';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [messageData, setMessageData] = useState({ title: '', message: '', priority: 'medium' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    licenseNumber: '',
    assignedBus: null,
    assignedRoute: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching drivers, buses, and routes...');
      const [driversRes, busesRes, routesRes] = await Promise.all([
        api.get('/admin/drivers'),
        api.get('/admin/buses'),
        api.get('/admin/routes')
      ]);
      
      console.log('Drivers response:', driversRes.data);
      console.log('Total drivers fetched:', driversRes.data.data?.length);
      
      setDrivers(driversRes.data.data || []);
      setBuses(busesRes.data.data || []);
      setRoutes(routesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
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
      if (editingDriver) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        
        // Convert empty strings to null for ObjectId fields
        if (updateData.assignedBus === '' || updateData.assignedBus === 'null') {
          updateData.assignedBus = null;
        }
        if (updateData.assignedRoute === '' || updateData.assignedRoute === 'null') {
          updateData.assignedRoute = null;
        }
        
        await api.put(`/admin/drivers/${editingDriver._id}`, updateData);
        toast.success('Driver updated successfully');
      } else {
        const createData = { ...formData };
        
        // Convert empty strings to null for ObjectId fields
        if (createData.assignedBus === '' || createData.assignedBus === 'null') {
          createData.assignedBus = null;
        }
        if (createData.assignedRoute === '' || createData.assignedRoute === 'null') {
          createData.assignedRoute = null;
        }
        
        await api.post('/admin/drivers', createData);
        toast.success('Driver created successfully');
      }
      
      fetchData();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      email: driver.email,
      password: '',
      phone: driver.phone || '',
      licenseNumber: driver.licenseNumber || '',
      assignedBus: driver.assignedBus?._id || null,
      assignedRoute: driver.assignedRoute?._id || null
    });
    setShowModal(true);
  };

  const handleDelete = async (driverId) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await api.delete(`/admin/drivers/${driverId}`);
        toast.success('Driver deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete driver');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDriver(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      licenseNumber: '',
      assignedBus: null,
      assignedRoute: null
    });
  };

  const handleSendMessage = (driver) => {
    setSelectedDriver(driver);
    setShowMessageModal(true);
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notifications/send-realtime', {
        title: messageData.title,
        message: messageData.message,
        recipients: 'specific',
        specificRecipients: [selectedDriver._id],
        type: 'info',
        priority: messageData.priority
      });
      
      toast.success(`Message sent to ${selectedDriver.name}`);
      setShowMessageModal(false);
      setMessageData({ title: '', message: '', priority: 'medium' });
      setSelectedDriver(null);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Current drivers state:', drivers);
  console.log('Filtered drivers:', filteredDrivers);
  console.log('Loading:', loading);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-gray-600 mt-1">Manage bus drivers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Driver
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      {/* Drivers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Bus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No drivers found</p>
                      <p className="text-sm mt-1">
                        {searchTerm ? 'Try a different search term' : 'Click "Add Driver" to create your first driver'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{driver.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{driver.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{driver.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{driver.licenseNumber || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {driver.assignedBus?.busNumber || 'Not Assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {driver.assignedRoute?.routeNumber || 'Not Assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        driver.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSendMessage(driver)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Send private message"
                        >
                          <MessageSquare size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(driver)}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(driver._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Send Message to {selectedDriver?.name}</h2>
                <button onClick={() => setShowMessageModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input
                    type="text"
                    value={messageData.title}
                    onChange={(e) => setMessageData({...messageData, title: e.target.value})}
                    className="input"
                    placeholder="Message title"
                    required
                  />
                </div>

                <div>
                  <label className="label">Message *</label>
                  <textarea
                    value={messageData.message}
                    onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                    className="input"
                    rows="4"
                    placeholder="Type your message here..."
                    required
                  />
                </div>

                <div>
                  <label className="label">Priority</label>
                  <select
                    value={messageData.priority}
                    onChange={(e) => setMessageData({...messageData, priority: e.target.value})}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                    <MessageSquare size={20} />
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingDriver ? 'Edit Driver' : 'Add New Driver'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      Password {editingDriver ? '' : '*'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input"
                      required={!editingDriver}
                      minLength={6}
                    />
                    {editingDriver && (
                      <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Assigned Bus</label>
                    <select
                      name="assignedBus"
                      value={formData.assignedBus || ''}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select Bus</option>
                      {buses.map((bus) => (
                        <option key={bus._id} value={bus._id}>
                          {bus.busNumber} - {bus.registrationNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Assigned Route</label>
                    <select
                      name="assignedRoute"
                      value={formData.assignedRoute || ''}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select Route</option>
                      {routes.map((route) => (
                        <option key={route._id} value={route._id}>
                          {route.routeNumber} - {route.routeName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingDriver ? 'Update Driver' : 'Add Driver'}
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

export default DriverManagement;

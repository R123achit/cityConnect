import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, Search, MapPin } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    routeName: '',
    routeNumber: '',
    startPoint: '',
    endPoint: '',
    totalDistance: '',
    estimatedDuration: '',
    frequency: '',
    description: '',
    isActive: true,
    operatingHours: {
      start: '06:00',
      end: '22:00'
    },
    stops: []
  });
  const [newStop, setNewStop] = useState({
    name: '',
    lat: '',
    lng: '',
    estimatedTime: ''
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/admin/routes');
      setRoutes(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleAddStop = () => {
    if (!newStop.name || !newStop.lat || !newStop.lng) {
      toast.error('Please fill all stop details');
      return;
    }

    const stop = {
      name: newStop.name,
      location: {
        type: 'Point',
        coordinates: [parseFloat(newStop.lng), parseFloat(newStop.lat)]
      },
      sequenceOrder: formData.stops.length + 1,
      estimatedTime: parseInt(newStop.estimatedTime) || 0
    };

    setFormData({
      ...formData,
      stops: [...formData.stops, stop]
    });

    setNewStop({ name: '', lat: '', lng: '', estimatedTime: '' });
  };

  const handleRemoveStop = (index) => {
    const updatedStops = formData.stops.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      stops: updatedStops.map((stop, i) => ({ ...stop, sequenceOrder: i + 1 }))
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingRoute) {
        await api.put(`/admin/routes/${editingRoute._id}`, formData);
        toast.success('Route updated successfully');
      } else {
        await api.post('/admin/routes', formData);
        toast.success('Route created successfully');
      }
      
      fetchRoutes();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      routeName: route.routeName,
      routeNumber: route.routeNumber,
      startPoint: route.startPoint,
      endPoint: route.endPoint,
      totalDistance: route.totalDistance,
      estimatedDuration: route.estimatedDuration,
      frequency: route.frequency,
      description: route.description || '',
      isActive: route.isActive,
      operatingHours: route.operatingHours,
      stops: route.stops || []
    });
    setShowModal(true);
  };

  const handleDelete = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await api.delete(`/admin/routes/${routeId}`);
        toast.success('Route deleted successfully');
        fetchRoutes();
      } catch (error) {
        toast.error('Failed to delete route');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoute(null);
    setFormData({
      routeName: '',
      routeNumber: '',
      startPoint: '',
      endPoint: '',
      totalDistance: '',
      estimatedDuration: '',
      frequency: '',
      description: '',
      isActive: true,
      operatingHours: {
        start: '06:00',
        end: '22:00'
      },
      stops: []
    });
    setNewStop({ name: '', lat: '', lng: '', estimatedTime: '' });
  };

  const filteredRoutes = routes.filter(route =>
    route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.routeNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Route Management</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage bus routes and stops</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Route
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      {/* Routes Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start - End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stops</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoutes.map((route) => (
                <tr key={route._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{route.routeNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{route.routeName}</td>
                  <td className="px-6 py-4 text-sm">
                    {route.startPoint} → {route.endPoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{route.stops?.length || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{route.totalDistance} km</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{route.estimatedDuration} min</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      route.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {route.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(route)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(route._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingRoute ? 'Edit Route' : 'Add New Route'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Route Number *</label>
                    <input
                      type="text"
                      name="routeNumber"
                      value={formData.routeNumber}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Route Name *</label>
                    <input
                      type="text"
                      name="routeName"
                      value={formData.routeName}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Start Point *</label>
                    <input
                      type="text"
                      name="startPoint"
                      value={formData.startPoint}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">End Point *</label>
                    <input
                      type="text"
                      name="endPoint"
                      value={formData.endPoint}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Total Distance (km)</label>
                    <input
                      type="number"
                      name="totalDistance"
                      value={formData.totalDistance}
                      onChange={handleInputChange}
                      className="input"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="label">Est. Duration (min)</label>
                    <input
                      type="number"
                      name="estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Frequency (min)</label>
                    <input
                      type="number"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Status</label>
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span>Active</span>
                    </div>
                  </div>

                  <div>
                    <label className="label">Start Time</label>
                    <input
                      type="time"
                      name="operatingHours.start"
                      value={formData.operatingHours.start}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">End Time</label>
                    <input
                      type="time"
                      name="operatingHours.end"
                      value={formData.operatingHours.end}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input"
                    rows="3"
                  />
                </div>

                {/* Stops Section */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Route Stops</h3>
                  
                  {/* Add Stop Form */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <input
                        type="text"
                        placeholder="Stop Name"
                        value={newStop.name}
                        onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
                        className="input"
                      />
                      <input
                        type="number"
                        placeholder="Latitude"
                        value={newStop.lat}
                        onChange={(e) => setNewStop({ ...newStop, lat: e.target.value })}
                        className="input"
                        step="any"
                      />
                      <input
                        type="number"
                        placeholder="Longitude"
                        value={newStop.lng}
                        onChange={(e) => setNewStop({ ...newStop, lng: e.target.value })}
                        className="input"
                        step="any"
                      />
                      <input
                        type="number"
                        placeholder="Time (min)"
                        value={newStop.estimatedTime}
                        onChange={(e) => setNewStop({ ...newStop, estimatedTime: e.target.value })}
                        className="input"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddStop}
                      className="btn btn-secondary mt-3 flex items-center gap-2"
                    >
                      <MapPin size={16} />
                      Add Stop
                    </button>
                  </div>

                  {/* Stops List */}
                  {formData.stops.length > 0 && (
                    <div className="space-y-2">
                      {formData.stops.map((stop, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900">{index + 1}.</span>
                            <div>
                              <p className="font-medium">{stop.name}</p>
                              <p className="text-sm text-gray-500">
                                {stop.location.coordinates[1]}, {stop.location.coordinates[0]} • {stop.estimatedTime} min
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveStop(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {editingRoute ? 'Update Route' : 'Add Route'}
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

export default RouteManagement;

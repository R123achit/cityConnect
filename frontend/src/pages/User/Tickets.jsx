import { useState, useEffect } from 'react';
import { Ticket, QrCode, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routeStops, setRouteStops] = useState([]);
  const [calculatedFare, setCalculatedFare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    fromStop: '',
    toStop: ''
  });

  useEffect(() => {
    fetchTicketHistory();
    fetchRoutesAndBuses();
  }, []);

  const fetchTicketHistory = async () => {
    try {
      const response = await api.get('/tickets/history');
      setTickets(response.data.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchRoutesAndBuses = async () => {
    try {
      const routesRes = await api.get('/user/routes');
      setRoutes(routesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchBusesByRoute = async (routeId) => {
    try {
      const response = await api.get(`/user/buses/route/${routeId}`);
      setBuses(response.data.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
      setBuses([]);
    }
  };

  const fetchRouteStops = async (routeId) => {
    try {
      const response = await api.get(`/tickets/route-stops/${routeId}`);
      setRouteStops(response.data.data.stops);
    } catch (error) {
      console.error('Error fetching route stops:', error);
      toast.error('Failed to load route stops');
    }
  };

  const calculateFare = async () => {
    if (!formData.routeId || !formData.fromStop || !formData.toStop) return;
    
    try {
      const response = await api.post('/tickets/calculate-fare', {
        routeId: formData.routeId,
        fromStop: formData.fromStop,
        toStop: formData.toStop
      });
      setCalculatedFare(response.data.data.fare);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid stop selection');
      setCalculatedFare(null);
    }
  };

  const handleRouteChange = async (routeId) => {
    setFormData({ ...formData, routeId, busId: '', fromStop: '', toStop: '' });
    setRouteStops([]);
    setBuses([]);
    setCalculatedFare(null);
    if (routeId) {
      await Promise.all([
        fetchRouteStops(routeId),
        fetchBusesByRoute(routeId)
      ]);
    }
  };

  useEffect(() => {
    if (formData.fromStop && formData.toStop && formData.routeId) {
      calculateFare();
    } else {
      setCalculatedFare(null);
    }
  }, [formData.fromStop, formData.toStop, formData.routeId]);

  const handleGenerateTicket = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted', { formData, calculatedFare, loading });
    
    if (loading) {
      console.log('Already loading, preventing double submission');
      return;
    }
    
    if (!calculatedFare) {
      console.log('No calculated fare');
      toast.error('Please select valid stops');
      return;
    }

    if (!formData.busId || !formData.routeId || !formData.fromStop || !formData.toStop) {
      console.log('Missing fields:', formData);
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    console.log('Generating ticket...');

    try {
      const response = await api.post('/tickets/generate', formData);
      console.log('Ticket generated successfully:', response.data);
      toast.success('Ticket generated and sent to your email!');
      setShowGenerateModal(false);
      setFormData({ busId: '', routeId: '', fromStop: '', toStop: '' });
      setRouteStops([]);
      setCalculatedFare(null);
      await fetchTicketHistory();
    } catch (error) {
      console.error('Ticket generation error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to generate ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await api.delete(`/tickets/${ticketId}`);
      toast.success('Ticket deleted successfully');
      fetchTicketHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete ticket');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Clock size={16} />;
      case 'used': return <CheckCircle size={16} />;
      case 'expired': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Tickets</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Digital bus tickets with QR codes</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Ticket size={20} />
          <span>Generate Ticket</span>
        </button>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="card dark:bg-dark-800 dark:border-dark-700 hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-base sm:text-lg dark:text-white">{ticket.routeId?.routeNumber}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 break-words">{ticket.routeId?.routeName}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 whitespace-nowrap ${getStatusColor(ticket.status)}`}>
                {getStatusIcon(ticket.status)}
                {ticket.status}
              </span>
            </div>

            {/* QR Code */}
            <div className="bg-white p-3 sm:p-4 rounded-lg mb-4 flex justify-center">
              <img src={ticket.qrCode} alt="QR Code" className="w-40 h-40 sm:w-48 sm:h-48" />
            </div>

            {/* Ticket Details */}
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">Ticket ID:</span>
                <span className="font-mono font-semibold dark:text-white text-right break-all">{ticket.ticketId}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">Bus:</span>
                <span className="font-semibold dark:text-white text-right">{ticket.busId?.busNumber}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">From:</span>
                <span className="font-semibold dark:text-white text-right break-words">{ticket.fromStop}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">To:</span>
                <span className="font-semibold dark:text-white text-right break-words">{ticket.toStop}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">Fare:</span>
                <span className="font-bold text-primary-600 dark:text-primary-400">₹{ticket.fare}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">Generated:</span>
                <span className="text-xs dark:text-gray-300 text-right">{new Date(ticket.createdAt).toLocaleString()}</span>
              </div>
              {ticket.status === 'used' && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-600 dark:text-gray-400 flex-shrink-0">Used At:</span>
                  <span className="text-xs dark:text-gray-300 text-right">{new Date(ticket.usedAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Delete Button for Used/Expired Tickets */}
            {(ticket.status === 'used' || ticket.status === 'expired') && (
              <button
                onClick={() => handleDeleteTicket(ticket._id)}
                className="mt-4 w-full py-2 px-4 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="card dark:bg-dark-800 dark:border-dark-700 text-center py-12">
          <QrCode className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No tickets yet</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Generate your first ticket to get started</p>
        </div>
      )}

      {/* Generate Ticket Modal */}
      {showGenerateModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="min-h-screen flex items-center justify-center p-4 py-8">
            <div className="bg-white dark:bg-dark-800 rounded-lg max-w-md w-full p-4 sm:p-6 my-auto max-h-[85vh] overflow-y-auto shadow-2xl">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 dark:text-white sticky top-0 bg-white dark:bg-dark-800 pb-2">Generate Ticket</h2>
            
            <form onSubmit={handleGenerateTicket} className="space-y-3 sm:space-y-4">
              <div>
                <label className="label dark:text-gray-300 text-sm">Route *</label>
                <select
                  value={formData.routeId}
                  onChange={(e) => handleRouteChange(e.target.value)}
                  className="input dark:bg-dark-900 dark:border-dark-600 dark:text-white text-sm"
                  required
                >
                  <option value="">Select Route</option>
                  {routes.map((route) => (
                    <option key={route._id} value={route._id}>
                      {route.routeNumber} - {route.routeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label dark:text-gray-300 text-sm">Bus *</label>
                <select
                  value={formData.busId}
                  onChange={(e) => setFormData({...formData, busId: e.target.value})}
                  className="input dark:bg-dark-900 dark:border-dark-600 dark:text-white text-sm"
                  required
                  disabled={!formData.routeId || buses.length === 0}
                >
                  <option value="">{buses.length === 0 ? 'No buses available' : 'Select Bus'}</option>
                  {buses.map((bus) => (
                    <option key={bus._id} value={bus._id}>
                      {bus.busNumber} {bus.type ? `(${bus.type})` : ''}
                    </option>
                  ))}
                </select>
                {formData.routeId && buses.length === 0 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">No active buses on this route</p>
                )}
              </div>

              <div>
                <label className="label dark:text-gray-300 text-sm">From Stop *</label>
                <select
                  value={formData.fromStop}
                  onChange={(e) => setFormData({...formData, fromStop: e.target.value, toStop: ''})}
                  className="input dark:bg-dark-900 dark:border-dark-600 dark:text-white text-sm"
                  required
                  disabled={!formData.routeId || routeStops.length === 0}
                >
                  <option value="">Select Starting Point</option>
                  {routeStops.map((stop, index) => (
                    <option key={`from-${stop.sequenceOrder}-${index}`} value={stop.name}>
                      {stop.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label dark:text-gray-300 text-sm">To Stop *</label>
                <select
                  value={formData.toStop}
                  onChange={(e) => setFormData({...formData, toStop: e.target.value})}
                  className="input dark:bg-dark-900 dark:border-dark-600 dark:text-white text-sm"
                  required
                  disabled={!formData.fromStop || routeStops.length === 0}
                >
                  <option value="">Select Destination</option>
                  {routeStops
                    .filter(stop => {
                      const fromStopData = routeStops.find(s => s.name === formData.fromStop);
                      return fromStopData ? stop.sequenceOrder > fromStopData.sequenceOrder : false;
                    })
                    .map((stop, index) => (
                      <option key={`to-${stop.sequenceOrder}-${index}`} value={stop.name}>
                        {stop.name}
                      </option>
                    ))}
                </select>
              </div>

              {calculatedFare && (
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3 sm:p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">Calculated Fare:</span>
                    <span className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">₹{calculatedFare}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sticky bottom-0 bg-white dark:bg-dark-800 pb-2">
                <button
                  type="submit"
                  disabled={loading || !calculatedFare}
                  className="btn btn-primary flex-1 text-sm sm:text-base touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {loading ? 'Generating...' : 'Generate Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowGenerateModal(false);
                    setFormData({ busId: '', routeId: '', fromStop: '', toStop: '' });
                    setRouteStops([]);
                    setCalculatedFare(null);
                  }}
                  className="btn btn-secondary flex-1 text-sm sm:text-base touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
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

export default Tickets;

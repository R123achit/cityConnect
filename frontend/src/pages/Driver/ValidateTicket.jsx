import { useState } from 'react';
import { QrCode, CheckCircle, XCircle, Scan } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ValidateTicket = () => {
  const [ticketId, setTicketId] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleValidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationResult(null);

    try {
      const response = await api.post('/tickets/validate', { ticketId });
      setValidationResult({
        success: true,
        data: response.data.data,
        message: response.data.message
      });
      toast.success('Ticket validated successfully!');
      setTicketId('');
    } catch (error) {
      setValidationResult({
        success: false,
        message: error.response?.data?.message || 'Validation failed'
      });
      toast.error(error.response?.data?.message || 'Validation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Validate Ticket</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Scan or enter ticket ID to validate</p>
      </div>

      {/* Validation Form */}
      <div className="card dark:bg-dark-800 dark:border-dark-700 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
            <Scan size={40} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Scan QR Code</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Or enter ticket ID manually</p>
        </div>

        <form onSubmit={handleValidate} className="space-y-4">
          <div>
            <label className="label dark:text-gray-300">Ticket ID</label>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value.toUpperCase())}
              className="input dark:bg-dark-900 dark:border-dark-600 dark:text-white font-mono"
              placeholder="TKT-XXXXXXXXX"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <QrCode size={20} />
            {loading ? 'Validating...' : 'Validate Ticket'}
          </button>
        </form>

        {/* Validation Result */}
        {validationResult && (
          <div className={`mt-6 p-6 rounded-lg border-2 ${
            validationResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-500'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              {validationResult.success ? (
                <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
              ) : (
                <XCircle size={32} className="text-red-600 dark:text-red-400" />
              )}
              <div>
                <h3 className={`text-xl font-bold ${
                  validationResult.success ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
                }`}>
                  {validationResult.success ? 'Valid Ticket' : 'Invalid Ticket'}
                </h3>
                <p className={`text-sm ${
                  validationResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                }`}>
                  {validationResult.message}
                </p>
              </div>
            </div>

            {validationResult.success && validationResult.data && (
              <div className="space-y-2 text-sm border-t border-green-200 dark:border-green-800 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Passenger:</span>
                  <span className="font-semibold dark:text-white">{validationResult.data.userId?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Bus:</span>
                  <span className="font-semibold dark:text-white">{validationResult.data.busId?.busNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Route:</span>
                  <span className="font-semibold dark:text-white">{validationResult.data.routeId?.routeNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">From:</span>
                  <span className="font-semibold dark:text-white">{validationResult.data.fromStop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">To:</span>
                  <span className="font-semibold dark:text-white">{validationResult.data.toStop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Fare:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">₹{validationResult.data.fare}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="card dark:bg-dark-800 dark:border-dark-700 max-w-2xl mx-auto">
        <h3 className="font-bold text-lg mb-4 dark:text-white">How to Validate</h3>
        <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-2">
            <span className="font-bold text-primary-600 dark:text-primary-400">1.</span>
            <span>Ask passenger to show their QR code ticket</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary-600 dark:text-primary-400">2.</span>
            <span>Scan the QR code or manually enter the ticket ID</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary-600 dark:text-primary-400">3.</span>
            <span>System will validate and mark ticket as used</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary-600 dark:text-primary-400">4.</span>
            <span>Each ticket can only be used once</span>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default ValidateTicket;

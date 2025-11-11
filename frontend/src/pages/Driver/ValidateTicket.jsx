import { useState, useRef, useEffect } from 'react';
import { QrCode, CheckCircle, XCircle, Scan, Camera, X } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ValidateTicket = () => {
  const [ticketId, setTicketId] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner('qr-reader', {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      });

      scanner.render(onScanSuccess, onScanError);
      scannerRef.current = scanner;

      return () => {
        scanner.clear().catch(err => console.error('Scanner cleanup error:', err));
      };
    }
  }, [showScanner]);

  const onScanSuccess = (decodedText) => {
    setTicketId(decodedText);
    stopScanner();
    validateTicket(decodedText);
  };

  const onScanError = (error) => {
    // Ignore scan errors (happens continuously while scanning)
  };

  const validateTicket = async (id) => {
    setLoading(true);
    setValidationResult(null);

    try {
      const response = await api.post('/driver/validate-ticket', { ticketId: id });
      setValidationResult({
        success: true,
        data: response.data.data,
        message: response.data.message,
        availableSeats: response.data.data.availableSeats,
        occupiedSeats: response.data.data.occupiedSeats
      });
      toast.success(`Ticket validated! ${response.data.data.availableSeats} seats available`);
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

  const handleValidate = async (e) => {
    e.preventDefault();
    validateTicket(ticketId);
    setTicketId('');
  };

  const startScanner = () => {
    setShowScanner(true);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(err => console.error('Error stopping scanner:', err));
    }
    setShowScanner(false);
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

          <div className={isMobile ? "grid grid-cols-2 gap-3" : "flex"}>
            {isMobile && (
              <button
                type="button"
                onClick={startScanner}
                className="btn bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
              >
                <Camera size={20} />
                Scan QR
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary flex items-center justify-center gap-2 ${!isMobile ? 'w-full' : ''}`}
            >
              <QrCode size={20} />
              {loading ? 'Validating...' : 'Validate Ticket'}
            </button>
          </div>
        </form>

        {/* QR Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg">
              <button
                onClick={stopScanner}
                className="absolute top-2 right-2 z-10 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg"
              >
                <X size={24} />
              </button>
              <div className="bg-white dark:bg-dark-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-center dark:text-white">Scan QR Code</h3>
                <div id="qr-reader" className="w-full"></div>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Position QR code within the frame to scan automatically
                </p>
              </div>
            </div>
          </div>
        )}

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
                  <span className="font-semibold dark:text-white">{validationResult.data.passenger}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">From:</span>
                  <span className="font-semibold dark:text-white">{validationResult.data.ticket?.fromStop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">To:</span>
                  <span className="font-semibold dark:text-white">{validationResult.data.ticket?.toStop}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Fare:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">₹{validationResult.data.ticket?.fare}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-800">
                  <span className="text-gray-700 dark:text-gray-300">Seats Available:</span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">
                    {validationResult.availableSeats} / {validationResult.occupiedSeats + validationResult.availableSeats}
                  </span>
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

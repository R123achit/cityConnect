import { useEffect, useState } from 'react';
import { Clock, MapPin, Calendar } from 'lucide-react';
import api from '../../utils/api';

const TripHistory = () => {
  const [tripHistory, setTripHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripHistory();
  }, []);

  const fetchTripHistory = async () => {
    try {
      const response = await api.get('/user/trip-history');
      setTripHistory(response.data.data);
    } catch (error) {
      console.error('Error fetching trip history:', error);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Trip History</h1>
        <p className="text-gray-600 mt-1">View your tracked buses and routes</p>
      </div>

      {/* Trip History List */}
      <div className="space-y-4">
        {tripHistory.length > 0 ? (
          tripHistory.map((trip, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="text-primary-600" size={24} />
                    <div>
                      <h3 className="font-bold text-lg">
                        {trip.route?.routeNumber} - {trip.route?.routeName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Bus: {trip.bus?.busNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>{new Date(trip.timestamp).toLocaleDateString()}</span>
                    <Clock size={16} className="ml-3" />
                    <span>{new Date(trip.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No trip history yet</p>
            <p className="text-sm text-gray-400 mt-2">Start tracking buses to see your history here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripHistory;

import { Users } from 'lucide-react';

const SeatAvailability = ({ availableSeats, capacity }) => {
  const occupiedSeats = capacity - availableSeats;
  const percentage = (availableSeats / capacity) * 100;
  
  const getColor = () => {
    if (percentage >= 50) return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-500', label: 'Plenty' };
    if (percentage >= 20) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-500', label: 'Few' };
    return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-500', label: 'Full' };
  };

  const color = getColor();

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${color.bg} border-2 ${color.border}`}>
      <Users size={18} className={color.text} />
      <div className="flex flex-col">
        <span className={`text-sm font-bold ${color.text}`}>
          {availableSeats}/{capacity}
        </span>
        <span className={`text-xs ${color.text}`}>{color.label}</span>
      </div>
    </div>
  );
};

export default SeatAvailability;

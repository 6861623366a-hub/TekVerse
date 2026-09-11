import { useState } from 'react';
import { emitStatusChange } from '../hooks/useSocket';

export default function StatusSelector({ user, onStatusChange }) {
  const [showStatus, setShowStatus] = useState(false);
  const statuses = ['online', 'away', 'offline', 'dnd'];
  const statusEmojis = {
    online: '🟢',
    away: '🟡',
    offline: '⚫',
    dnd: '🔴'
  };
  const statusLabels = {
    online: 'En línea',
    away: 'Ausente',
    offline: 'Desconectado',
    dnd: 'No molestar'
  };

  const handleStatusChange = (status) => {
    emitStatusChange({ userId: user.id, status });
    onStatusChange(status);
    setShowStatus(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowStatus(!showStatus)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition"
      >
        <span>{statusEmojis[user.status || 'online']}</span>
        <span className="text-sm">{statusLabels[user.status || 'online']}</span>
      </button>

      {showStatus && (
        <div className="absolute top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 transition text-white flex items-center gap-2"
            >
              <span>{statusEmojis[status]}</span>
              <span>{statusLabels[status]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';

export default function NotificationCenter({ notifications, onClear }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-gray-400 hover:text-cyan-500 transition text-xl"
      >
        🔔
        {notifications && notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-white">Notificaciones</h3>
            <button
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-white"
            >
              Limpiar
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications && notifications.length > 0 ? (
              notifications.map((notif, idx) => (
                <div key={idx} className="p-3 border-b border-gray-700 hover:bg-gray-700 transition">
                  <p className="text-sm text-white font-semibold">{notif.type}</p>
                  <p className="text-xs text-gray-400">{notif.message}</p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 text-sm">
                No tienes notificaciones
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
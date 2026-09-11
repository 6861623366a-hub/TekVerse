import { useState } from 'react';

export default function VoiceChatIndicator({ participants, isActive }) {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-cyan-500 rounded-lg p-4 min-w-max">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full animate-pulse ${
          isActive ? 'bg-green-500' : 'bg-gray-500'
        }`}></div>
        <div>
          <p className="text-sm font-semibold text-white">Llamada Activa</p>
          <p className="text-xs text-gray-400">{participants.length} participante(s)</p>
        </div>
      </div>
    </div>
  );
}
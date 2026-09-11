import { useState } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { startScreenShare, stopScreenShare } from '../hooks/useSocket';

export default function ScreenShareWindow({ channel, user, onClose }) {
  const webRTC = useWebRTC(channel._id, user.id);
  const [screenStream, setScreenStream] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  const startShare = async () => {
    try {
      const stream = await webRTC.startScreenShare();
      setScreenStream(stream);
      setIsSharing(true);
      startScreenShare({ userId: user.id, channelId: channel._id });
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const stopShare = () => {
    webRTC.stopScreenShare();
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    setScreenStream(null);
    setIsSharing(false);
    stopScreenShare({ userId: user.id, channelId: channel._id });
  };

  if (!isSharing) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Compartir Pantalla</h2>
          <p className="text-gray-300 mb-6">Comparte tu pantalla con los participantes de #{channel.name}</p>
          <div className="flex gap-4">
            <button
              onClick={startShare}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded font-bold"
            >
              Comenzar a Compartir
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-bold"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Compartiendo pantalla - #{channel.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {screenStream && (
          <video
            autoPlay
            playsInline
            srcObject={screenStream}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      <div className="bg-gray-900 border-t border-gray-700 p-4 flex justify-center">
        <button
          onClick={stopShare}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-bold"
        >
          Dejar de Compartir
        </button>
      </div>
    </div>
  );
}
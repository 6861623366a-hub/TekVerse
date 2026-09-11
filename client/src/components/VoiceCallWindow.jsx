import { useState, useEffect } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { startVoiceCall, endVoiceCall, startScreenShare, stopScreenShare, toggleCamera, emitStatusChange } from '../hooks/useSocket';
import VideoStream from './VideoStream';
import AudioStream from './AudioStream';

export default function VoiceCallWindow({ channel, user, onClose }) {
  const webRTC = useWebRTC(channel._id, user.id);
  const [participants, setParticipants] = useState([]);
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    startCall();
  }, []);

  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  const startCall = async () => {
    await webRTC.startLocalStream(true, true);
    setParticipants([{ id: user.id, username: user.username, isLocal: true }]);
    setCallActive(true);
    startVoiceCall({ userId: user.id, channelId: channel._id, serverId: channel.server });
  };

  const endCall = () => {
    webRTC.stopLocalStream();
    setCallActive(false);
    setCallDuration(0);
    endVoiceCall({ channelId: channel._id });
    onClose();
  };

  const handleScreenShare = async () => {
    if (!webRTC.isScreenSharing) {
      await webRTC.startScreenShare();
      startScreenShare({ userId: user.id, channelId: channel._id, streamId: 'stream-' + Date.now() });
    } else {
      webRTC.stopScreenShare();
      stopScreenShare({ userId: user.id, channelId: channel._id });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Llamada en #{channel.name}</h2>
          <p className="text-sm text-gray-400">Duración: {formatTime(callDuration)}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-auto">
        {webRTC.localStream && (
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <VideoStream stream={webRTC.localStream} isSelf={true} />
            <div className="absolute bottom-2 left-2 bg-gray-900/80 px-2 py-1 rounded text-sm text-white">
              {user.username} (Tú)
            </div>
          </div>
        )}

        {Object.entries(webRTC.remoteStreams).map(([peerId, stream]) => (
          <div key={peerId} className="relative bg-gray-800 rounded-lg overflow-hidden">
            <VideoStream stream={stream} />
            <div className="absolute bottom-2 left-2 bg-gray-900/80 px-2 py-1 rounded text-sm text-white">
              Usuario #{peerId.substring(0, 6)}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border-t border-gray-700 p-4 flex justify-center gap-4">
        <button
          onClick={() => webRTC.toggleMicrophone()}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
            webRTC.isMicOn
              ? 'bg-cyan-500 text-white hover:bg-cyan-600'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
          title="Micrófono"
        >
          🎤
        </button>

        <button
          onClick={() => webRTC.toggleCamera()}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
            webRTC.isCameraOn
              ? 'bg-cyan-500 text-white hover:bg-cyan-600'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
          title="Cámara"
        >
          📹
        </button>

        <button
          onClick={handleScreenShare}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
            webRTC.isScreenSharing
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
          title="Compartir pantalla"
        >
          🖥️
        </button>

        <button
          onClick={endCall}
          className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition"
          title="Terminar llamada"
        >
          ☎️
        </button>
      </div>
    </div>
  );
}
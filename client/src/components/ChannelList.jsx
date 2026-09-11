import { useState } from 'react';
import { channelAPI } from '../api';

export default function ChannelList({ server, channels, currentChannel, setCurrentChannel }) {
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    const channelName = e.target.channelName.value;
    try {
      await channelAPI.createChannel({ name: channelName, server: server._id });
      setShowCreateChannel(false);
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">{server.name}</h2>
        <p className="text-sm text-gray-400">{server.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Canales</h3>
            <button
              onClick={() => setShowCreateChannel(true)}
              className="text-gray-400 hover:text-cyan-500"
            >
              +
            </button>
          </div>
          
          {channels && channels.map((channel) => (
            <button
              key={channel._id}
              onClick={() => setCurrentChannel(channel)}
              className={`w-full text-left px-3 py-2 rounded mb-1 transition ${
                currentChannel?._id === channel._id
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              # {channel.name}
            </button>
          ))}
        </div>
      </div>

      {showCreateChannel && (
        <div className="p-4 border-t border-gray-700 bg-gray-750">
          <form onSubmit={handleCreateChannel}>
            <input
              type="text"
              name="channelName"
              placeholder="Nombre del canal"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white mb-2"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-cyan-500 text-white px-3 py-1 rounded text-sm">
                Crear
              </button>
              <button
                type="button"
                onClick={() => setShowCreateChannel(false)}
                className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
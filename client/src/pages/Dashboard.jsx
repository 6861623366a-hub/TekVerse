import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useServerStore, useChannelStore, useMessageStore } from '../store';
import { serverAPI, channelAPI, messageAPI } from '../api';
import Sidebar from '../components/Sidebar';
import ServerList from '../components/ServerList';
import ChannelList from '../components/ChannelList';
import ChatWindow from '../components/ChatWindow';
import UserProfile from '../components/UserProfile';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { servers, currentServer, setServers, setCurrentServer } = useServerStore();
  const { channels, currentChannel, setChannels, setCurrentChannel } = useChannelStore();
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateServer, setShowCreateServer] = useState(false);

  useEffect(() => {
    if (user) {
      setServers(user.servers || []);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentServer) {
      setChannels(currentServer.channels || []);
    }
  }, [currentServer]);

  const handleCreateServer = async (e) => {
    e.preventDefault();
    const serverName = e.target.serverName.value;
    try {
      const res = await serverAPI.createServer({ name: serverName });
      setCurrentServer(res.data.server);
      setShowCreateServer(false);
    } catch (error) {
      console.error('Error creating server:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900">Cargando...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar user={user} onProfileClick={() => setShowProfile(true)} onLogout={logout} />
      <ServerList servers={servers} currentServer={currentServer} setCurrentServer={setCurrentServer} onCreateClick={() => setShowCreateServer(true)} />
      {currentServer && <ChannelList server={currentServer} channels={channels} currentChannel={currentChannel} setCurrentChannel={setCurrentChannel} />}
      {currentChannel && <ChatWindow channel={currentChannel} user={user} />}
      
      {showProfile && <UserProfile user={user} onClose={() => setShowProfile(false)} />}
      
      {showCreateServer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-cyan-500 mb-4">Crear Servidor</h2>
            <form onSubmit={handleCreateServer}>
              <input
                type="text"
                name="serverName"
                placeholder="Nombre del servidor"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white mb-4"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded">
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateServer(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useServerStore, useChannelStore } from '../store';
import { serverAPI, channelAPI } from '../api';
import Sidebar from '../components/Sidebar';
import ServerList from '../components/ServerList';
import ChannelList from '../components/ChannelList';
import ChatWindow from '../components/ChatWindow';
import MembersList from '../components/MembersList';
import UserProfile from '../components/UserProfile';
import VoiceCallWindow from '../components/VoiceCallWindow';
import UpgradeModal from '../components/UpgradeModal';
import StatusSelector from '../components/StatusSelector';
import NotificationCenter from '../components/NotificationCenter';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { servers, currentServer, setServers, setCurrentServer } = useServerStore();
  const { channels, currentChannel, setChannels, setCurrentChannel } = useChannelStore();
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userStatus, setUserStatus] = useState(user?.status || 'online');

  useEffect(() => {
    if (user?.servers) {
      Promise.all(user.servers.map(serverId => serverAPI.getServer(serverId)))
        .then(responses => {
          setServers(responses.map(res => res.data));
        })
        .catch(err => console.error('Error loading servers:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentServer?.channels) {
      Promise.all(currentServer.channels.map(channelId => channelAPI.getChannel(channelId)))
        .then(responses => {
          setChannels(responses.map(res => res.data));
        })
        .catch(err => console.error('Error loading channels:', err));
    }
  }, [currentServer]);

  const handleCreateServer = async (e) => {
    e.preventDefault();
    const serverName = e.target.serverName.value;
    try {
      const res = await serverAPI.createServer({ name: serverName, icon: '🎮' });
      setCurrentServer(res.data.server);
      setServers([...servers, res.data.server]);
      setShowCreateServer(false);
    } catch (error) {
      console.error('Error creating server:', error);
    }
  };

  const handleUpgradeTier = async (tier) => {
    try {
      await fetch(`/api/users/${user.id}/tier-upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ tier })
      });
      setShowUpgrade(false);
      setNotifications([...notifications, { type: 'Éxito', message: `¡Actualizado a ${tier}!` }]);
    } catch (error) {
      console.error('Error upgrading tier:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🚀</div>
          <div className="text-2xl text-cyan-400 font-bold">TekVerse cargando...</div>
          <p className="text-gray-400 mt-2">Preparando tu mundo de comunicación</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar 
        user={user} 
        onProfileClick={() => setShowProfile(true)} 
        onLogout={logout}
      />
      
      <ServerList 
        servers={servers} 
        currentServer={currentServer} 
        setCurrentServer={setCurrentServer} 
        onCreateClick={() => setShowCreateServer(true)}
      />
      
      <div className="flex flex-1">
        {currentServer && currentChannel ? (
          <>
            <ChannelList 
              server={currentServer} 
              channels={channels} 
              currentChannel={currentChannel} 
              setCurrentChannel={setCurrentChannel}
            />
            
            <ChatWindow 
              channel={currentChannel} 
              user={user}
              onVoiceCall={() => setShowVoiceCall(true)}
            />
            
            <MembersList 
              members={currentServer.members} 
              server={currentServer}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-800">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-3xl font-bold text-white mb-2">Bienvenido a TekVerse</h2>
              <p className="text-gray-400 mb-8">La evolución de la comunicación digital</p>
              <button
                onClick={() => setShowCreateServer(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                + Crear Servidor
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Barra superior con opciones */}
      <div className="fixed top-4 right-4 flex gap-4 z-40">
        <StatusSelector user={{ ...user, status: userStatus }} onStatusChange={setUserStatus} />
        <NotificationCenter notifications={notifications} onClear={() => setNotifications([])} />
        {user?.tiers?.current === 'free' && (
          <button
            onClick={() => setShowUpgrade(true)}
            className="bg-gradient-to-r from-pink-500 to-magenta-500 hover:from-pink-600 hover:to-magenta-600 text-white px-4 py-2 rounded font-semibold transition"
          >
            💎 Mejorar
          </button>
        )}
      </div>

      {/* Modales */}
      {showProfile && <UserProfile user={user} onClose={() => setShowProfile(false)} />}
      
      {showCreateServer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Crear Nuevo Servidor</h2>
            <form onSubmit={handleCreateServer} className="space-y-4">
              <input
                type="text"
                name="serverName"
                placeholder="Nombre del servidor"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                required
              />
              <div className="flex gap-2">
                <button 
                  type="submit" 
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded transition"
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateServer(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold px-4 py-2 rounded transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} onUpgrade={handleUpgradeTier} />}
      
      {showVoiceCall && currentChannel && (
        <VoiceCallWindow 
          channel={currentChannel} 
          user={user}
          onClose={() => setShowVoiceCall(false)}
        />
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { messageAPI } from '../api';
import { sendMessage, emitUserTyping, emitStopTyping } from '../hooks/useSocket';

export default function ChatWindow({ channel, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [channel]);

  const loadMessages = async () => {
    try {
      const res = await messageAPI.getChannelMessages(channel._id);
      setMessages(res.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageData = {
      content: input,
      channel: channel._id,
      userId: user.id,
      username: user.username,
      channelId: channel._id
    };

    try {
      await messageAPI.sendMessage(messageData);
      sendMessage(messageData);
      setInput('');
      emitStopTyping({ userId: user.id, channelId: channel._id });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    emitUserTyping({ userId: user.id, username: user.username, channelId: channel._id });
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center">Cargando mensajes...</div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <div className="border-b border-gray-700 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">#{channel.name}</h2>
          <p className="text-sm text-gray-400">{channel.description}</p>
        </div>
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-cyan-500 text-2xl">☎️</button>
          <button className="text-gray-400 hover:text-cyan-500 text-2xl">📹</button>
          <button className="text-gray-400 hover:text-cyan-500 text-2xl">⚙️</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className="flex gap-3">
            <img
              src={msg.author?.avatar}
              alt={msg.author?.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-white">{msg.author?.username}</span>
                <span className="text-xs text-gray-500">hoy</span>
              </div>
              <p className="text-gray-200">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="border-t border-gray-700 p-4">
        <div className="flex gap-2">
          <button type="button" className="text-gray-400 hover:text-cyan-500 text-xl">+</button>
          <input
            type="text"
            value={input}
            onChange={handleTyping}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded transition"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
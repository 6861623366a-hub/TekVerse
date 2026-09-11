import { useState } from 'react';
import { messageAPI } from '../api';
import { sendMessage, emitUserTyping, emitStopTyping, startVoiceCall, startScreenShare } from '../hooks/useSocket';
import ImageUploader from './ImageUploader';
import VideoStream from './VideoStream';

export default function ChatWindow({ channel, user, onVoiceCall }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;

    const messageData = {
      content: input,
      channel: channel._id,
      userId: user.id,
      username: user.username,
      channelId: channel._id,
      attachments
    };

    try {
      const res = await messageAPI.sendMessage(messageData);
      setMessages([...messages, res.data.data]);
      sendMessage(messageData);
      setInput('');
      setAttachments([]);
      emitStopTyping({ userId: user.id, channelId: channel._id });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    emitUserTyping({ userId: user.id, username: user.username, channelId: channel._id });
  };

  const handleImageUpload = (image) => {
    setAttachments([...attachments, image]);
  };

  const handleVoiceCall = () => {
    startVoiceCall({
      userId: user.id,
      channelId: channel._id,
      serverId: channel.server,
      username: user.username
    });
    onVoiceCall();
  };

  const handleScreenShare = async () => {
    try {
      startScreenShare({
        userId: user.id,
        channelId: channel._id
      });
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 border-r border-gray-800">
      {/* Header del canal */}
      <div className="border-b border-gray-700 p-4 flex justify-between items-center bg-gray-800/50">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {channel.type === 'voice' ? '🔊' : '#'} {channel.name}
          </h2>
          <p className="text-sm text-gray-400">{channel.description}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleVoiceCall}
            className="text-gray-400 hover:text-cyan-500 transition text-2xl hover:scale-110"
            title="Iniciar llamada de voz"
          >
            ☎️
          </button>
          <button
            onClick={handleScreenShare}
            className="text-gray-400 hover:text-purple-500 transition text-2xl hover:scale-110"
            title="Compartir pantalla"
          >
            🖥️
          </button>
          <button
            className="text-gray-400 hover:text-cyan-500 transition text-2xl hover:scale-110"
            title="Configuración del canal"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">💭</div>
              <p>No hay mensajes aún. ¡Sé el primero en hablar!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="flex gap-3 hover:bg-gray-800/50 p-2 rounded transition group">
              <img
                src={msg.author?.avatar || 'https://via.placeholder.com/40'}
                alt={msg.author?.username}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-white">{msg.author?.username}</span>
                  <span className="text-xs text-gray-500">ahora</span>
                </div>
                <p className="text-gray-200 break-words">{msg.content}</p>
                {msg.attachments && msg.attachments.map((att, idx) => (
                  <div key={idx} className="mt-2 rounded overflow-hidden max-w-xs">
                    {att.type?.startsWith('image') ? (
                      <img src={att.url} alt="Attachment" className="w-full" />
                    ) : (
                      <a href={att.url} className="text-cyan-400 hover:text-cyan-300">
                        📎 {att.filename}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Indicador de escritura */}
        {typingUsers.length > 0 && (
          <div className="flex gap-2 items-center text-sm text-gray-400 italic">
            <div className="flex gap-1">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
            {typingUsers.join(', ')} está escribiendo...
          </div>
        )}
      </div>

      {/* Adjuntos preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 flex gap-2 bg-gray-800/50 border-t border-gray-700">
          {attachments.map((att, idx) => (
            <div key={idx} className="relative">
              <img src={att.url} alt="Attachment" className="h-16 w-16 object-cover rounded" />
              <button
                onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input de mensajes */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-700 p-4 bg-gray-800/50">
        <div className="flex gap-2 items-end">
          <ImageUploader channelId={channel._id} onImageUpload={handleImageUpload} />
          <input
            type="text"
            value={input}
            onChange={handleTyping}
            placeholder="Escribe un mensaje en #general..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded font-semibold transition transform hover:scale-105"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
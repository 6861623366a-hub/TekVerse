import Message from '../models/Message.js';
import VoiceCall from '../models/VoiceCall.js';
import User from '../models/User.js';
import Channel from '../models/Channel.js';

const socketHandler = (io) => {
  const users = {};
  const calls = {};
  const voiceChannels = {};
  const typingUsers = {};

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Usuario entra en línea
    socket.on('user-online', (userId) => {
      users[userId] = socket.id;
      io.emit('user-status', { userId, status: 'online' });
      console.log(`👤 ${userId} is now online`);
    });

    // Unirse a canal de voz
    socket.on('join-voice-channel', (data) => {
      socket.join(`voice-${data.channelId}`);
      voiceChannels[data.channelId] = voiceChannels[data.channelId] || [];
      if (!voiceChannels[data.channelId].includes(data.userId)) {
        voiceChannels[data.channelId].push(data.userId);
      }
      io.to(`voice-${data.channelId}`).emit('user-joined-voice', {
        userId: data.userId,
        username: data.username,
        participants: voiceChannels[data.channelId]
      });
    });

    // Salir de canal de voz
    socket.on('leave-voice-channel', (data) => {
      socket.leave(`voice-${data.channelId}`);
      if (voiceChannels[data.channelId]) {
        voiceChannels[data.channelId] = voiceChannels[data.channelId].filter(
          id => id !== data.userId
        );
      }
      io.to(`voice-${data.channelId}`).emit('user-left-voice', {
        userId: data.userId,
        participants: voiceChannels[data.channelId] || []
      });
    });

    // Enviar mensaje
    socket.on('message-send', async (data) => {
      try {
        const message = new Message({
          content: data.content,
          author: data.userId,
          channel: data.channelId,
          server: data.serverId
        });
        await message.save();
        const populatedMessage = await message.populate('author');
        
        io.to(`channel-${data.channelId}`).emit('message-receive', {
          ...populatedMessage.toObject(),
          author: {
            _id: populatedMessage.author._id,
            username: populatedMessage.author.username,
            avatar: populatedMessage.author.avatar
          }
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Unirse a canal de texto
    socket.on('join-channel', (data) => {
      socket.join(`channel-${data.channelId}`);
    });

    // Salir de canal de texto
    socket.on('leave-channel', (data) => {
      socket.leave(`channel-${data.channelId}`);
    });

    // Indicador de escritura
    socket.on('typing', (data) => {
      if (!typingUsers[data.channelId]) {
        typingUsers[data.channelId] = [];
      }
      if (!typingUsers[data.channelId].includes(data.userId)) {
        typingUsers[data.channelId].push(data.userId);
      }
      io.to(`channel-${data.channelId}`).emit('user-typing', {
        userId: data.userId,
        username: data.username,
        typingUsers: typingUsers[data.channelId]
      });
    });

    // Dejar de escribir
    socket.on('stop-typing', (data) => {
      if (typingUsers[data.channelId]) {
        typingUsers[data.channelId] = typingUsers[data.channelId].filter(
          id => id !== data.userId
        );
      }
      io.to(`channel-${data.channelId}`).emit('user-stop-typing', {
        userId: data.userId,
        typingUsers: typingUsers[data.channelId]
      });
    });

    // Iniciar llamada de voz
    socket.on('voice-call-start', async (data) => {
      try {
        const call = new VoiceCall({
          participants: [{ user: data.userId }],
          channel: data.channelId,
          server: data.serverId,
          status: 'active'
        });
        await call.save();
        calls[data.channelId] = call._id;
        io.to(`voice-${data.channelId}`).emit('voice-call-started', {
          callId: call._id,
          initiator: data.userId,
          initiatorName: data.username
        });
      } catch (error) {
        console.error('Error starting call:', error);
      }
    });

    // Terminar llamada de voz
    socket.on('voice-call-end', async (data) => {
      try {
        if (calls[data.channelId]) {
          await VoiceCall.findByIdAndUpdate(calls[data.channelId], {
            status: 'ended',
            endedAt: new Date()
          });
          delete calls[data.channelId];
        }
        io.to(`voice-${data.channelId}`).emit('voice-call-ended', {
          channelId: data.channelId
        });
      } catch (error) {
        console.error('Error ending call:', error);
      }
    });

    // WebRTC Signal
    socket.on('webrtc-signal', (data) => {
      io.to(`voice-${data.channelId}`).emit('webrtc-signal', {
        from: data.userId,
        signal: data.signal
      });
    });

    // Iniciar compartir pantalla
    socket.on('screen-share-start', (data) => {
      io.to(`voice-${data.channelId}`).emit('screen-share-started', {
        userId: data.userId,
        username: data.username,
        streamId: data.streamId
      });
    });

    // Detener compartir pantalla
    socket.on('screen-share-stop', (data) => {
      io.to(`voice-${data.channelId}`).emit('screen-share-stopped', {
        userId: data.userId
      });
    });

    // Toggle cámara
    socket.on('camera-toggle', (data) => {
      io.to(`voice-${data.channelId}`).emit('camera-toggled', {
        userId: data.userId,
        enabled: data.enabled
      });
    });

    // Toggle micrófono
    socket.on('mic-toggle', (data) => {
      io.to(`voice-${data.channelId}`).emit('mic-toggled', {
        userId: data.userId,
        enabled: data.enabled
      });
    });

    // Cambio de estado de usuario
    socket.on('user-status-change', (data) => {
      io.emit('user-status', { userId: data.userId, status: data.status });
    });

    // Solicitud de amistad
    socket.on('friend-request', (data) => {
      if (users[data.toUserId]) {
        io.to(users[data.toUserId]).emit('friend-request-received', {
          from: data.fromUserId,
          fromName: data.fromName
        });
      }
    });

    // Aceptar solicitud de amistad
    socket.on('accept-friend-request', (data) => {
      if (users[data.fromUserId]) {
        io.to(users[data.fromUserId]).emit('friend-request-accepted', {
          from: data.toUserId,
          fromName: data.toUserName
        });
      }
    });

    // Notificación de invitación a servidor
    socket.on('server-invite', (data) => {
      if (users[data.toUserId]) {
        io.to(users[data.toUserId]).emit('server-invite-received', {
          serverName: data.serverName,
          inviteCode: data.inviteCode,
          from: data.fromUserId
        });
      }
    });

    // Reacción a mensaje
    socket.on('message-reaction', (data) => {
      io.to(`channel-${data.channelId}`).emit('message-reaction-added', {
        messageId: data.messageId,
        emoji: data.emoji,
        userId: data.userId
      });
    });

    // Desconexión
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
      for (let userId in users) {
        if (users[userId] === socket.id) {
          io.emit('user-status', { userId, status: 'offline' });
          delete users[userId];
        }
      }
    });
  });
};

export default socketHandler;
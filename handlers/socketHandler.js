import Message from '../models/Message.js';
import VoiceCall from '../models/VoiceCall.js';
import User from '../models/User.js';

const socketHandler = (io) => {
  const users = {};
  const calls = {};

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    socket.on('user-online', (userId) => {
      users[userId] = socket.id;
      io.emit('user-status', { userId, status: 'online' });
    });

    socket.on('message-send', async (data) => {
      try {
        io.to(data.channelId).emit('message-receive', data);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('typing', (data) => {
      io.to(data.channelId).emit('user-typing', { userId: data.userId, username: data.username });
    });

    socket.on('stop-typing', (data) => {
      io.to(data.channelId).emit('user-stop-typing', { userId: data.userId });
    });

    socket.on('voice-call-start', async (data) => {
      try {
        const call = new VoiceCall({
          participants: [{ user: data.userId }],
          channel: data.channelId,
          server: data.serverId
        });
        await call.save();
        calls[data.channelId] = call._id;
        io.to(data.channelId).emit('voice-call-started', { callId: call._id, initiator: data.userId });
      } catch (error) {
        console.error('Error starting call:', error);
      }
    });

    socket.on('voice-call-end', async (data) => {
      try {
        if (calls[data.channelId]) {
          await VoiceCall.findByIdAndUpdate(calls[data.channelId], { status: 'ended', endedAt: new Date() });
          delete calls[data.channelId];
        }
        io.to(data.channelId).emit('voice-call-ended', { channelId: data.channelId });
      } catch (error) {
        console.error('Error ending call:', error);
      }
    });

    socket.on('screen-share-start', (data) => {
      io.to(data.channelId).emit('screen-share-started', { userId: data.userId, streamId: data.streamId });
    });

    socket.on('screen-share-stop', (data) => {
      io.to(data.channelId).emit('screen-share-stopped', { userId: data.userId });
    });

    socket.on('camera-toggle', (data) => {
      io.to(data.channelId).emit('camera-toggled', { userId: data.userId, enabled: data.enabled });
    });

    socket.on('member-join', (data) => {
      io.to(data.channelId).emit('member-joined', { userId: data.userId, username: data.username });
    });

    socket.on('user-status-change', (data) => {
      io.emit('user-status', { userId: data.userId, status: data.status });
    });

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
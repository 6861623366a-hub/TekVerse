import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useMessageStore, useUserStore } from './store';

let socket = null;

export const useSocket = () => {
  useEffect(() => {
    socket = io('http://localhost:5000', {
      autoConnect: true
    });

    const messageStore = useMessageStore.getState();
    const userStore = useUserStore.getState();

    socket.on('message-receive', (data) => {
      messageStore.addMessage(data);
    });

    socket.on('user-status', (data) => {
      userStore.updateUserStatus(data.userId, data.status);
    });

    socket.on('user-typing', (data) => {
      // Handle typing indicator
    });

    socket.on('voice-call-started', (data) => {
      console.log('Voice call started:', data);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return socket;
};

export const sendMessage = (data) => {
  if (socket) socket.emit('message-send', data);
};

export const startVoiceCall = (data) => {
  if (socket) socket.emit('voice-call-start', data);
};

export const endVoiceCall = (data) => {
  if (socket) socket.emit('voice-call-end', data);
};

export const startScreenShare = (data) => {
  if (socket) socket.emit('screen-share-start', data);
};

export const stopScreenShare = (data) => {
  if (socket) socket.emit('screen-share-stop', data);
};

export const toggleCamera = (data) => {
  if (socket) socket.emit('camera-toggle', data);
};

export const emitUserTyping = (data) => {
  if (socket) socket.emit('typing', data);
};

export const emitStopTyping = (data) => {
  if (socket) socket.emit('stop-typing', data);
};

export const emitUserOnline = (userId) => {
  if (socket) socket.emit('user-online', userId);
};

export const emitStatusChange = (data) => {
  if (socket) socket.emit('user-status-change', data);
};
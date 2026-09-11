import { useEffect } from 'react';
import { io } from 'socket.io-client';

let notificationSocket = null;

export const useNotifications = () => {
  useEffect(() => {
    notificationSocket = io('http://localhost:5000', {
      autoConnect: true
    });

    notificationSocket.on('friend-request', (data) => {
      console.log('Friend request:', data);
      // Mostrar notificación
    });

    notificationSocket.on('server-invite', (data) => {
      console.log('Server invite:', data);
    });

    notificationSocket.on('mention', (data) => {
      console.log('You were mentioned:', data);
    });

    return () => {
      if (notificationSocket) notificationSocket.disconnect();
    };
  }, []);

  return notificationSocket;
};

export const sendFriendRequest = (toUserId) => {
  if (notificationSocket) notificationSocket.emit('friend-request', { toUserId });
};

export const acceptFriendRequest = (fromUserId) => {
  if (notificationSocket) notificationSocket.emit('accept-friend-request', { fromUserId });
};
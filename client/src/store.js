import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));

export const useServerStore = create((set) => ({
  servers: [],
  currentServer: null,
  setServers: (servers) => set({ servers }),
  setCurrentServer: (server) => set({ currentServer: server }),
  addServer: (server) => set((state) => ({ servers: [...state.servers, server] }))
}));

export const useChannelStore = create((set) => ({
  channels: [],
  currentChannel: null,
  setChannels: (channels) => set({ channels }),
  setCurrentChannel: (channel) => set({ currentChannel: channel })
}));

export const useMessageStore = create((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] }))
}));

export const useUserStore = create((set) => ({
  users: [],
  onlineUsers: [],
  setUsers: (users) => set({ users }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  updateUserStatus: (userId, status) => set((state) => ({
    onlineUsers: state.onlineUsers.map(u => u.id === userId ? { ...u, status } : u)
  }))
}));
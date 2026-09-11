import axios from 'axios';
import { useAuthStore } from './store';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username, email, password) => API.post('/auth/register', { username, email, password }),
  login: (email, password) => API.post('/auth/login', { email, password }),
  me: () => API.get('/auth/me')
};

export const userAPI = {
  getUser: (id) => API.get(`/users/${id}`),
  updateProfile: (id, data) => API.patch(`/users/${id}`, data),
  linkGame: (id, gameData) => API.post(`/users/${id}/link-game`, gameData),
  addFriend: (id, friendId) => API.post(`/users/${id}/add-friend`, { friendId }),
  upgradeTier: (id, tier) => API.post(`/users/${id}/tier-upgrade`, { tier })
};

export const serverAPI = {
  createServer: (data) => API.post('/servers', data),
  getServer: (id) => API.get(`/servers/${id}`),
  updateServer: (id, data) => API.patch(`/servers/${id}`, data),
  joinServer: (id, inviteCode) => API.post(`/servers/${id}/join`, { inviteCode }),
  createRole: (id, roleData) => API.post(`/servers/${id}/roles`, roleData),
  leaveServer: (id) => API.post(`/servers/${id}/leave`)
};

export const channelAPI = {
  createChannel: (data) => API.post('/channels', data),
  getChannel: (id) => API.get(`/channels/${id}`),
  updateChannel: (id, data) => API.patch(`/channels/${id}`, data),
  deleteChannel: (id) => API.delete(`/channels/${id}`)
};

export const messageAPI = {
  sendMessage: (data) => API.post('/messages', data),
  editMessage: (id, data) => API.patch(`/messages/${id}`, data),
  deleteMessage: (id) => API.delete(`/messages/${id}`),
  reactMessage: (id, emoji) => API.post(`/messages/${id}/react`, { emoji }),
  getChannelMessages: (channelId) => API.get(`/messages/channel/${channelId}`)
};

export default API;
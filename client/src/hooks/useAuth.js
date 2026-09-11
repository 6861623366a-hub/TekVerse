import { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { authAPI } from '../api';

export const useAuth = () => {
  const { user, token, setUser, setToken, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      authAPI.me()
        .then(res => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await authAPI.register(username, email, password);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  return { user, token, loading, login, register, logout };
};
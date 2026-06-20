import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI, getErrorMessage } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('wastewise_token'));
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('wastewise_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getMe();
        setUser(response.data.data);
        localStorage.setItem('wastewise_user', JSON.stringify(response.data.data));
      } catch {
        localStorage.removeItem('wastewise_token');
        localStorage.removeItem('wastewise_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const dashboardPath = (role = user?.role) => (role === 'admin' ? '/admin' : '/dashboard');

  const login = async ({ email, password }) => {
    try {
      const response = await authAPI.login({ email, password });
      const nextToken = response.data.data.token;
      const nextUser = response.data.data.user;
      localStorage.setItem('wastewise_token', nextToken);
      localStorage.setItem('wastewise_user', JSON.stringify(nextUser));
      setToken(nextToken);
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Login failed'));
    }
  };

  const logout = () => {
    localStorage.removeItem('wastewise_token');
    localStorage.removeItem('wastewise_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const response = await authAPI.getMe();
    setUser(response.data.data);
    localStorage.setItem('wastewise_user', JSON.stringify(response.data.data));
    return response.data.data;
  };

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    dashboardPath,
    login,
    logout,
    refreshUser
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

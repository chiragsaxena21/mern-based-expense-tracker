import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('spendwise_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('spendwise_token');
      const savedUser = localStorage.getItem('spendwise_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        } catch (err) {
          console.error('Error parsing stored user data:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('spendwise_token', receivedToken);
    localStorage.setItem('spendwise_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
    return response.data;
  };

  // Register handler
  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token: receivedToken, user: receivedUser } = response.data;

    localStorage.setItem('spendwise_token', receivedToken);
    localStorage.setItem('spendwise_user', JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
    return response.data;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('spendwise_token');
    localStorage.removeItem('spendwise_user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

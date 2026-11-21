import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { nombre: string; email: string; password: string; dni?: string; direccion?: string; telefono?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
      }
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { user: userData, token: userToken } = res.data.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
    }
  };

  const register = async (data: { nombre: string; email: string; password: string; dni?: string; direccion?: string; telefono?: string }) => {
    const res = await api.post('/auth/register', data);
    if (res.data.success) {
      const { user: userData, token: userToken } = res.data.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const isAdmin = user?.rol === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

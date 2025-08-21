// src/hooks/AuthContext.jsx

import React, { useState, useEffect, useContext, createContext } from 'react';
import { toast } from 'react-toastify';
import Auth from '../services/Auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 Adicione o estado de carregamento

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false); // 👈 Finaliza o carregamento após a verificação
  }, []);

  const login = async (credentials) => {
    try {
      const { token, user } = await Auth.login(credentials);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
      toast.success('Login bem-sucedido!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Credenciais inválidas. Tente novamente.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    toast.info('Você foi desconectado.');
  };

  const authValue = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading, // 👈 Exponha o estado de carregamento
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};

// src/hooks/AuthContext.jsx

import React, { useState, useEffect, useContext, createContext } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Auth from '../services/Auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para verificar se o token JWT é válido
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser && isTokenValid(token)) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    } else if (token) {
      // 👈  Verifique se o token existe antes de deslogar
      // Se o token existe, mas é inválido, deslogue e mostre a mensagem
      logout(true); // Passe um argumento para indicar que a sessão expirou
    } else {
      // Se não houver token, apenas finalize o carregamento sem deslogar
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const { token, user } = await Auth.login(credentials);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Credenciais inválidas. Tente novamente.');
      return false;
    }
  };

  // Ajuste a função logout para ser mais flexível
  const logout = (showToast = false) => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    if (showToast) {
      // 👈 Exibe a mensagem apenas quando a sessão realmente expira
      toast.info('Sessão expirada. Por favor, faça login novamente.');
    }
  };

  const authValue = {
    isAuthenticated,
    user,
    login,
    logout: () => logout(false), // Ajuste a chamada de logout para o resto do app
    isLoading,
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

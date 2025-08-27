import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3000/api/v1',
  baseURL: 'https://gecebs-production.up.railway.app/api/v1',
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    // Lista de rotas que NÃO precisam de autenticação
    const publicRoutes = ['/auth/login', '/auth/register-team'];

    // Verifica se a URL da requisição NÃO está na lista de rotas públicas
    if (!publicRoutes.includes(config.url)) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Adiciona um interceptor de resposta para tratar erros de token expirado, etc.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Exemplo de tratamento para token inválido ou expirado
    if (error.response?.status === 401 && error.config.url !== '/auth/login') {
      // Limpa o token e redireciona para a página de login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

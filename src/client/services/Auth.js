import api from './api';

const Auth = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  registerTeam: async (userData) => {
    try {
      const response = await api.post('/auth/register-team', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  checkEmailExists: async (email) => {
    try {
      const response = await api.get(`/auth/email-exists?email=${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default Auth;

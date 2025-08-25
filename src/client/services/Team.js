// src/services/Team.js

import api from './api';

const TeamService = {
  /**
   * Busca os detalhes do time do usuário logado.
   */
  getTeamDetails: async () => {
    try {
      const response = await api.get('/team/details');
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de time (getTeamDetails):', error);
      throw error;
    }
  },

  /**
   * Atualiza os dados do time.
   * @param {object} teamData - Dados para atualização.
   */
  updateTeam: async (teamData) => {
    try {
      const response = await api.patch('/team/update', teamData);
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de time (updateTeam):', error);
      throw error;
    }
  },

  /**
   * Atualiza as senhas de todos os managers do time.
   * @param {string} password - A nova senha.
   */
  updateManagerPasswords: async (password) => {
    try {
      const response = await api.patch('/team/update-manager-passwords', { password });
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de time (updateManagerPasswords):', error);
      throw error;
    }
  },

  /**
   * Atualiza as senhas de todos os atletas do time.
   * @param {string} password - A nova senha.
   */
  updateAthletePasswords: async (password) => {
    try {
      const response = await api.patch('/team/update-athlete-passwords', { password });
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de time (updateAthletePasswords):', error);
      throw error;
    }
  },
};

export default TeamService;

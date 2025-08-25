// src/services/Manager.js

import api from './api';

const Manager = {
  /**
   * Cria um novo manager para o time.
   * Rota: POST /manager/create-manager
   * @param {object} managerData - Dados do manager (firstName, lastName, phone, managerCategoriesIds).
   */
  create: async (managerData) => {
    try {
      const response = await api.post('/manager/create-manager', managerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca um manager por ID.
   * Rota: GET /manager/:id
   * @param {number} managerId - O ID do manager.
   */
  getById: async (managerId) => {
    try {
      const response = await api.get(`/manager/${managerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista todos os managers de um time, incluindo as categorias que eles gerenciam.
   * Rota: GET /manager/list-all
   */
  getAllTeamManagers: async () => {
    try {
      const response = await api.get('/manager/list-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza os dados de um manager existente.
   * Rota: PATCH /manager/update/:id
   * @param {number} managerId - O ID do manager a ser atualizado.
   * @param {object} managerData - Dados para atualização.
   */

  update: async (managerId, managerData) => {
    try {
      const response = await api.patch(`/manager/update/${managerId}`, managerData); // <-- Esta rota agora está correta!
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deleta um manager e seu usuário associado.
   * Rota: DELETE /manager/delete/:id
   * @param {number} managerId - O ID do manager a ser deletado.
   */
  delete: async (managerId) => {
    try {
      const response = await api.delete(`/manager/${managerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default Manager;

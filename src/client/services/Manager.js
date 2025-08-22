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

  // ... (As outras funções como update e delete permanecem as mesmas por enquanto)
  // Nota: Você pode precisar ajustar a função de atualização para também aceitar managerCategoriesIds, caso queira permitir a alteração das categorias de um manager existente.

  /**
   * Exemplo de como ficaria a busca de managers com as categorias associadas
   * Essa rota precisa ser criada no backend para funcionar
   */
  getAllTeamManagers: async () => {
    try {
      const response = await api.get('/manager/list-all'); // Rota a ser criada no backend
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza os dados de um manager existente.
   * Rota: PATCH /manager/update/:id
   * @param {number} managerId - O ID do manager a ser atualizado.
   * @param {object} managerData - Dados para atualização (firstName, lastName, phone).
   */
  update: async (managerId, managerData) => {
    try {
      const response = await api.patch(`/manager/update/${managerId}`, managerData);
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

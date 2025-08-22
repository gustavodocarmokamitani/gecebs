import api from './api';

const User = {
  /**
   * Lista todos os usuários do time.
   */
  list: async () => {
    try {
      const response = await api.get('/users/list-users');
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de usuários (list):', error);
      throw error;
    }
  },

  /**
   * Cria um novo usuário.
   * @param {object} userData - Dados do usuário.
   */
  create: async (userData) => {
    try {
      const response = await api.post('/users/create-user', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca um usuário por ID.
   * @param {number} id - ID do usuário.
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza os dados de um usuário.
   * @param {number} id - ID do usuário a ser atualizado.
   * @param {object} updateData - Dados para atualização.
   */
  update: async (id, updateData) => {
    try {
      const response = await api.patch(`/users/update-user/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Exclui um usuário por ID.
   * @param {number} id - ID do usuário a ser excluído.
   */
  remove: async (id) => {
    try {
      const response = await api.delete(`/users/delete-user/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default User;

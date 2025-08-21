import api from './api';

const Athlete = {
  /**
   * Cria um novo atleta.
   * @param {object} athleteData - Dados do atleta.
   */
  create: async (athleteData) => {
    try {
      const response = await api.post('/athlete/create-athlete', athleteData);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca um atleta por ID.
   * @param {number} id - ID do atleta.
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/athlete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista todos os atletas do time.
   */
  list: async () => {
    try {
      const response = await api.get('/athlete/list-athletes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza os dados e as categorias de um atleta.
   * @param {number} id - ID do atleta a ser atualizado.
   * @param {object} updateData - Dados para atualização, incluindo as categorias.
   */
  update: async (id, updateData) => {
    try {
      const response = await api.patch(`/athlete/update-athlete/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Exclui um atleta por ID.
   * @param {number} id - ID do atleta a ser excluído.
   */
  remove: async (id) => {
    try {
      const response = await api.delete(`/athlete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default Athlete;

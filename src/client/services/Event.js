// src/services/Event.js
import api from './api';

const Event = {
  /**
   * Cria um novo evento.
   * Rota: POST /event/create
   * @param {object} eventData - Dados do evento (name, description, etc.).
   */
  create: async (eventData) => {
    try {
      const response = await api.post('/event/create', eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca os atletas de um evento e seus status de confirmação.
   * Rota: GET /event/athletes/:id
   * @param {number} eventId - ID do evento.
   */
  getConfirmedAthletes: async (eventId) => {
    try {
      const response = await api.get(`/event/athletes/${eventId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista todos os eventos criados para o time do manager.
   * Rota: GET /event/list-all-team-events
   */
  listAllTeamEvents: async () => {
    try {
      const response = await api.get('/event/list-all-team-events');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista todos os eventos criados para o time do manager.
   * Rota: GET /event/list-all-team-events
   */
  listAllTeamEventsNotFinalized: async () => {
    try {
      const response = await api.get('/event/list-all-team-events-not-finalized');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista os eventos aos quais o atleta está associado.
   * Rota: GET /event/list-all-events-athletics
   */
  listMyEvents: async () => {
    try {
      const response = await api.get('/event/list-all-events-athletics');

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  listMyEventsAll: async () => {
    try {
      const response = await api.get('/event/list-all-events-athletics-all');

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Busca um evento específico por ID.
   * Rota: GET /event/get-by-id/:id
   * @param {number} id - ID do evento a ser buscado.
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/event/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza um evento existente.
   * Rota: PATCH /event/update/:id
   * @param {number} id - ID do evento a ser atualizado.
   * @param {object} updateData - Dados para atualização.
   */
  update: async (id, updateData) => {
    try {
      const response = await api.patch(`/event/update/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  finalizeEvent: async (eventId) => {
    try {
      const response = await api.patch(`/event/finalize/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao finalizar evento:', error);
      throw error;
    }
  },

  /**
   * Exclui um evento por ID.
   * Rota: DELETE /event/delete/:id
   * @param {number} id - ID do evento a ser excluído.
   */
  remove: async (id) => {
    try {
      const response = await api.delete(`/event/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Alterna a presença do atleta em um evento (Confirma/Desconfirma).
   * Rota: PATCH /event/toggle-confirmation/:confirmationId
   * @param {number} confirmationId - ID da confirmação.
   */
  toggleConfirmation: async (confirmationId) => {
    try {
      const response = await api.patch(`/event/toggle-confirmation/${confirmationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirma a presença do atleta em um evento.
   * Rota: POST /event/confirm-presence/:eventId
   * @param {number} eventId - ID do evento.
   */
  confirmPresence: async (eventId) => {
    try {
      const response = await api.post(`/event/confirm-presence/${eventId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtém as métricas de análise para um evento.
   * Rota: GET /event/:eventId/analytics
   */
  getEventAnalytics: async (eventId) => {
    try {
      const response = await api.get(`/event/${eventId}/analytics`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default Event;

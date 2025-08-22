import api from './api';

const Payment = {
  /**
   * Obtém um pagamento por ID, incluindo seus itens.
   * Rota: GET /payment/:id
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/payment/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Adiciona um item a um pagamento.
   * Rota: POST /payment/:id/items
   * @param {number} paymentId - O ID do pagamento.
   * @param {object} itemData - Dados do item (name, value, quantityEnabled).
   */
  addItem: async (paymentId, itemData) => {
    try {
      const response = await api.post(`/payment/${paymentId}/items`, itemData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deleta um item de um pagamento.
   * Rota: DELETE /payment/item/:itemId
   * @param {number} itemId - O ID do item a ser deletado.
   */
  deleteItem: async (itemId) => {
    try {
      // A rota do backend é /payment/item/:itemId
      const response = await api.delete(`/payment/item/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista todos os pagamentos de um time.
   * Rota: GET /payment/list-all-team-payments
   */
  listAllTeamPayments: async () => {
    try {
      const response = await api.get('/payment/list-all-team-payments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lista os pagamentos do atleta logado.
   * Rota: GET /payment/list-all-payments-athletics
   */
  listMyPayments: async () => {
    try {
      const response = await api.get('/payment/list-all-payments-athletics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cria um novo pagamento.
   * Rota: POST /payment/create-payment
   */
  create: async (paymentData) => {
    try {
      const response = await api.post('/payment/create-payment', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza os dados de um pagamento existente.
   * Rota: PATCH /payment/update/:id
   */
  update: async (id, paymentData) => {
    try {
      const response = await api.patch(`/payment/update/${id}`, paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deleta um pagamento e suas associações.
   * Rota: DELETE /payment/delete/:id
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/payment/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirma o pagamento de um item para o usuário logado.
   * Rota: POST /payment/confirm
   */
  confirm: async (paymentId) => {
    try {
      const response = await api.post('/payment/confirm', { paymentId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default Payment;

import api from './api';

const Payment = {
  /**
   * Obtém um pagamento por ID, incluindo seus itens.
   * Rota: GET /payment/:id
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/payment/get-by-id/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtém a lista de atletas de um pagamento com seus status de pagamento.
   * @param {number} paymentId - O ID do pagamento.
   * @returns {Promise<Array>} A lista de atletas com status de pagamento.
   */
  getAthletesWithPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payment/${paymentId}/confirmations`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza um item de um pagamento.
   * Rota: PATCH /payment/item/:itemId
   * @param {number} itemId - O ID do item a ser atualizado.
   * @param {object} itemData - Dados do item (name, value, quantityEnabled).
   */
  updateItem: async (itemId, itemData) => {
    try {
      const response = await api.patch(`/payment/item/${itemId}`, itemData);
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

  listMyPayments: async () => {
    try {
      const response = await api.get('/payment/list-all-payments-athletics');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar os pagamentos do atleta:', error);
      throw error;
    }
  },

  listMyPaymentsAll: async () => {
    try {
      const response = await api.get('/payment/list-all-payments-athletics-all');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar os pagamentos do atleta:', error);
      throw error;
    }
  },

  // ✅ Rota para buscar detalhes de um pagamento específico
  getPaymentDetails: async (paymentId) => {
    try {
      const response = await api.get(`/payment/details/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes do pagamento:', error);
      throw error;
    }
  },

  // ✅ Rota para processar o pagamento com os itens selecionados
  processPaymentWithItems: async (paymentId, selectedItems) => {
    try {
      const response = await api.post('/payment/process-with-items', {
        paymentId,
        selectedItems,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      throw error;
    }
  },

  /**
   * Obtém um resumo do valor total e a contagem de itens pagos para um pagamento.
   * Rota: GET /payment/:paymentId/summary
   */
  getPaymentSummary: async (paymentId) => {
    try {
      const response = await api.get(`/payment/${paymentId}/summary`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar o resumo do pagamento:', error);
      throw error;
    }
  },

  /**
   * Finaliza um pagamento, tornando-o não-editável.
   * Rota: PATCH /payment/finalize/:id
   */
  finalizePayment: async (paymentId) => {
    try {
      const response = await api.patch(`/payment/finalize/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao finalizar o pagamento:', error);
      throw error;
    }
  },
};

export default Payment;

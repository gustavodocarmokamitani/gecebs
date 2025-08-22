// src/services/Category.js
import api from './api';

const CategoryService = {
  // Busca todas as categorias do time autenticado
  getAll: async () => {
    try {
      const response = await api.get('/categories/list');
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de categorias (getAll):', error);
      throw error;
    }
  },

  // Cria uma nova categoria
  create: async (categoryData) => {
    try {
      const response = await api.post('/categories/create', categoryData);
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de categorias (create):', error);
      throw error;
    }
  },

  // Atualiza uma categoria existente
  // Supondo um endpoint de API: PUT /categories/:id
  update: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de categorias (update):', error);
      throw error;
    }
  },

  // Deleta uma categoria
  // Supondo um endpoint de API: DELETE /categories/:id
  remove: async (categoryId) => {
    try {
      const response = await api.delete(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de categorias (remove):', error);
      throw error;
    }
  },
};

export default CategoryService;

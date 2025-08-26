import api from './api';

const AnalyticsService = {
  exportAnalytics: async () => {
    try {
      const response = await api.get('/analytics/export/analytics');
      return response.data;
    } catch (error) {
      console.error('Erro no serviço de análise:', error);
      throw error;
    }
  },
};

export default AnalyticsService;

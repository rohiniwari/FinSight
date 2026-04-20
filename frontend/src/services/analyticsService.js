import api from './api.js';

export const analyticsService = {
  async getSummary(params = {}) {
    const { data } = await api.get('/analytics/summary', { params });
    return data;
  },

  async getMonthlyTrend(months = 6) {
    const { data } = await api.get('/analytics/monthly', { params: { months } });
    return data.monthly_trend;
  },

  async getHealthScore() {
    const { data } = await api.get('/analytics/health-score');
    return data.health_score;
  },

  async getInsights() {
    const { data } = await api.get('/analytics/insights');
    return data.insights;
  },
};

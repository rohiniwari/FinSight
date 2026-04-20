import api from './api.js';

export const budgetService = {
  async getAll(params = {}) {
    const { data } = await api.get('/budgets', { params });
    return data.budgets;
  },

  async create(payload) {
    const { data } = await api.post('/budgets', payload);
    return data.budget;
  },

  async update(id, payload) {
    const { data } = await api.put(`/budgets/${id}`, payload);
    return data.budget;
  },

  async remove(id) {
    await api.delete(`/budgets/${id}`);
  },
};

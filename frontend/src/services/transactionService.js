import api from './api.js';

export const transactionService = {
  async getAll(params = {}) {
    const { data } = await api.get('/transactions', { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/transactions/${id}`);
    return data.transaction;
  },

  async create(payload) {
    const { data } = await api.post('/transactions', payload);
    return data.transaction;
  },

  async update(id, payload) {
    const { data } = await api.put(`/transactions/${id}`, payload);
    return data.transaction;
  },

  async remove(id) {
    await api.delete(`/transactions/${id}`);
  },

  async getCategories() {
    const { data } = await api.get('/transactions/categories');
    return data.categories;
  },
};

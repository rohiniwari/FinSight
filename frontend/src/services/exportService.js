import api from './api.js';

export const exportService = {
  async downloadCSV(params = {}) {
    const response = await api.get('/export/csv', {
      params,
      responseType: 'blob',
    });
    const url  = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href  = url;
    link.setAttribute('download', `finsight-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async downloadPDF(params = {}) {
    const response = await api.get('/export/pdf', {
      params,
      responseType: 'blob',
    });
    const url  = window.URL.createObjectURL(
      new Blob([response.data], { type: 'application/pdf' })
    );
    const link = document.createElement('a');
    link.href  = url;
    link.setAttribute('download', `finsight-report-${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

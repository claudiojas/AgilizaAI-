import api from './api';

type Period = 'week' | 'month';

export const reportsService = {
  getSalesOverTime: async (period: Period) => {
    const { data } = await api.get('/reports/sales-over-time', { params: { period } });
    return data;
  },

  getProductPerformance: async (period: Period) => {
    const { data } = await api.get('/reports/product-performance', { params: { period } });
    return data;
  },

  getSalesByPaymentMethod: async (period: Period) => {
    const { data } = await api.get('/reports/sales-by-payment-method', { params: { period } });
    return data;
  },

  getSalesByTable: async (period: Period) => {
    const { data } = await api.get('/reports/sales-by-table', { params: { period } });
    return data;
  },
};

import api from './api';
import type { Order, OrderStatus } from '@/types';

export const ordersService = {
  getAll: async (status?: OrderStatus): Promise<Order[]> => {
    const params = status ? { status } : {};
    const { data } = await api.get('/orders', { params });
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },

  getBySession: async (sessionId: string): Promise<Order[]> => {
    const { data } = await api.get(`/sessions/${sessionId}/orders`);
    return data;
  },
};

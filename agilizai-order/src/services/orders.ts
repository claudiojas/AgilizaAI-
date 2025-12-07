import api from './api';
import type { Order } from '@/types';

export const ordersService = {
  create: async (sessionId: string, items: Array<{ productId: string; quantity: number }>): Promise<Order> => {
    const { data } = await api.post('/orders', {
      sessionId,
      items,
    });
    return data;
  },

  getBySession: async (sessionId: string): Promise<Order[]> => {
    const { data } = await api.get(`/orders/session/${sessionId}`);
    return data;
  },

  getAll: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders');
    return data;
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
};


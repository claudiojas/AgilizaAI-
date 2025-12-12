import api from './api';
import type { Order, OrderStatus } from '@/types';

// Interfaces for order creation
export interface ICreateOrderItemForOrder {
    productId: string;
    quantity: number;
}

export interface ICreateOrder {
    sessionId: string,
    items: ICreateOrderItemForOrder[];
}

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

  create: async (orderData: ICreateOrder): Promise<Order> => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },

  getBySession: async (sessionId: string): Promise<Order[]> => {
    const { data } = await api.get(`/orders/session/${sessionId}`);
    return data;
  },
};

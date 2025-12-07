import api from './api';
import type { Product, Category } from '@/types';

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get('/products');
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },
};


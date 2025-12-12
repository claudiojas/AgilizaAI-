import api from './api';
import type { Product, Category } from '@/types';

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await api.get('/products');
    return data;
  },

  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data;
  },

  create: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const { data } = await api.post('/products', productData);
    return data;
  },

  createCategory: async (categoryData: { name: string }): Promise<Category> => {
    const { data } = await api.post('/categorie', categoryData);
    return data;
  },

  update: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const { data } = await api.patch(`/products/${id}`, productData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import type { Product, Category } from '@/types';

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productsService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => productsService.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}


import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products';

export const useProductsQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  });
};

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productsService.getCategories,
  });
};
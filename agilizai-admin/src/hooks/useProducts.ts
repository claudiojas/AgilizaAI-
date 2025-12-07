import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import type { Product, Category } from '@/types';
import { toast } from '@/hooks/use-toast';

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

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Produto criado',
        description: 'O novo produto foi adicionado ao cardápio.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o produto.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Produto atualizado',
        description: 'As alterações foram salvas.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o produto.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Produto removido',
        description: 'O produto foi excluído do cardápio.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o produto.',
        variant: 'destructive',
      });
    },
  });
};

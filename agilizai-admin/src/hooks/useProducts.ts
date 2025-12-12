import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import { toast } from '@/hooks/use-toast';
import type { Product } from '@/types';

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

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Produto atualizado',
        description: 'As informações do produto foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar produto',
        description: error.response?.data?.error || 'Não foi possível atualizar o produto.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Categories might also be affected if a product is the last in a category, might need to re-evaluate
      queryClient.invalidateQueries({ queryKey: ['categories'] }); 
      toast({
        title: 'Produto excluído',
        description: 'O produto foi removido permanentemente.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao excluir produto',
        description: error.response?.data?.error || 'Não foi possível excluir o produto.',
        variant: 'destructive',
      });
    },
  });
};
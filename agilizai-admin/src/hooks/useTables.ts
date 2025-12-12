import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tablesService } from '@/services/tables';
import type { Table } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useTablesQuery = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: tablesService.getAll,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useTableQuery = (id: string) => {
  return useQuery({
    queryKey: ['tables', id],
    queryFn: () => tablesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tablesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      toast({
        title: 'Mesa criada',
        description: 'A nova mesa foi adicionada com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a mesa.',
        variant: 'destructive',
      });
    },
  });
};

export const useOpenSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tablesService.openSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'active'] });
      toast({
        title: 'Sessão aberta',
        description: 'A mesa está pronta para receber pedidos.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível abrir a sessão.',
        variant: 'destructive',
      });
    },
  });
};

export const useCloseSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tablesService.closeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'active'] });
      toast({
        title: 'Sessão fechada',
        description: 'A conta foi encerrada com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível fechar a sessão.',
        variant: 'destructive',
      });
    },
  });
};

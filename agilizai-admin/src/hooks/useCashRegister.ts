import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cashRegisterService } from '@/services/cashRegister';
import { toast } from '@/hooks/use-toast';

export const useActiveCashRegister = () => {
  return useQuery({
    queryKey: ['activeCashRegister'],
    queryFn: cashRegisterService.getActive,
    staleTime: Infinity, // This data is critical and should be refetched manually or via invalidation
  });
};

export const useOpenCashRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (initialValue: number) => cashRegisterService.open(initialValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      toast({
        title: 'Caixa Aberto',
        description: 'O caixa foi aberto com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao Abrir Caixa',
        description: error.response?.data?.error || 'Não foi possível abrir o caixa.',
        variant: 'destructive',
      });
    },
  });
};

export const useCloseCashRegisterMutation = (options: { onSuccess?: (data: any) => void } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cashRegisterService.close,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activeCashRegister'] });
      queryClient.invalidateQueries({ queryKey: ['cashRegistersHistory'] }); // Invalidate history too
      toast({
        title: 'Caixa Fechado',
        description: 'O caixa foi fechado com sucesso.',
      });
      options.onSuccess?.(data);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao Fechar Caixa',
        description: error.response?.data?.error || 'Não foi possível fechar o caixa.',
        variant: 'destructive',
      });
    },
  });
};

export const useCashRegisterHistoryQuery = (filters?: { startDate?: string, endDate?: string }) => {
  return useQuery({
    queryKey: ['cashRegistersHistory', filters],
    queryFn: () => cashRegisterService.getHistory(filters),
    enabled: true, // Always enabled, just refetch on filter change
  });
};

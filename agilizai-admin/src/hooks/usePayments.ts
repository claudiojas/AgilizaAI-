import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { paymentsService, ICloseBillPayload } from '@/services/payments';
import { toast } from '@/hooks/use-toast';

export const useCloseBillMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ICloseBillPayload) => paymentsService.closeBill(payload),
    onSuccess: () => {
      toast({
        title: 'Conta Fechada',
        description: 'O pagamento foi registrado e a sessão foi encerrada com sucesso.',
      });
      
      // Invalidate queries to refetch data on the tables page
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'active'] });

      // Navigate back to the tables page
      navigate('/tables');
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao fechar a conta',
        description: error.response?.data?.error || 'Não foi possível processar o pagamento.',
        variant: 'destructive',
      });
    },
  });
};

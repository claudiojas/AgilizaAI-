import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/orders';
import type { Order, OrderStatus } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useOrdersQuery = (status?: OrderStatus) => {
  return useQuery({
    queryKey: ['orders', status],
    queryFn: () => ordersService.getAll(status),
    refetchInterval: 10000, // Refetch every 10 seconds for kitchen
  });
};

export const useKitchenOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders', 'kitchen'],
    queryFn: async () => {
      const orders = await ordersService.getAll();
      return orders.filter(
        (order) => ['PENDING', 'PREPARING', 'READY'].includes(order.status)
      );
    },
    refetchInterval: 5000, // Faster refresh for kitchen
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersService.updateStatus(id, status),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      const statusMessages: Record<OrderStatus, string> = {
        PENDING: 'Pedido pendente',
        PREPARING: 'Pedido em preparo',
        READY: 'Pedido pronto para entrega',
        DELIVERED: 'Pedido entregue',
        CANCELLED: 'Pedido cancelado',
      };

      toast({
        title: 'Status atualizado',
        description: statusMessages[updatedOrder.status],
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status do pedido.',
        variant: 'destructive',
      });
    },
  });
};

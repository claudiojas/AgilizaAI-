import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService, ICreateOrder } from '@/services/orders';
import { toast } from '@/hooks/use-toast';
import type { Order, OrderStatus } from '@/types'; // Import Order and OrderStatus

// Hooks related to general orders (e.g., for KitchenPage, old useOrders.ts content)
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

// New hooks (for SessionDetailPage, my previous useOrders.ts content)
export const useOrdersBySessionQuery = (sessionId: string) => {
  return useQuery({
    queryKey: ['orders', 'session', sessionId],
    queryFn: () => ordersService.getBySession(sessionId),
    enabled: !!sessionId,
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: ICreateOrder) => ordersService.create(orderData),
    onSuccess: (data) => {
      // Invalidate the orders for the specific session to refetch
      queryClient.invalidateQueries({ queryKey: ['orders', 'session', data.sessionId] });
      toast({
        title: 'Pedido adicionado',
        description: 'O novo pedido foi adicionado à sessão.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao adicionar pedido',
        description: error.response?.data?.error || 'Não foi possível adicionar o pedido.',
        variant: 'destructive',
      });
    },
  });
};

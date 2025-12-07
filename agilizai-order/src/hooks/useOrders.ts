import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders';
import type { Order } from '@/types';

export function useOrders(sessionId: string | null) {
  return useQuery<Order[]>({
    queryKey: ['orders', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      return ordersService.getBySession(sessionId);
    },
    enabled: !!sessionId,
    staleTime: 1000 * 30, // 30 seconds
  });
}


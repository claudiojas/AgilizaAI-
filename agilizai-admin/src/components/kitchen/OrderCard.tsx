import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const statusConfig: Record<
  'PENDING' | 'PREPARING' | 'READY',
  { label: string; nextStatus: OrderStatus | null; nextLabel: string; colorClass: string }
> = {
  PENDING: {
    label: 'Pendente',
    nextStatus: 'PREPARING',
    nextLabel: 'Iniciar Preparo',
    colorClass: 'bg-kanban-pending text-warning-foreground',
  },
  PREPARING: {
    label: 'Em Preparo',
    nextStatus: 'READY',
    nextLabel: 'Marcar como Pronto',
    colorClass: 'bg-kanban-preparing text-primary-foreground',
  },
  READY: {
    label: 'Pronto',
    nextStatus: 'DELIVERED',
    nextLabel: 'Entregar',
    colorClass: 'bg-kanban-ready text-success-foreground',
  },
};

const OrderCard = ({ order, onUpdateStatus }: OrderCardProps) => {
  const config = statusConfig[order.status as 'PENDING' | 'PREPARING' | 'READY'];

  const timeAgo = useMemo(() => {
    return formatDistanceToNow(new Date(order.createdAt), {
      locale: ptBR,
      addSuffix: true,
    });
  }, [order.createdAt]);

  const isUrgent = useMemo(() => {
    const minutesAgo = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
    return order.status === 'PENDING' && minutesAgo > 10;
  }, [order.createdAt, order.status]);

  if (!config) return null;

  return (
    <Card
      className={cn(
        'group animate-slide-up overflow-hidden border transition-all duration-300 hover:shadow-elevated',
        isUrgent && 'ring-2 ring-destructive/50'
      )}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
              {order.session?.table?.number || '?'}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Mesa {order.session?.table?.number || 'N/A'}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {timeAgo}
              </div>
            </div>
          </div>
          {isUrgent && (
            <Badge variant="destructive" className="animate-pulse">
              Urgente
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        {/* Order Items */}
        <div className="mb-3 space-y-2 rounded-lg bg-secondary/30 p-3">
          {(order.orderItems || []).map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'flex items-start gap-2',
                index < (order.orderItems?.length || 0) - 1 && 'border-b border-border/50 pb-2'
              )}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                {item.quantity}x
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {item.product?.name || 'Produto'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {config.nextStatus && (
          <Button
            className={cn(
              'w-full gap-2 font-medium transition-all',
              order.status === 'PENDING' &&
                'bg-primary hover:bg-primary/90 text-primary-foreground',
              order.status === 'PREPARING' &&
                'bg-success hover:bg-success/90 text-success-foreground',
              order.status === 'READY' &&
                'bg-accent hover:bg-accent/90 text-accent-foreground'
            )}
            onClick={() => onUpdateStatus(order.id, config.nextStatus!)}
          >
            {order.status === 'PENDING' && (
              <UtensilsCrossed className="h-4 w-4" />
            )}
            {config.nextLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;

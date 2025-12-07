import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';
import OrderCard from './OrderCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  title: string;
  status: 'PENDING' | 'PREPARING' | 'READY';
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const columnStyles = {
  PENDING: {
    headerBg: 'bg-warning/10',
    headerBorder: 'border-warning/30',
    headerText: 'text-warning',
    dotClass: 'bg-warning',
  },
  PREPARING: {
    headerBg: 'bg-primary/10',
    headerBorder: 'border-primary/30',
    headerText: 'text-primary',
    dotClass: 'bg-primary animate-pulse',
  },
  READY: {
    headerBg: 'bg-success/10',
    headerBorder: 'border-success/30',
    headerText: 'text-success',
    dotClass: 'bg-success',
  },
};

const KanbanColumn = ({
  title,
  status,
  orders,
  onUpdateStatus,
}: KanbanColumnProps) => {
  const styles = columnStyles[status];
  const count = orders.length;

  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [orders]);

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between rounded-t-xl border-b-2 p-4',
          styles.headerBg,
          styles.headerBorder
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn('h-3 w-3 rounded-full', styles.dotClass)} />
          <h3 className={cn('text-lg font-semibold', styles.headerText)}>
            {title}
          </h3>
        </div>
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold',
            styles.headerBg,
            styles.headerText
          )}
        >
          {count}
        </span>
      </div>

      {/* Orders */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={onUpdateStatus}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center">
                <span className="text-3xl">📋</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Nenhum pedido {status === 'PENDING' && 'pendente'}
                {status === 'PREPARING' && 'em preparo'}
                {status === 'READY' && 'pronto'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default KanbanColumn;

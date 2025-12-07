import { motion } from 'framer-motion';
import { Clock, CheckCircle2, ChefHat, Package } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  index?: number;
}

const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType; class: string; step: number }> = {
  PENDING: { label: 'Enviado', icon: Clock, class: 'status-pending', step: 1 },
  CONFIRMED: { label: 'Confirmado', icon: CheckCircle2, class: 'status-pending', step: 2 },
  PREPARING: { label: 'Preparando', icon: ChefHat, class: 'status-preparing', step: 3 },
  READY: { label: 'Pronto!', icon: Package, class: 'status-ready', step: 4 },
  DELIVERED: { label: 'Entregue', icon: CheckCircle2, class: 'status-delivered', step: 5 },
  CANCELLED: { label: 'Cancelado', icon: Clock, class: 'status-pending', step: 0 },
  PAID: { label: 'Pago', icon: CheckCircle2, class: 'status-delivered', step: 5 },
};

export function OrderCard({ order, index = 0 }: OrderCardProps) {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `há ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    return `há ${diffHours}h`;
  };

  // Progress bar steps
  const steps = [
    { step: 1, label: 'Enviado' },
    { step: 2, label: 'Preparando' },
    { step: 3, label: 'Pronto' },
  ];

  const currentStep = order.status === 'PENDING' || order.status === 'CONFIRMED' ? 1 
    : order.status === 'PREPARING' ? 2 
    : order.status === 'READY' ? 3
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="bg-card rounded-2xl p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Pedido #{order.id.slice(-4).toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">
              • {formatTime(order.createdAt)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{getTimeAgo(order.createdAt)}</span>
        </div>
        
        <div className={cn("status-badge", status.class)}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>{status.label}</span>
        </div>
      </div>

      {/* Progress bar */}
      {order.status !== 'DELIVERED' && order.status !== 'PAID' && order.status !== 'CANCELLED' && (
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.step} className="flex-1 flex items-center">
              <div
                className={cn(
                  "h-1.5 w-full rounded-full transition-all duration-500",
                  currentStep >= s.step 
                    ? order.status === 'READY' 
                      ? "bg-[hsl(var(--status-ready))]" 
                      : "bg-[hsl(var(--status-preparing))]"
                    : "bg-muted"
                )}
              />
              {i < steps.length - 1 && <div className="w-2" />}
            </div>
          ))}
        </div>
      )}

      {/* Items */}
      <div className="space-y-2">
        {(order.orderItems || []).map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center text-xs font-medium">
                {item.quantity}x
              </span>
              <span className="text-foreground">{item.product?.name || 'Produto'}</span>
            </div>
            <span className="text-muted-foreground">{formatPrice(Number(item.totalPrice))}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total do pedido</span>
        <span className="text-lg font-bold text-primary">{formatPrice(Number(order.totalAmount))}</span>
      </div>
    </motion.div>
  );
}

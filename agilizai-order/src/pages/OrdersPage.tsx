import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, RefreshCw } from 'lucide-react';
import { OrderCard } from '@/components/mobile/OrderCard';
import { OrderCardSkeleton } from '@/components/mobile/Skeleton';
import { useSession } from '@/contexts/SessionContext';
import { useOrders } from '@/hooks/useOrders';
import type { Order } from '@/types';

export default function OrdersPage() {
  const { session } = useSession();
  const { data: orders = [], isLoading, isFetching, refetch } = useOrders(session?.id || null);

  const handleRefresh = () => {
    refetch();
  };

  const isRefreshing = isFetching && !isLoading;

  // Group orders by status
  const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'PAID');
  const completedOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'PAID');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-4"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Meus Pedidos</h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center touch-feedback"
        >
          <RefreshCw className={`w-5 h-5 text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="px-4 space-y-4 mt-4">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ) : orders.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-4"
        >
          <div className="w-24 h-24 mb-6 rounded-full bg-secondary flex items-center justify-center">
            <ClipboardList className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Nenhum pedido ainda
          </h3>
          <p className="text-muted-foreground text-center">
            Seus pedidos aparecerão aqui assim que você fizer o primeiro
          </p>
        </motion.div>
      ) : (
        <div className="px-4 space-y-6 mt-4">
          {/* Active orders */}
          {activeOrders.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Em andamento ({activeOrders.length})
              </h2>
              <AnimatePresence mode="popLayout">
                <div className="space-y-4">
                  {activeOrders.map((order, index) => (
                    <OrderCard key={order.id} order={order} index={index} />
                  ))}
                </div>
              </AnimatePresence>
            </section>
          )}

          {/* Completed orders */}
          {completedOrders.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Concluídos
              </h2>
              <div className="space-y-4">
                {completedOrders.map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </motion.div>
  );
}

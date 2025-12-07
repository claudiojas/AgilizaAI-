import { motion } from 'framer-motion';
import { Receipt, CreditCard, QrCode, Clock, Users, HandCoins } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import { useOrders } from '@/hooks/useOrders';

export default function BillPage() {
  const { session, tableId } = useSession();
  const { data: orders = [] } = useOrders(session?.id || null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // Calculate total from all orders
  const subtotal = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  const serviceTax = subtotal * 0.1; // 10% service
  const total = subtotal + serviceTax;

  const formatSessionTime = () => {
    if (!session) return '00:00';
    const start = new Date(session.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-8"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Minha Conta</h1>
        <p className="text-muted-foreground mt-1">Mesa {tableId}</p>
      </div>

      {/* Session info cards */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Tempo na mesa</span>
          </div>
          <span className="text-2xl font-bold text-foreground">{formatSessionTime()}</span>
        </div>
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Receipt className="w-4 h-4" />
            <span className="text-xs">Total de pedidos</span>
          </div>
          <span className="text-2xl font-bold text-foreground">{orders.length}</span>
        </div>
      </div>

      {/* Bill summary */}
      <div className="px-4 mb-6">
        <div className="bg-card rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Resumo da conta
          </h2>

          {/* Items list */}
          <div className="space-y-3 py-3 border-y border-border">
            {orders.flatMap(order => 
              (order.orderItems || []).map((item, idx) => (
                <div key={`${order.id}-${item.id || idx}`} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.quantity}x {item.product?.name || 'Produto'}
                  </span>
                  <span className="text-foreground">{formatPrice(Number(item.totalPrice))}</span>
                </div>
              ))
            )}
          </div>

          {/* Subtotals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de serviço (10%)</span>
              <span className="text-foreground">{formatPrice(serviceTax)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-border flex justify-between items-center">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Payment options */}
      <div className="px-4 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Opções de pagamento
        </h2>

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-4 bg-primary text-primary-foreground rounded-2xl p-4 shadow-[var(--shadow-soft)]"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-semibold block">Pagar com Pix</span>
            <span className="text-sm opacity-80">Pagamento instantâneo</span>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-4 bg-secondary text-secondary-foreground rounded-2xl p-4"
        >
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-semibold block">Cartão de Crédito/Débito</span>
            <span className="text-sm text-muted-foreground">Visa, Mastercard, Elo</span>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-4 bg-secondary text-secondary-foreground rounded-2xl p-4"
        >
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-semibold block">Dividir conta</span>
            <span className="text-sm text-muted-foreground">Entre os participantes</span>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-4 bg-secondary text-secondary-foreground rounded-2xl p-4"
        >
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <HandCoins className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-semibold block">Pagar no caixa</span>
            <span className="text-sm text-muted-foreground">Dinheiro ou outros</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}

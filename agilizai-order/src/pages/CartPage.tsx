import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, Trash2, Send, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useSession } from '@/contexts/SessionContext';
import { ordersService } from '@/services/orders';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();
  const { session } = useSession();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleSubmitOrder = async () => {
    if (!session) {
      toast.error('Sessão não encontrada. Recarregue a página.');
      return;
    }

    if (items.length === 0) {
      toast.error('Adicione itens ao carrinho antes de enviar o pedido.');
      return;
    }

    toast.loading('Enviando pedido...', { id: 'order' });
    
    try {
      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      await ordersService.create(session.id, orderItems);
      
      toast.success('Pedido enviado com sucesso!', { 
        id: 'order',
        description: 'Acompanhe o status na aba "Pedidos"'
      });
      
      clearCart();
      navigate('/orders');
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error('Erro ao enviar pedido. Tente novamente.', { 
        id: 'order',
        description: error.response?.data?.error || 'Erro desconhecido'
      });
    }
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col"
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center touch-feedback"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Carrinho</h1>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-24 h-24 mb-6 rounded-full bg-secondary flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Carrinho vazio
          </h3>
          <p className="text-muted-foreground text-center mb-6">
            Adicione itens do cardápio para fazer seu pedido
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Ver cardápio
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col pb-48"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center touch-feedback"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Carrinho ({itemCount})</h1>
      </div>

      {/* Cart items */}
      <div className="flex-1 px-4 py-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
              className="bg-card rounded-2xl p-4 flex gap-4"
            >
              {/* Product image placeholder */}
              <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🍽️</span>
              </div>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {item.product.name}
                </h3>
                {item.notes && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    Obs: {item.notes}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-primary font-bold">
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </span>
                  
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center touch-feedback"
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="w-4 h-4 text-destructive" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                    </button>
                    <span className="w-6 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center touch-feedback"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fixed bottom checkout */}
      <div className="fixed bottom-[var(--nav-height)] left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-4 pb-safe-bottom">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmitOrder}
          className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-[var(--shadow-glow)]"
        >
          <Send className="w-5 h-5" />
          <span>Enviar Pedido</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

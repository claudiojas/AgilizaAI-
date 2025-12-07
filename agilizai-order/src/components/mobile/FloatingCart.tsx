import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export function FloatingCart() {
  const { items, itemCount, total } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleClick = () => {
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="floating-cart"
        >
          <button
            onClick={handleClick}
            className="w-full flex items-center justify-between gap-4 bg-primary text-primary-foreground rounded-2xl px-5 py-4 shadow-[var(--shadow-glow)] active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-background text-primary text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium opacity-90">
                  {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                </p>
                <p className="text-lg font-bold">{formatPrice(total)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span>Ver carrinho</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Clock, MessageSquare } from 'lucide-react';
import { Drawer, DrawerContent, DrawerOverlay, DrawerPortal } from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductDrawerProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDrawer({ product, open, onOpenChange }: ProductDrawerProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const { addItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation
    setTimeout(() => {
      setQuantity(1);
      setNotes('');
      setShowNotes(false);
    }, 300);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, notes || undefined);
      handleClose();
    }
  };

  const totalPrice = product ? Number(product.price) * quantity : 0;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <DrawerContent className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl max-h-[90vh] overflow-hidden">
          <AnimatePresence>
            {product && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col"
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 rounded-full bg-muted" />
                </div>

                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-secondary flex items-center justify-center z-10"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Product image placeholder */}
                <div className="relative h-56 overflow-hidden bg-secondary flex items-center justify-center">
                  <span className="text-8xl">🍽️</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="px-5 pb-safe-bottom space-y-4">
                  {/* Title and price */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
                    {product.description && (
                      <p className="text-muted-foreground mt-2">{product.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(Number(product.price))}
                      </span>
                      {product.stock > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <span className="text-sm">Estoque: {product.stock}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes toggle */}
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">
                      {showNotes ? 'Ocultar observações' : 'Adicionar observações'}
                    </span>
                  </button>

                  {/* Notes input */}
                  <AnimatePresence>
                    {showNotes && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Textarea
                          placeholder="Ex: Sem cebola, ponto da carne bem passado..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="bg-secondary border-none resize-none"
                          rows={3}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quantity selector and Add button */}
                  <div className="flex items-center gap-4 pt-2 pb-4">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 bg-secondary rounded-2xl p-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl bg-background flex items-center justify-center touch-feedback"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-8 text-center text-lg font-bold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-xl bg-background flex items-center justify-center touch-feedback"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Add to cart button */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-[var(--shadow-soft)]"
                    >
                      <span>Adicionar</span>
                      <span className="font-bold">{formatPrice(totalPrice)}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}

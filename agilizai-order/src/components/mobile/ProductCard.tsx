import { motion } from 'framer-motion';
import { Plus, Clock } from 'lucide-react';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index?: number;
}

export function ProductCard({ product, onSelect, index = 0 }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        "card-product group",
        (!product.isActive || product.isSoldOut) && "opacity-60"
      )}
      onClick={() => product.isActive && !product.isSoldOut && onSelect(product)}
    >
      {/* Product Image Placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary flex items-center justify-center">
        <span className="text-6xl">🍽️</span>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Unavailable badge */}
        {(!product.isActive || product.isSoldOut) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <span className="text-white font-semibold">
              {product.isSoldOut ? 'Esgotado' : 'Indisponível'}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {product.description}
              </p>
            )}
          </div>
          
          {product.isActive && !product.isSoldOut && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(Number(product.price))}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

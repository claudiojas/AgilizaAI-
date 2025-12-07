import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { CartItem, Product } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, quantity = 1, notes?: string) => {
    setItems(current => {
      const existing = current.find(item => item.product.id === product.id);
      
      if (existing) {
        toast.success(`${product.name} atualizado no carrinho`);
        return current.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
      }
      
      toast.success(`${product.name} adicionado`);
      return [...current, { product, quantity, notes }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(current => {
      const item = current.find(i => i.product.id === productId);
      if (item) {
        toast.info(`${item.product.name} removido`);
      }
      return current.filter(item => item.product.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(current =>
      current.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const updateNotes = useCallback((productId: string, notes: string) => {
    setItems(current =>
      current.map(item =>
        item.product.id === productId ? { ...item, notes } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

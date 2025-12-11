import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ClipboardList, Receipt, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

const navItems = [
  { path: '/', label: 'Cardápio', icon: UtensilsCrossed },
  { path: '/orders', label: 'Pedidos', icon: ClipboardList },
  { path: '/cart', label: 'Carrinho', icon: ShoppingBag },
  { path: '/bill', label: 'Conta', icon: Receipt },
];

export function BottomNav() {
  const location = useLocation();
  const { itemCount } = useCart();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around h-nav-height px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center flex-1 h-full touch-feedback"
            >
              <motion.div
                className={cn(
                  "relative flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
                whileTap={{ scale: 0.9 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-x-2 top-1 h-1 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon 
                  className={cn(
                    "w-6 h-6 transition-all",
                    isActive && "drop-shadow-[0_0_8px_hsl(var(--primary))]"
                  )} 
                />
                <span className={cn(
                  "text-xs font-medium transition-all",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {item.label}
                </span>

                {item.path === '/cart' && itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

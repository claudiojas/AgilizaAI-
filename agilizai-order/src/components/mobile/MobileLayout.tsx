import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { FloatingCart } from './FloatingCart';
import { useSession } from '@/contexts/SessionContext';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const { isLoading, error, tableId } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">Carregando...</h2>
            <p className="text-sm text-muted-foreground">Preparando seu cardápio</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
            <span className="text-4xl">😕</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Ops! Algo deu errado</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Tentar novamente
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with table info */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gradient">AgilizAI</span>
          </div>
          <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
            <span className="text-xs text-muted-foreground">Mesa</span>
            <span className="text-sm font-bold text-primary">{tableId}</span>
          </div>
        </div>
      </header>

      {/* Main content with safe area padding */}
      <main className="safe-area-bottom">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

      {/* Floating cart indicator */}
      <FloatingCart />

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from "@/contexts/SessionContext";
import { CartProvider } from "@/contexts/CartContext";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import Index from "./pages/Index";
import OrdersPage from "./pages/OrdersPage";
import BillPage from "./pages/BillPage";
import CartPage from "./pages/CartPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SessionProvider>
        <CartProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: 'hsl(20 14% 10%)',
                border: '1px solid hsl(20 14% 18%)',
                color: 'hsl(40 40% 98%)',
              },
            }}
          />
          <BrowserRouter>
            <MobileLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/bill" element={<BillPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MobileLayout>
          </BrowserRouter>
        </CartProvider>
      </SessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

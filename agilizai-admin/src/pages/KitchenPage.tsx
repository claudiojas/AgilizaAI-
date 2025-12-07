import { useState, useMemo } from 'react';
import { Wifi, WifiOff, RefreshCw, Volume2, VolumeX, Maximize } from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import KanbanColumn from '@/components/kitchen/KanbanColumn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useKitchenOrdersQuery, useUpdateOrderStatusMutation } from '@/hooks/useOrders';
import { useKitchenWebSocket } from '@/hooks/useWebSocket';
import type { OrderStatus } from '@/types';

const KitchenPage = () => {
  const { data: orders = [], isLoading, refetch } = useKitchenOrdersQuery();
  const updateStatusMutation = useUpdateOrderStatusMutation();
  const { isConnected } = useKitchenWebSocket();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Group orders by status
  const ordersByStatus = useMemo(() => {
    return {
      PENDING: orders.filter((o) => o.status === 'PENDING'),
      PREPARING: orders.filter((o) => o.status === 'PREPARING'),
      READY: orders.filter((o) => o.status === 'READY'),
    };
  }, [orders]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await updateStatusMutation.mutateAsync({ id: orderId, status: newStatus });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };


  return (
    <DashboardLayout
      title="Cozinha"
      subtitle="Kanban de pedidos em tempo real"
    >
      {/* Controls Bar */}
      <div className="mb-6 flex items-center justify-between rounded-xl border bg-card p-4 shadow-card">
        <div className="flex items-center gap-6">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="h-5 w-5 text-success" />
                <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                  Conectado
                </Badge>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-destructive" />
                <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                  Desconectado
                </Badge>
              </>
            )}
          </div>

          {/* Order Counts */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              <span className="font-semibold text-warning">{ordersByStatus.PENDING.length}</span> pendentes
            </span>
            <span className="text-muted-foreground">
              <span className="font-semibold text-primary">{ordersByStatus.PREPARING.length}</span> em preparo
            </span>
            <span className="text-muted-foreground">
              <span className="font-semibold text-success">{ordersByStatus.READY.length}</span> prontos
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Sound Toggle */}
          <div className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
            <Label htmlFor="sound" className="text-sm text-muted-foreground">
              Som
            </Label>
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>

          {/* Refresh */}
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Fullscreen */}
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid h-[calc(100vh-280px)] grid-cols-3 gap-4">
        <KanbanColumn
          title="Pendente"
          status="PENDING"
          orders={ordersByStatus.PENDING}
          onUpdateStatus={handleUpdateStatus}
        />
        <KanbanColumn
          title="Em Preparo"
          status="PREPARING"
          orders={ordersByStatus.PREPARING}
          onUpdateStatus={handleUpdateStatus}
        />
        <KanbanColumn
          title="Pronto"
          status="READY"
          orders={ordersByStatus.READY}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </DashboardLayout>
  );
};

export default KitchenPage;

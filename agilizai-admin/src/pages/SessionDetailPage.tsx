import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout';
import { useSessionQuery } from '@/hooks/useSessions';
import { useOrdersBySessionQuery, useCreateOrderMutation } from '@/hooks/useOrders';
import { useSessionWebSocket } from '@/hooks/useWebSocket';
import { useCloseBillMutation } from '@/hooks/usePayments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NewOrderForm } from '@/components/forms/NewOrderForm';
import { Plus, Clock, DollarSign, Utensils, Loader2, Wifi, WifiOff, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ICreateOrder } from '@/services/orders';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { OrderStatus, PaymentMethod } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pendente', className: 'bg-warning/10 text-warning border-warning/30' },
  PREPARING: { label: 'Em Preparo', className: 'bg-primary/10 text-primary border-primary/30' },
  READY: { label: 'Pronto', className: 'bg-success/10 text-success border-success/30' },
  DELIVERED: { label: 'Entregue', className: 'bg-sky-500/10 text-sky-500 border-sky-500/30' },
  CANCELLED: { label: 'Cancelado', className: 'bg-destructive/10 text-destructive border-destructive/30' },
  CONFIRMED: { label: 'Confirmado', className: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  PAID: { label: 'Pago', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
};

const PaymentDialog = ({ total, onSelectPayment, isLoading }: { total: number, onSelectPayment: (method: PaymentMethod) => void, isLoading: boolean }) => {
  const paymentMethods: { method: PaymentMethod, label: string, icon: React.ElementType }[] = [
    { method: 'DEBIT_CARD', label: 'Débito', icon: CreditCard },
    { method: 'CREDIT_CARD', label: 'Crédito', icon: CreditCard },
    { method: 'CASH', label: 'Dinheiro', icon: Banknote },
    { method: 'PIX', label: 'Pix', icon: Smartphone },
  ];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Finalizar Pagamento</DialogTitle>
        <DialogDescription>
          Selecione a forma de pagamento do cliente.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">Total a Pagar</p>
          <p className="text-4xl font-bold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {paymentMethods.map(({ method, label, icon: Icon }) => (
            <Button
              key={method}
              variant="outline"
              className="h-20 flex flex-col gap-2"
              onClick={() => onSelectPayment(method)}
              disabled={isLoading}
            >
              <Icon className="h-6 w-6" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
        {isLoading && (
          <div className="flex items-center justify-center mt-4">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processando pagamento...
          </div>
        )}
      </div>
    </DialogContent>
  )
}


const SessionDetailPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const { data: session, isLoading: sessionLoading, isError: sessionIsError } = useSessionQuery(sessionId!);
  const { data: orders = [], isLoading: ordersLoading } = useOrdersBySessionQuery(sessionId!);
  const createOrderMutation = useCreateOrderMutation();
  const closeBillMutation = useCloseBillMutation();
  const { isConnected } = useSessionWebSocket(sessionId!);

  const handleCreateOrder = (values: Omit<ICreateOrder, 'sessionId'>) => {
    if (!sessionId) return;
    createOrderMutation.mutate({ ...values, sessionId }, {
      onSuccess: () => {
        setIsNewOrderOpen(false);
      }
    });
  };
  
  const handlePayment = (method: PaymentMethod) => {
    if (!sessionId) return;
    closeBillMutation.mutate({ sessionId, paymentMethod: method });
  }

  const totalConsumed = useMemo(() => {
    return orders.reduce((acc, order) => acc + Number(order.totalAmount), 0);
  }, [orders]);

  if (sessionLoading) {
    return (
      <DashboardLayout title="Carregando Sessão...">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (sessionIsError || !session) {
    return (
      <DashboardLayout title="Erro">
        <p className="text-center text-destructive">Não foi possível carregar os dados da sessão.</p>
      </DashboardLayout>
    );
  }
  
  const formattedSubtitle = `Sessão iniciada em ${format(new Date(session.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`;

  return (
    <DashboardLayout
      title={`Mesa ${session.table?.number}`}
      subtitle={formattedSubtitle}
    >
        <div className="absolute top-6 right-6">
            {isConnected ? (
              <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                <Wifi className="mr-2 h-4 w-4" />
                Conectado
              </Badge>
            ) : (
              <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
                <WifiOff className="mr-2 h-4 w-4" />
                Desconectado
              </Badge>
            )}
        </div>

      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consumido</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalConsumed)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Realizados</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status da Sessão</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{session.status}</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pedidos na Sessão</CardTitle>
              <CardDescription>Todos os pedidos feitos para esta mesa.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Pedido
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Novo Pedido para Mesa {session.table?.number}</DialogTitle>
                  </DialogHeader>
                  <NewOrderForm 
                    onSubmit={handleCreateOrder}
                    isLoading={createOrderMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
              <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogTrigger asChild>
                  <Button disabled={totalConsumed === 0}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Receber Pagamento
                  </Button>
                </DialogTrigger>
                <PaymentDialog 
                  total={totalConsumed} 
                  onSelectPayment={handlePayment} 
                  isLoading={closeBillMutation.isPending}
                />
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <p>Carregando pedidos...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum pedido nesta sessão ainda.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Pedido #{order.id.slice(-6)}</span>
                        <Badge variant="outline" className={cn(statusConfig[order.status]?.className)}>
                          {statusConfig[order.status]?.label || order.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{format(new Date(order.createdAt), 'HH:mm')}</span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {order.orderItems?.map(item => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.quantity}x {item.product?.name}</span>
                          <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.totalPrice))}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-end font-bold pt-2 mt-2 border-t">
                      Total do Pedido: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.totalAmount))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SessionDetailPage;
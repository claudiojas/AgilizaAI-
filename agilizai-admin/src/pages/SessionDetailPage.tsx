import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout';
import { useSessionQuery } from '@/hooks/useSessions';
import { useOrdersBySessionQuery, useCreateOrderMutation } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NewOrderForm } from '@/components/forms/NewOrderForm';
import { Plus, Clock, DollarSign, Utensils, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ICreateOrder } from '@/services/orders';

const SessionDetailPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  const { data: session, isLoading: sessionLoading, isError: sessionIsError } = useSessionQuery(sessionId!);
  const { data: orders = [], isLoading: ordersLoading } = useOrdersBySessionQuery(sessionId!);
  const createOrderMutation = useCreateOrderMutation();

  const handleCreateOrder = (values: Omit<ICreateOrder, 'sessionId'>) => {
    if (!sessionId) return;
    createOrderMutation.mutate({ ...values, sessionId }, {
      onSuccess: () => {
        setIsNewOrderOpen(false);
      }
    });
  };
  
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

  return (
    <DashboardLayout
      title={`Mesa ${session.table?.number}`}
      subtitle={`Sessão iniciada em ${format(new Date(session.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`}
    >
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
            <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
              <DialogTrigger asChild>
                <Button>
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
                      <span className="font-semibold">Pedido #{order.id.slice(-6)}</span>
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
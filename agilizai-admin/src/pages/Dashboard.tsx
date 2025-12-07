import { DashboardLayout } from '@/components/layout';
import {
  LayoutGrid,
  ChefHat,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  useDashboardSummaryQuery,
  useSalesOverTimeQuery,
  useProductPerformanceQuery,
} from '@/hooks/useReports';

const Dashboard = () => {
  const { data: summary, isLoading: loadingSummary } = useDashboardSummaryQuery();
  const { data: salesOverTime, isLoading: loadingSales } = useSalesOverTimeQuery('week');
  const { data: topProducts, isLoading: loadingProducts } = useProductPerformanceQuery('week');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Visão geral do restaurante em tempo real"
    >
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            {loadingSummary ? <p>Carregando...</p> : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Faturamento Hoje</p>
                  <p className="mt-1 text-3xl font-bold">{formatCurrency(summary?.totalRevenue || 0)}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success/10">
                  <DollarSign className="h-7 w-7 text-success" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            {loadingSummary ? <p>Carregando...</p> : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pedidos Hoje</p>
                  <p className="mt-1 text-3xl font-bold">{summary?.totalOrders || 0}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <ChefHat className="h-7 w-7 text-primary" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            {loadingSummary ? <p>Carregando...</p> : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                  <p className="mt-1 text-3xl font-bold">{formatCurrency(summary?.averageTicket || 0)}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                  <TrendingUp className="h-7 w-7 text-accent" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            {loadingSummary ? <p>Carregando...</p> : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mesas Ocupadas</p>
                  <p className="mt-1 text-3xl font-bold">{`${summary?.activeSessions || 0}/${summary?.totalTables || 0}`}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-warning/10">
                  <LayoutGrid className="h-7 w-7 text-warning" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2 shadow-card">
          <CardHeader><CardTitle className="text-lg">Faturamento da Semana</CardTitle></CardHeader>
          <CardContent>
            <div className="h-80">
              {loadingSales ? <p>Carregando...</p> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesOverTime}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `R$${value}`} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} formatter={(value: number) => [formatCurrency(value), 'Faturamento']} />
                    <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-lg">Produtos Mais Vendidos (Semana)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-80">
              {loadingProducts ? <p>Carregando...</p> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts?.slice(0, 5)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="productName" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} formatter={(value: number) => [value, 'Vendas']} />
                    <Bar dataKey="quantitySold" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

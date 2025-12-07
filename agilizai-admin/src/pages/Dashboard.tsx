import { DashboardLayout } from '@/components/layout';
import {
  LayoutGrid,
  ChefHat,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
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

// Mock data
const revenueData = [
  { time: '10h', value: 450 },
  { time: '11h', value: 780 },
  { time: '12h', value: 1520 },
  { time: '13h', value: 1890 },
  { time: '14h', value: 1240 },
  { time: '15h', value: 680 },
  { time: '16h', value: 420 },
  { time: '17h', value: 580 },
  { time: '18h', value: 920 },
  { time: '19h', value: 1680 },
  { time: '20h', value: 2150 },
  { time: '21h', value: 1890 },
];

const topProducts = [
  { name: 'Picanha Grelhada', sales: 45 },
  { name: 'Filé Mignon', sales: 38 },
  { name: 'Costela BBQ', sales: 32 },
  { name: 'Fraldinha', sales: 28 },
  { name: 'Caipirinha', sales: 65 },
];

const Dashboard = () => {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Visão geral do restaurante"
    >
      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Faturamento Hoje
                </p>
                <p className="mt-1 text-3xl font-bold">R$ 8.450</p>
                <div className="mt-2 flex items-center gap-1 text-sm text-success">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+12.5% vs ontem</span>
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success/10">
                <DollarSign className="h-7 w-7 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pedidos Hoje
                </p>
                <p className="mt-1 text-3xl font-bold">127</p>
                <div className="mt-2 flex items-center gap-1 text-sm text-success">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+8.2% vs ontem</span>
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <ChefHat className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ticket Médio
                </p>
                <p className="mt-1 text-3xl font-bold">R$ 66,54</p>
                <div className="mt-2 flex items-center gap-1 text-sm text-destructive">
                  <ArrowDownRight className="h-4 w-4" />
                  <span>-3.1% vs ontem</span>
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                <TrendingUp className="h-7 w-7 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Mesas Ocupadas
                </p>
                <p className="mt-1 text-3xl font-bold">8/12</p>
                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Média: 1h 23min</span>
                </div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-warning/10">
                <LayoutGrid className="h-7 w-7 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Faturamento por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Faturamento']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    width={100}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [value, 'Vendas']}
                  />
                  <Bar
                    dataKey="sales"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

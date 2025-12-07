import { DashboardLayout } from '@/components/layout';
import { useState } from 'react';
import {
  useSalesOverTimeQuery,
  useProductPerformanceQuery,
  useSalesByPaymentMethodQuery,
  useSalesByTableQuery,
} from '@/hooks/useReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ReportsPage = () => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const { data: salesOverTime, isLoading: loadingSales } = useSalesOverTimeQuery(period);
  const { data: productPerformance, isLoading: loadingProducts } = useProductPerformanceQuery(period);
  const { data: salesByMethod, isLoading: loadingMethod } = useSalesByPaymentMethodQuery(period);
  const { data: salesByTable, isLoading: loadingTable } = useSalesByTableQuery(period);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <DashboardLayout
      title="Relatórios"
      subtitle="Analise o desempenho do seu negócio"
    >
      <div className="mb-6">
        <Select value={period} onValueChange={(value: 'week' | 'month') => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Últimos 7 dias</SelectItem>
            <SelectItem value="month">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Faturamento ao Longo do Tempo</CardTitle></CardHeader>
          <CardContent className="h-80">
            {loadingSales ? <p>Carregando...</p> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Vendas por Método de Pagamento</CardTitle></CardHeader>
            <CardContent className="h-80">
              {loadingMethod ? <p>Carregando...</p> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={salesByMethod} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                      {salesByMethod.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Faturamento por Mesa</CardTitle></CardHeader>
            <CardContent className="h-80">
              {loadingTable ? <p>Carregando...</p> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByTable}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tableNumber" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Desempenho dos Produtos</CardTitle></CardHeader>
          <CardContent>
            {loadingProducts ? <p>Carregando...</p> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Quantidade Vendida</TableHead>
                    <TableHead className="text-right">Receita Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformance.map((product: any) => (
                    <TableRow key={product.productName}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell className="text-right">{product.quantitySold}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.totalRevenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
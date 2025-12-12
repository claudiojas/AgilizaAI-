import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCashRegisterHistoryQuery } from '@/hooks/useCashRegister';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CashRegisterSummaryDialog } from '@/components/layout/CashRegisterSummaryDialog';
import { IActiveCashRegisterDetails } from '@/types';

const CashRegistersPage = () => {
  const [dateRange, setDateRange] = useState<{ from?: Date, to?: Date }>({});
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<IActiveCashRegisterDetails | null>(null);

  const filters = useMemo(() => {
    return {
      startDate: dateRange.from?.toISOString(),
      endDate: dateRange.to?.toISOString(),
    };
  }, [dateRange]);

  const { data: history = [], isLoading, isError } = useCashRegisterHistoryQuery(filters);

  const formattedDateRange = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return "Todo o período";
    if (dateRange.from && !dateRange.to) return format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR });
    if (!dateRange.from && dateRange.to) return format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR });
    if (dateRange.from && dateRange.to) {
      const from = format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR });
      const to = format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR });
      return `${from} - ${to}`;
    }
    return "Selecionar Período";
  }, [dateRange]);

  if (isLoading) {
    return (
      <DashboardLayout title="Histórico de Caixas">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout title="Histórico de Caixas">
        <p className="text-center text-destructive">Não foi possível carregar o histórico de caixas.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Histórico de Caixas" subtitle="Visualize os resumos de caixas anteriores">
      <div className="flex justify-end mb-6">
        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formattedDateRange}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.length === 0 ? (
          <p className="text-muted-foreground">Nenhum caixa fechado encontrado para o período selecionado.</p>
        ) : (
          history.map(register => (
            <Card 
              key={register.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedSummary(register)}
            >
              <CardHeader>
                <CardTitle className="text-lg">Caixa #{register.id.slice(-6)}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Aberto em: {format(new Date(register.openedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Fechado em: {register.closedAt ? format(new Date(register.closedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-base font-medium">
                  <span>Valor Inicial:</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(register.initialValue))}</span>
                </div>
                <div className="flex justify-between items-center text-base font-medium">
                  <span>Total Vendas:</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(register.totalPayments))}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t">
                  <span>Valor Final:</span>
                  <span className="text-primary">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(register.finalValue))}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <CashRegisterSummaryDialog summary={selectedSummary} onClose={() => setSelectedSummary(null)} />
    </DashboardLayout>
  );
};

export default CashRegistersPage;

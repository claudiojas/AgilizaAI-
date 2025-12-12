import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IActiveCashRegisterDetails } from '@/types';

interface CashRegisterSummaryDialogProps {
  summary: IActiveCashRegisterDetails | null;
  onClose: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const CashRegisterSummaryDialog = ({ summary, onClose }: CashRegisterSummaryDialogProps) => {
  if (!summary) return null;

  return (
    <Dialog open={!!summary} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fechamento de Caixa</DialogTitle>
          <DialogDescription>
            Resumo do caixa do dia {new Date(summary.openedAt).toLocaleDateString('pt-BR')}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Valor Inicial</span>
            <span className="font-medium">{formatCurrency(summary.initialValue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total de Vendas</span>
            <span className="font-medium">{formatCurrency(summary.totalPayments)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center text-lg">
            <span className="font-semibold">Valor Final em Caixa</span>
            <span className="font-bold text-primary">{formatCurrency(summary.finalValue)}</span>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Vendas por Forma de Pagamento</h4>
            <div className="space-y-2">
              {summary.paymentsBreakdown && summary.paymentsBreakdown.map(item => (
                <div key={item.method} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.method}</span>
                  <span>{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

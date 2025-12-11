import { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { QRCodeCanvas } from 'qrcode.react';
import { Clock, QrCode, DollarSign, Plus, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Table, Session } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { config } from '@/config';

interface TableCardProps {
  table: Table;
  onOpenSession: (tableId: string) => void;
  onCloseSession: (sessionId: string) => void;
  onGenerateQR: (tableId: string) => void;
}

const TableCard = ({
  table,
  onOpenSession,
  onCloseSession,
  onGenerateQR,
}: TableCardProps) => {
  const [showQRDialog, setShowQRDialog] = useState(false);
  
  const hasActiveSession = 'hasActiveSession' in table && table.hasActiveSession;
  const activeSession = 'activeSession' in table ? table.activeSession as Session : undefined;

  const elapsedTime = useMemo(() => {
    if (!activeSession || !activeSession.createdAt) return null;
    const date = new Date(activeSession.createdAt);
    if (isNaN(date.getTime())) return null;
    return formatDistanceToNow(date, {
      locale: ptBR,
      addSuffix: false,
    });
  }, [activeSession]);

  const totalAmount = useMemo(() => {
    if (!activeSession?.orders) return 0;
    return activeSession.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
  }, [activeSession]);

  const statusConfig = hasActiveSession
    ? {
        label: 'Ocupada',
        bgClass: 'bg-destructive/10',
        borderClass: 'border-destructive/30 hover:border-destructive/50',
        dotClass: 'bg-destructive animate-pulse',
      }
    : table.isActive
    ? {
        label: 'Disponível',
        bgClass: 'bg-success/10',
        borderClass: 'border-success/30 hover:border-success/50',
        dotClass: 'bg-success',
      }
    : {
        label: 'Arquivada',
        bgClass: 'bg-muted/10',
        borderClass: 'border-muted/30 hover:border-muted/50',
        dotClass: 'bg-muted',
      };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <>
      <Card
        className={cn(
          'group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-elevated',
          statusConfig.borderClass
        )}
      >
        {/* Status indicator bar */}
        <div className={cn('absolute left-0 top-0 h-1 w-full', statusConfig.bgClass)} />

        <CardContent className="p-4">
          {/* Header */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'h-3 w-3 rounded-full shadow-sm',
                  statusConfig.dotClass
                )}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {statusConfig.label}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowQRDialog(true)}>
                  <QrCode className="mr-2 h-4 w-4" />
                  Ver QR Code
                </DropdownMenuItem>
                {hasActiveSession && activeSession && (
                  <DropdownMenuItem
                    onClick={() => onCloseSession(activeSession.id)}
                    className="text-destructive"
                  >
                    Fechar conta
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table Number */}
          <div className="mb-4 text-center">
            <span className="text-4xl font-bold text-foreground">
              {String(table.number).padStart(2, '0')}
            </span>
            <p className="mt-1 text-sm text-muted-foreground">Mesa</p>
          </div>

          {/* Info */}
          {hasActiveSession && elapsedTime && (
            <div className="mb-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{elapsedTime}</span>
              </div>
            </div>
          )}

          {/* Total or Action */}
          {hasActiveSession && activeSession ? (
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>Total</span>
              </div>
              <p className="mt-1 text-xl font-bold text-foreground">
                {formatCurrency(totalAmount)}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => onCloseSession(activeSession.id)}
              >
                Fechar Conta
              </Button>
            </div>
          ) : table.isActive ? (
            <Button
              className="w-full gap-2 gradient-success text-success-foreground shadow-md transition-all hover:shadow-lg"
              onClick={() => onOpenSession(table.id)}
            >
              <Plus className="h-4 w-4" />
              Abrir Sessão
            </Button>
          ) : (
            <Button variant="outline" className="w-full" disabled>
              Arquivada
            </Button>
          )}
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code - Mesa {table.number}</DialogTitle>
            <DialogDescription>
              Escaneie para acessar o cardápio digital
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6">
            {/* Placeholder for QR Code */}
            <QRCodeCanvas
              value={`${config.appUrl}/?table=${table.number}`}
              size={192}
              bgColor="#ffffff"
              fgColor="#000000"
              level="Q"
              className="rounded-lg"
            />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              agilizai.app/?table={table.number}
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => setShowQRDialog(false)}>
              Fechar
            </Button>
            <Button onClick={() => onGenerateQR(table.id)}>
              Baixar QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableCard;

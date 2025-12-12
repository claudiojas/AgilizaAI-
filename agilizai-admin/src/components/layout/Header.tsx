import { useState } from 'react';
import { Bell, Search, User, Moon, Sun, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useActiveCashRegister, useOpenCashRegisterMutation, useCloseCashRegisterMutation } from '@/hooks/useCashRegister';
import { CashRegisterSummaryDialog } from './CashRegisterSummaryDialog';
import { IActiveCashRegisterDetails } from '@/types';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const CashRegisterStatus = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialValue, setInitialValue] = useState('');
  const [closingSummary, setClosingSummary] = useState<IActiveCashRegisterDetails | null>(null);

  const { data: activeCashRegister, isLoading } = useActiveCashRegister();
  const openMutation = useOpenCashRegisterMutation();
  const closeMutation = useCloseCashRegisterMutation({
    onSuccess: (data) => {
      setClosingSummary(data);
    }
  });

  const handleOpenRegister = () => {
    const value = parseFloat(initialValue);
    if (!isNaN(value)) {
      openMutation.mutate(value, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setInitialValue('');
        },
      });
    }
  };

  if (isLoading) {
    return <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />;
  }

  return (
    <>
      <AlertDialog>
        {activeCashRegister ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <DollarSign className="h-4 w-4 text-success" />
                <span className="text-success font-semibold">Caixa Aberto</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Caixa Aberto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-sm">
                <p>Aberto em: {new Date(activeCashRegister.openedAt).toLocaleString('pt-BR')}</p>
                <p>Valor Inicial: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(activeCashRegister.initialValue)}</p>
              </div>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  disabled={closeMutation.isPending} 
                  className="text-destructive"
                >
                  {closeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Fechar Caixa
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <DollarSign className="h-4 w-4 text-destructive" />
                <span className="text-destructive font-semibold">Caixa Fechado</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Abrir Caixa</DialogTitle>
                <DialogDescription>
                  Insira o valor inicial para abrir o caixa para o dia.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="initial-value">Valor Inicial (R$)</Label>
                <Input
                  id="initial-value"
                  type="number"
                  placeholder="100.00"
                  value={initialValue}
                  onChange={(e) => setInitialValue(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleOpenRegister} disabled={openMutation.isPending}>
                  {openMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Abrir Caixa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação fechará o caixa atual. Você não poderá registrar novas vendas até que um novo caixa seja aberto.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => closeMutation.mutate()} disabled={closeMutation.isPending}>
                Confirmar Fechamento
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
      <CashRegisterSummaryDialog summary={closingSummary} onClose={() => setClosingSummary(null)} />
    </>
  );
};


const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 px-6 backdrop-blur-sm">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-64 pl-9 bg-secondary/50"
          />
        </div>

        {/* Cash Register Status */}
        <CashRegisterStatus />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  GR
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">Gerente</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Moon className="mr-2 h-4 w-4" />
              Tema Escuro
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
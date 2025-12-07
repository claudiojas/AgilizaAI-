import { useState, useMemo } from 'react';
import { Plus, RefreshCw, Filter, LayoutGrid } from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import TableCard from '@/components/tables/TableCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTablesQuery, useCreateTableMutation, useOpenSessionMutation, useCloseSessionMutation } from '@/hooks/useTables';
import { useActiveSessionsQuery } from '@/hooks/useSessions';
import type { Table } from '@/types';

const TablesPage = () => {
  const { data: tables = [], isLoading, refetch } = useTablesQuery();
  const { data: activeSessions = [] } = useActiveSessionsQuery();
  const createTableMutation = useCreateTableMutation();
  const openSessionMutation = useOpenSessionMutation();
  const closeSessionMutation = useCloseSessionMutation();
  
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');

  // Enrich tables with session info
  const enrichedTables = useMemo(() => {
    return tables.map(table => {
      const activeSession = activeSessions.find(s => s.tableId === table.id);
      return {
        ...table,
        hasActiveSession: !!activeSession,
        activeSession: activeSession || undefined,
      };
    });
  }, [tables, activeSessions]);

  const filteredTables = useMemo(() => {
    if (filter === 'all') return enrichedTables;
    if (filter === 'active') return enrichedTables.filter((t) => t.isActive);
    return enrichedTables.filter((t) => !t.isActive);
  }, [enrichedTables, filter]);

  const stats = {
    total: tables.length,
    active: tables.filter((t) => t.isActive).length,
    inactive: tables.filter((t) => !t.isActive).length,
    withSessions: activeSessions.length,
  };

  const handleOpenSession = async (tableId: string) => {
    try {
      await openSessionMutation.mutateAsync(tableId);
    } catch (error) {
      console.error('Error opening session:', error);
    }
  };

  const handleCloseSession = async (sessionId: string) => {
    try {
      await closeSessionMutation.mutateAsync(sessionId);
    } catch (error) {
      console.error('Error closing session:', error);
    }
  };

  const handleGenerateQR = (tableId: string) => {
    // TODO: Implement QR code generation
    console.log('Generate QR for table:', tableId);
  };

  const handleAddTable = async () => {
    if (!newTableNumber) return;
    try {
      await createTableMutation.mutateAsync({
        number: parseInt(newTableNumber),
      });
      setIsAddDialogOpen(false);
      setNewTableNumber('');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  return (
    <DashboardLayout
      title="Mesas"
      subtitle="Gerencie as mesas do restaurante"
    >
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <LayoutGrid className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <div className="h-4 w-4 rounded-full bg-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ativas</p>
              <p className="text-2xl font-bold text-success">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <div className="h-4 w-4 rounded-full bg-destructive animate-pulse" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Com Sessão</p>
              <p className="text-2xl font-bold text-destructive">{stats.withSessions}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/10">
              <div className="h-4 w-4 rounded-full bg-muted" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Arquivadas</p>
              <p className="text-2xl font-bold text-muted-foreground">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-44">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as mesas</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="inactive">Arquivadas</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => { refetch(); }}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
              Nova Mesa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Mesa</DialogTitle>
              <DialogDescription>
                Preencha as informações para criar uma nova mesa.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="number">Número da Mesa</Label>
                <Input
                  id="number"
                  type="number"
                  value={newTableNumber}
                  onChange={(e) => setNewTableNumber(e.target.value)}
                  placeholder="Ex: 13"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddTable} disabled={!newTableNumber}>
                Adicionar Mesa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {filteredTables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onOpenSession={handleOpenSession}
            onCloseSession={handleCloseSession}
            onGenerateQR={handleGenerateQR}
          />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TablesPage;

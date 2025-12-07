import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  ChefHat,
  UtensilsCrossed,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { name: 'Mesas', href: '/tables', icon: LayoutGrid },
  { name: 'Cozinha', href: '/kitchen', icon: ChefHat },
  { name: 'Cardápio', href: '/menu', icon: UtensilsCrossed },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">AgilizAI</h1>
            <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 transition-transform duration-200 group-hover:scale-110',
                    isActive && 'drop-shadow-sm'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-sidebar-border" />

        {/* Bottom Actions */}
        <div className="p-3 space-y-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
            Configurações
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

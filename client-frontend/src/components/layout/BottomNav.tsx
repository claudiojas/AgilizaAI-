// src/components/layout/BottomNav.tsx

export type ViewType = 'menu' | 'orders' | 'bill';

interface BottomNavProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

// Ícones SVG como componentes para reutilização
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);

const ReceiptIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h6" /><path d="M12 18v-2" /></svg>
);

const OrdersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 21h8" /><path d="M6 18h12" /><path d="M17.1 7.9a4 4 0 1 0-8.2 0" /><path d="M6.9 7.9H2" /><path d="M22 7.9h-4.9" /><path d="M10.2 11.9 6 18" /><path d="M13.8 11.9 18 18" /></svg>
);


export function BottomNav({ activeView, setActiveView }: BottomNavProps) {
  const activeLinkClasses = "text-amber-400";
  const inactiveLinkClasses = "text-gray-400 hover:text-white";

  const navItems: { view: ViewType, icon: JSX.Element, label: string }[] = [
    { view: 'menu', icon: <MenuIcon className="w-6 h-6" />, label: 'Cardápio' },
    { view: 'orders', icon: <OrdersIcon className="w-6 h-6" />, label: 'Pedidos' },
    { view: 'bill', icon: <ReceiptIcon className="w-6 h-6" />, label: 'Conta' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-10">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActiveView(item.view)}
            className={`flex flex-col items-center justify-center text-xs transition-colors ${activeView === item.view ? activeLinkClasses : inactiveLinkClasses}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

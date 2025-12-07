// src/components/bill/MyBill.tsx
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface MyBillProps {
    sessionId: string;
}

interface OrderDetails {
    id: string;
    totalAmount: number;
    orderItems: {
        product: {
            name: string;
        };
        quantity: number;
        totalPrice: number;
    }[];
}

async function fetchSessionBill(sessionId: string): Promise<OrderDetails[]> {
    const { data } = await api.get(`/orders/session/${sessionId}`);
    // A API retorna detalhes da sessão, incluindo a lista de pedidos
    return data.orders || [];
}

export function MyBill({ sessionId }: MyBillProps) {
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['sessionBill', sessionId],
        queryFn: () => fetchSessionBill(sessionId),
        refetchInterval: 30000, // Recarrega a cada 30 segundos
    });

    if (isLoading) return <p className="text-center text-gray-400">Carregando sua conta...</p>;
    if (error) return <p className="text-center text-red-400">Não foi possível carregar os detalhes da conta.</p>;

    const totalConsumed = orders?.reduce((acc, order) => acc + Number(order.totalAmount), 0) ?? 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-amber-400">Minha Conta</h2>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="text-center">
                    <p className="text-gray-400 text-lg">Total Consumido</p>
                    <p className="text-4xl font-bold text-white mt-2">
                        {totalConsumed.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Itens Consumidos:</h3>
                {orders && orders.length > 0 ? (
                    <ul className="space-y-3">
                        {orders.flatMap(order => order.orderItems).map((item, index) => (
                            <li key={`${item.product.name}-${index}`} className="flex justify-between items-center bg-gray-800 p-3 rounded-md">
                                <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-gray-400">Qtd: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-300">
                                    {Number(item.totalPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">Nenhum item consumido ainda.</p>
                )}
            </div>
        </div>
    );
}

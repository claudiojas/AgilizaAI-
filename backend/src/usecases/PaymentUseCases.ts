import { prisma } from "../BD/prisma.config";
import { ICloseBill } from "../interfaces/payment.interface";

class PaymentUseCases {
    async closeBill({ sessionId, paymentMethod }: ICloseBill) {
        // 1. Encontrar o caixa aberto
        const openCashRegister = await prisma.cashRegister.findFirst({
            where: { status: 'OPEN' }
        });

        if (!openCashRegister) {
            throw new Error("No cash register is currently open. Cannot process payment.");
        }

        // 2. Encontrar todos os pedidos pendentes para a sessão
        const pendingOrders = await prisma.order.findMany({
            where: {
                sessionId: sessionId,
                status: {
                    notIn: ['PAID', 'CANCELLED']
                }
            }
        });

        if (pendingOrders.length === 0) {
            throw new Error("No pending orders found for this session.");
        }

        // 3. Calcular o valor total devido
        const totalAmount = pendingOrders.reduce((acc, order) => acc + Number(order.totalAmount), 0);

        if (totalAmount <= 0) {
            // Se o total for zero, apenas marque os pedidos como pagos sem criar um pagamento.
            const updatedOrders = await prisma.order.updateMany({
                where: {
                    id: { in: pendingOrders.map(o => o.id) }
                },
                data: {
                    status: 'PAID'
                }
            });
            return { message: "No amount to pay. Orders marked as paid.", updatedOrders: updatedOrders.count };
        }

        // 4. Usar uma transação para garantir a atomicidade
        const transactionResult = await prisma.$transaction(async (tx) => {
            // Criar o registro de pagamento
            const payment = await tx.payment.create({
                data: {
                    amount: totalAmount,
                    method: paymentMethod,
                    status: 'COMPLETED', // Simula pagamento imediato
                    sessionId: sessionId,
                    cashRegisterId: openCashRegister.id,
                }
            });

            // Atualizar todos os pedidos relacionados para 'PAID'
            const orderIds = pendingOrders.map(order => order.id);
            await tx.order.updateMany({
                where: {
                    id: {
                        in: orderIds
                    }
                },
                data: {
                    status: 'PAID'
                }
            });

            // Atualizar o status da sessão para 'CLOSED'
            await tx.session.update({
                where: { id: sessionId },
                data: { status: 'CLOSED' },
            });

            return { payment, updatedOrders: orderIds.length };
        });

        return transactionResult;
    }
}

export default new PaymentUseCases();

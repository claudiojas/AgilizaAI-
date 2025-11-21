import { prisma } from "../BD/prisma.config";

class CashRegisterRepository {
    async findOpenRegister() {
        return await prisma.cashRegister.findFirst({
            where: { status: 'OPEN' }
        });
    }

    async create(initialValue: number) {
        return await prisma.cashRegister.create({
            data: {
                initialValue: initialValue || 0,
                status: 'OPEN'
            }
        });
    }

    async close(id: string) {
        // A lógica de cálculo do valor final será tratada no UseCase
        return await prisma.cashRegister.update({
            where: { id },
            data: {
                closedAt: new Date(),
                status: 'CLOSED',
            }
        });
    }

    async getPaymentsByRegisterId(cashRegisterId: string) {
        return await prisma.payment.findMany({
            where: { cashRegisterId }
        });
    }

    async getOrderItemsByRegisterId(cashRegisterId: string) {
        return await prisma.orderItem.findMany({
            where: {
                order: {
                    cashRegisterId: cashRegisterId,
                    // Apenas itens de pedidos já pagos devem contar
                    status: 'PAID' 
                }
            },
            include: {
                product: true
            }
        });
    }
}

export default new CashRegisterRepository();
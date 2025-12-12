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

    async close(id: string, summary: { totalPayments: number; finalValue: number; paymentsBreakdown: any }) {
        return await prisma.cashRegister.update({
            where: { id },
            data: {
                closedAt: new Date(),
                status: 'CLOSED',
                totalPayments: summary.totalPayments,
                finalValue: summary.finalValue,
                paymentsBreakdown: summary.paymentsBreakdown,
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

    async getHistory(startDate?: Date, endDate?: Date) {
        return await prisma.cashRegister.findMany({
            where: {
                status: 'CLOSED',
                closedAt: {
                    gte: startDate,
                    lte: endDate,
                }
            },
            orderBy: {
                closedAt: 'desc'
            }
        });
    }
}

export default new CashRegisterRepository();
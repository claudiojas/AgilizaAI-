import { prisma } from "../BD/prisma.config";

class OverviewRepository {
    async getSalesOverTime(startDate: Date) {
        // Using raw SQL for date truncation and grouping, which is more flexible.
        const result = await prisma.$queryRaw`
            SELECT
                DATE("createdAt") as date,
                SUM(amount) as total
            FROM
                "payments"
            WHERE
                "createdAt" >= ${startDate}
            GROUP BY
                DATE("createdAt")
            ORDER BY
                date ASC;
        `;
        return result;
    }

    async getProductPerformance(startDate?: Date) {
        const performanceData = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
                totalPrice: true,
            },
            where: {
                order: {
                    createdAt: startDate ? { gte: startDate } : undefined,
                    status: 'PAID',
                }
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                }
            }
        });
        return performanceData;
    }

    async getSalesByPaymentMethod(startDate?: Date) {
        const salesByMethod = await prisma.payment.groupBy({
            by: ['method'],
            _sum: {
                amount: true,
            },
            where: {
                createdAt: startDate ? { gte: startDate } : undefined,
            }
        });

        return salesByMethod;
    }

    async getSalesByTable(startDate?: Date) {
        const salesBySession = await prisma.order.groupBy({
            by: ['sessionId'],
            _sum: {
                totalAmount: true,
            },
            where: {
                status: 'PAID', // Consider only paid orders
                createdAt: startDate ? { gte: startDate } : undefined,
            }
        });

        return salesBySession;
    }

    async getActiveSessionsOverview() {
        const activeSessions = await prisma.session.findMany({
            where: { status: 'ACTIVE' },
            include: {
                table: true, // Inclui os dados da mesa
                orders: { // Inclui os pedidos da sessão
                    include: {
                        orderItems: { // Inclui os itens de cada pedido
                            include: {
                                product: true, // Inclui os dados do produto
                            }
                        }
                    }
                }
            }
        });

        // Mapeia para calcular o total consumido por sessão
        const overview = activeSessions.map(session => {
            const totalConsumed = session.orders.reduce((total, order) => {
                return total + Number(order.totalAmount);
            }, 0);

            return {
                sessionId: session.id,
                tableNumber: session.table.number,
                tableId: session.table.id,
                totalConsumed: totalConsumed,
                activeOrders: session.orders, // Retorna os pedidos para detalhamento no frontend
            };
        });

        return overview;
    }
}

export default new OverviewRepository();

import OverviewRepository from "../repositories/OverviewRepository";
import { prisma } from "../BD/prisma.config";

class OverviewUseCases {
    async getDashboardSummary() {
        const [sales, orders, activeSessions, totalTables] = await OverviewRepository.getTodaySummary();

        const totalRevenue = sales._sum.amount?.toNumber() || 0;
        const totalOrders = orders || 0;
        const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
            totalRevenue,
            totalOrders,
            averageTicket,
            activeSessions,
            totalTables,
        };
    }

    async getSalesOverTime(period: 'week' | 'month') {
        const now = new Date();
        let startDate = new Date();

        if (period === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (period === 'month') {
            startDate.setMonth(now.getMonth() - 1);
        }

        const result: any[] = await OverviewRepository.getSalesOverTime(startDate);

        // Process raw query result
        const formattedResult = result.map(item => ({
            date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            total: Number(item.total),
        }));

        return formattedResult;
    }

    async getProductPerformance(period?: 'week' | 'month') {
        let startDate: Date | undefined;
        if (period) {
            startDate = new Date();
            if (period === 'week') {
                startDate.setDate(startDate.getDate() - 7);
            } else if (period === 'month') {
                startDate.setMonth(startDate.getMonth() - 1);
            }
        }

        const performanceData = await OverviewRepository.getProductPerformance(startDate);

        if (!performanceData || performanceData.length === 0) {
            return [];
        }

        // Get product details to map names
        const productIds = performanceData.map(p => p.productId);
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds }
            },
            select: {
                id: true,
                name: true,
            }
        });

        const productMap = new Map(products.map(p => [p.id, p.name]));

        // Combine data
        const productPerformance = performanceData.map(item => ({
            productName: productMap.get(item.productId) || 'Unknown Product',
            quantitySold: item._sum.quantity || 0,
            totalRevenue: item._sum.totalPrice || 0,
        }));

        return productPerformance;
    }

    async getSalesByPaymentMethod(period?: 'week' | 'month') {
        let startDate: Date | undefined;
        if (period) {
            startDate = new Date();
            if (period === 'week') {
                startDate.setDate(startDate.getDate() - 7);
            } else if (period === 'month') {
                startDate.setMonth(startDate.getMonth() - 1);
            }
        }

        const salesByMethod = await OverviewRepository.getSalesByPaymentMethod(startDate);

        // Format data for easier consumption by charts
        const formattedSales = salesByMethod.map(item => ({
            name: item.method,
            total: item._sum.amount || 0,
        }));

        return formattedSales;
    }

    async getSalesByTable(period?: 'week' | 'month') {
        let startDate: Date | undefined;
        if (period) {
            startDate = new Date();
            if (period === 'week') {
                startDate.setDate(startDate.getDate() - 7);
            } else if (period === 'month') {
                startDate.setMonth(startDate.getMonth() - 1);
            }
        }

        const salesBySession = await OverviewRepository.getSalesByTable(startDate);

        if (!salesBySession || salesBySession.length === 0) {
            return [];
        }

        // Get session details to map table numbers
        const sessions = await prisma.session.findMany({
            where: {
                id: { in: salesBySession.map(s => s.sessionId) }
            },
            include: {
                table: true
            }
        });

        const sessionTableMap = new Map(sessions.map(s => [s.id, s.table.number]));

        // Combine data
        const salesByTable = salesBySession.map(sale => ({
            tableNumber: sessionTableMap.get(sale.sessionId) || 0,
            total: sale._sum.totalAmount || 0,
        }));

        return salesByTable;
    }

    async getActiveSessionsOverview() {
        return OverviewRepository.getActiveSessionsOverview();
    }
}

export default new OverviewUseCases();

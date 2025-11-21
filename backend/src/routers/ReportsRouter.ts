import { FastifyInstance } from "fastify";
import OverviewUseCases from "../usecases/OverviewUseCases";

export async function reportsRoutes(app: FastifyInstance) {
  // Endpoint for sales by table will be added here
  app.get<{ Querystring: { period?: 'week' | 'month' } }>('/reports/sales-over-time', async (request, reply) => {
    try {
      const { period = 'week' } = request.query; // Default to week
      const salesOverTime = await OverviewUseCases.getSalesOverTime(period);
      return reply.status(200).send(salesOverTime);
    } catch (error) {
      console.error("Error fetching sales over time report:", error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  app.get<{ Querystring: { period?: 'week' | 'month' } }>('/reports/product-performance', async (request, reply) => {
    try {
      const { period } = request.query;
      const productPerformance = await OverviewUseCases.getProductPerformance(period);
      return reply.status(200).send(productPerformance);
    } catch (error) {
      console.error("Error fetching product performance report:", error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  app.get<{ Querystring: { period?: 'week' | 'month' } }>('/reports/sales-by-payment-method', async (request, reply) => {
    try {
      const { period } = request.query;
      const salesByMethod = await OverviewUseCases.getSalesByPaymentMethod(period);
      return reply.status(200).send(salesByMethod);
    } catch (error) {
      console.error("Error fetching sales by payment method report:", error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  app.get<{ Querystring: { period?: 'week' | 'month' } }>('/reports/sales-by-table', async (request, reply) => {
    try {
      const { period } = request.query;
      const salesByTable = await OverviewUseCases.getSalesByTable(period);
      return reply.status(200).send(salesByTable);
    } catch (error) {
      console.error("Error fetching sales by table report:", error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}

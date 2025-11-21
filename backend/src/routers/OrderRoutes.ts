import { FastifyInstance } from "fastify";
import { ICreateOrder } from "../interfaces/order.interface";
import OrderUseCases from "../usecases/OrderUseCases";
import { ICreateOrderItem } from "../interfaces/order-item.interface";
import { OrderStatus } from "@prisma/client";

type OrderItemData = Omit<ICreateOrderItem, 'orderId'>;

export async function orderRoutes(app: FastifyInstance) {
    app.post<{ Body: ICreateOrder }>('/orders', async (request, reply) => {
        try {
            const order = await OrderUseCases.createOrder(request.body);
            return reply.status(201).send(order);
        } catch (error: any) {
            if (error.message.includes("No cash register is currently open")) {
                return reply.status(409).send({ error: error.message });
            }
            if (error.message.includes("Not enough stock") || error.message.includes("not found")) {
                return reply.status(400).send({ error: error.message });
            }
            console.error("Error creating order:", error);
            return reply.status(500).send({
                success: false,
                error: "Internal Server Error on order creation."
            });
        }
    });

    app.get<{ Querystring: { status?: string } }>('/orders', async (request, reply) => {
        try {
            const { status } = request.query;
            const orders = await OrderUseCases.getAllOrders(status as OrderStatus);
            return reply.status(200).send(orders);
        } catch (error) {
            console.error("Error fetching all orders:", error);
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    });

    app.get<{ Params: { sessionId: string } }>('/orders/session/:sessionId', async (request, reply) => {
        const { sessionId } = request.params;
        try {
            const orders = await OrderUseCases.findOrdersBySessionId(sessionId);
            return reply.status(200).send(orders);
        } catch (error: any) {
            if (error.message.includes("No session found")) {
                return reply.status(404).send({
                    success: false,
                    error: error.message
                });
            }
            console.error(`Error fetching orders for session ${sessionId}:`, error);
            return reply.status(500).send({
                success: false,
                error: "Unable to search for orders."
            });
        }
    });

    app.post<{ Params: { orderId: string }, Body: OrderItemData }>('/orders/:orderId/items', async (request, reply) => {
        const { orderId } = request.params;
        const itemData = request.body;
        try {
            const orderItem = await OrderUseCases.addOrderItem(orderId, itemData);
            return reply.status(201).send(orderItem);
        } catch (error) {
            console.error(`Error adding item to order ${orderId}:`, error);
            return reply.status(400).send({
                success: false,
                error: "Invalid data for order item."
            });
        }
    });

    app.patch<{ Params: { id: string }, Body: IUpdateOrderStatus }>('/orders/:id/status', async (request, reply) => {
        const { id } = request.params;
        try {
            const order = await OrderUseCases.updateOrderStatus(id, request.body);
            return reply.status(200).send(order);
        } catch (error: any) {
            if (error.message.includes("not found")) {
                return reply.status(404).send({ error: error.message });
            }
            console.error(`Error updating status for order ${id}:`, error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    app.delete<{ Params: { orderId: string } }>('/orders/:orderId', async (request, reply) => {
        const { orderId } = request.params;
        try {
            const order = await OrderUseCases.deleteOrder(orderId);
            return reply.status(200).send(order);
        } catch (error: any) {
            if (error.message.includes("not found")) {
                return reply.status(404).send({ error: error.message });
            }
            if (error.message.includes("cannot be deleted")) {
                return reply.status(409).send({ error: error.message });
            }
            console.error(`Error deleting order ${orderId}:`, error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });

    app.delete<{ Params: { id: string } }>('/orders/items/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            await OrderUseCases.deleteOrderItem(id);
            return reply.status(204).send();
        } catch (error: any) {
            if (error.message.includes("not found")) {
                return reply.status(404).send({ error: error.message });
            }
            console.error(`Error deleting order item ${id}:`, error);
            return reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}
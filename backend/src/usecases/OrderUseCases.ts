import { ICreateOrder, IOrder } from "../interfaces/order.interface";
import { z } from "zod";
import OrderRepository from "../repositories/OrderRepository";
import { ICreateOrderItem, IOrderItem } from "../interfaces/order-item.interface";
import { prisma } from "../BD/prisma.config";
import { notificationHub } from "../utils/NotificationHub";
import { OrderStatus } from "@prisma/client";

const orderCreateSchema = z.object({
    sessionId: z.string().min(1, "Session ID is required"),
    items: z.array(z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z.number().int().positive("Quantity must be a positive integer"),
    })).min(1, "Order must have at least one item"),
});

const orderItemDataSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    unitPrice: z.number().positive("Unit price must be a positive number"),
    totalPrice: z.number().positive("Total price must be a positive number"),
});

const sessionIdSchema = z.string().min(1, "Session ID is required");
const orderIdSchema = z.string().min(1, "Order ID is required");

type OrderItemData = Omit<ICreateOrderItem, 'orderId'>;

const orderStatusUpdateSchema = z.object({
    status: z.nativeEnum(OrderStatus),
});

class OrderUseCases {
    async createOrder(data: ICreateOrder): Promise<IOrder> {
        const validatedData = orderCreateSchema.parse(data);

        const { order, sessionId } = await OrderRepository.createOrder(validatedData);

        // Notificar via WebSocket
        const message = {
            type: 'NEW_ORDER', 
            payload: order 
        };
        notificationHub.broadcastToKitchen(message);
        notificationHub.broadcastToSession(sessionId, message);

        return order;
    }

    async findOrdersBySessionId(sessionId: string): Promise<any | null> {
        const validatedSessionId = sessionIdSchema.parse(sessionId);
        const sessionDetails = await OrderRepository.findOrdersBySessionId(validatedSessionId);
        if (!sessionDetails) {
            throw new Error("No session found.");
        }
        return sessionDetails;
    }

    async addOrderItem(orderId: string, itemData: OrderItemData): Promise<IOrderItem> {
        const validatedOrderId = orderIdSchema.parse(orderId);
        const validatedItemData = orderItemDataSchema.parse(itemData);

        // Transação para garantir atomicidade
        const newOrderItem = await prisma.$transaction(async (tx) => {
            // 1. Buscar o produto e verificar o estoque
            const product = await tx.product.findUnique({ where: { id: validatedItemData.productId } });

            if (!product) {
                throw new Error(`Product with id ${validatedItemData.productId} not found.`);
            }
            if (product.stock < validatedItemData.quantity) {
                throw new Error(`Not enough stock for product: ${product.name}. Available: ${product.stock}, Requested: ${validatedItemData.quantity}`);
            }

            // 2. Criar o OrderItem
            const createdItem = await tx.orderItem.create({
                data: {
                    orderId: validatedOrderId,
                    productId: validatedItemData.productId,
                    quantity: validatedItemData.quantity,
                    unitPrice: product.price, // Usar o preço do banco de dados como fonte da verdade
                    totalPrice: Number(product.price) * validatedItemData.quantity,
                }
            });

            // 3. Abater o estoque do produto
            await tx.product.update({
                where: { id: validatedItemData.productId },
                data: { stock: { decrement: validatedItemData.quantity } }
            });

            // 4. Atualizar o valor total do pedido principal
            await tx.order.update({
                where: { id: validatedOrderId },
                data: { totalAmount: { increment: createdItem.totalPrice } }
            });

            return createdItem;
        });

        return newOrderItem;
    }

    async updateOrderStatus(orderId: string, data: { status: IOrder['status'] }): Promise<IOrder> {
        const validatedOrderId = orderIdSchema.parse(orderId);
        const { status } = orderStatusUpdateSchema.parse(data);

        const orderExists = await prisma.order.findUnique({ where: { id: validatedOrderId } });
        if (!orderExists) {
            throw new Error("Order not found.");
        }

        if (status === 'CANCELLED' && orderExists.status === 'PREPARING') {
            throw new Error("Cannot cancel an order that is already being prepared.");
        }

        const updatedOrder = await OrderRepository.updateStatus(validatedOrderId, status);

        const message = {
            type: 'ORDER_STATUS_UPDATED',
            payload: updatedOrder,
        };

        notificationHub.broadcastToKitchen(message);
        // CORREÇÃO FINAL: Usando o sessionId do objeto que sabemos que está completo.
        notificationHub.broadcastToSession(orderExists.sessionId, message);

        return updatedOrder;
    }

    async getAllOrders(status?: OrderStatus): Promise<IOrder[]> {
        if (status) {
            return OrderRepository.findOrdersByStatus(status);
        }
        return OrderRepository.findAllOrders();
    }

    async deleteOrder(orderId: string): Promise<IOrder> {
        const validatedOrderId = orderIdSchema.parse(orderId);

        const order = await prisma.order.findUnique({
            where: { id: validatedOrderId },
        });

        if (!order) {
            throw new Error("Order not found.");
        }

        if (order.status === 'PAID') {
            throw new Error(`Order cannot be deleted because its status is PAID.`);
        }

        return OrderRepository.deleteOrder(validatedOrderId);
    }

    async deleteOrderItem(itemId: string): Promise<void> {
        const validatedItemId = z.string().cuid().parse(itemId);

        await prisma.$transaction(async (tx) => {
            // 1. Encontrar o item a ser deletado para saber o valor e a qual pedido pertence
            const itemToDelete = await tx.orderItem.findUnique({
                where: { id: validatedItemId },
            });

            if (!itemToDelete) {
                throw new Error("Order item not found.");
            }

            // 2. Deletar o item
            await tx.orderItem.delete({ where: { id: validatedItemId } });

            // 3. Recalcular o total do pedido pai
            const remainingItems = await tx.orderItem.findMany({
                where: { orderId: itemToDelete.orderId },
            });

            const newTotalAmount = remainingItems.reduce((sum, item) => {
                return sum + Number(item.totalPrice);
            }, 0);

            // 4. Atualizar o pedido pai com o novo total
            await tx.order.update({
                where: { id: itemToDelete.orderId },
                data: { totalAmount: newTotalAmount },
            });
        });
    }
}

export default new OrderUseCases();
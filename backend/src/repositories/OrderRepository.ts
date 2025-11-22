import { prisma } from "../BD/prisma.config";
import { IOrderMethods } from "../interfaces/methods.interface";
import { ICreateOrder, IOrder } from "../interfaces/order.interface";
import { ICreateOrderItem, IOrderItem } from "../interfaces/order-item.interface";
import { OrderStatus } from "@prisma/client";

class OrderRepository implements IOrderMethods {
    async createOrder(data: ICreateOrder): Promise<{order: IOrder, sessionId: string}> {
        const { sessionId, items } = data;

        const order = await prisma.$transaction(async (tx) => {
            // 1. Validar caixa e sessão
            const openCashRegister = await tx.cashRegister.findFirst({ where: { status: 'OPEN' } });
            if (!openCashRegister) {
                throw new Error("Cannot create order: No cash register is currently open.");
            }

            const session = await tx.session.findUnique({ where: { id: sessionId } });
            if (!session || session.status !== 'ACTIVE') {
                throw new Error("Invalid or inactive session.");
            }

            // 2. Buscar todos os produtos e verificar estoque
            const productIds = items.map(item => item.productId);
            const products = await tx.product.findMany({ where: { id: { in: productIds } } });

            if (products.length !== productIds.length) {
                throw new Error("One or more products not found.");
            }

            const productsMap = new Map(products.map(p => [p.id, p]));
            let totalAmount = 0;

            for (const item of items) {
                const product = productsMap.get(item.productId);
                if (!product) {
                    throw new Error(`Product with id ${item.productId} not found.`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Not enough stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
                }
                totalAmount += Number(product.price) * item.quantity;
            }

            // 3. Criar o Pedido (Order)
            const newOrder = await tx.order.create({
                data: {
                    sessionId: sessionId,
                    cashRegisterId: openCashRegister.id,
                    totalAmount: totalAmount,
                }
            });

            // 4. Criar os Itens do Pedido (OrderItems)
            const orderItemsToCreate = items.map(item => {
                const product = productsMap.get(item.productId)!;
                return {
                    orderId: newOrder.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: product.price,
                    totalPrice: Number(product.price) * item.quantity,
                };
            });
            await tx.orderItem.createMany({ data: orderItemsToCreate });

            // 5. Abater o estoque
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }
            
            // Retornar o pedido completo com os itens e produtos (CORRIGIDO)
            const finalOrder = await tx.order.findUnique({ 
                where: { id: newOrder.id },
                include: { 
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            return finalOrder!;
        });

        return { order, sessionId };
    }


    async findOrdersBySessionId(sessionId: string): Promise<any | null> {
        const orders = await prisma.session.findUnique({
            where: {
                id: sessionId,
            },
            include: {
                table: true,
                orders: {
                    where: {
                        status: {
                            not: 'CANCELLED'
                        }
                    },
                    include: {
                        orderItems: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            }
        });
        return orders;
    }

    async findOrdersByStatus(status: OrderStatus): Promise<IOrder[]> {
        const orders = await prisma.order.findMany({
            where: {
                status,
                session: {
                    status: 'ACTIVE'
                }
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                session: true
            },
        });
        return orders;
    }

    async findAllOrders(): Promise<IOrder[]> {
        const orders = await prisma.order.findMany({
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return orders;
    }

    async updateStatus(orderId: string, status: OrderStatus): Promise<IOrder> {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                session: {
                    include: {
                        table: true
                    }
                }
            }
        });
        return updatedOrder;
    }

    async deleteOrder(orderId: string): Promise<IOrder> {
        // A transação garante que ambas as operações sejam bem-sucedidas, ou nenhuma delas.
        // 1. Deleta os itens do pedido primeiro.
        // 2. Deleta o pedido principal.
        const [, deletedOrder] = await prisma.$transaction([
            prisma.orderItem.deleteMany({ where: { orderId: orderId } }),
            prisma.order.delete({ where: { id: orderId } }),
        ]);

        return deletedOrder;
    }
    async hasActiveOrders(sessionId: string): Promise<boolean> {
        const activeOrder = await prisma.order.findFirst({
            where: {
                sessionId: sessionId,
                status: {
                    in: ['PENDING', 'PREPARING', 'READY']
                }
            }
        });
        return !!activeOrder;
    }
};


export default new OrderRepository;
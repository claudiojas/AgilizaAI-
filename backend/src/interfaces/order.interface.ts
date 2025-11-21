import { Decimal } from "@prisma/client/runtime/library";
import { OrderStatus } from "@prisma/client";
import { IOrderItem } from "./order-item.interface";

export interface ICreateOrderItemForOrder {
    productId: string;
    quantity: number;
}

export interface ICreateOrder {
    sessionId: string,
    status?: OrderStatus,
    items: ICreateOrderItemForOrder[];
}

export interface IUpdateOrderStatus {
    status: OrderStatus;
}

export interface IOrder {
    id: string;
    sessionId: string;
    status: OrderStatus;
    totalAmount: Decimal;
    createdAt: Date;
    updatedAt: Date;
    orderItems?: IOrderItem[];
}
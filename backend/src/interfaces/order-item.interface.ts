import { Decimal } from "@prisma/client/runtime/library";

export interface ICreateOrderItem {
    orderId: string,
    productId: string,
    quantity: number,
    unitPrice: number,
    totalPrice: number
}

export interface IOrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: Decimal;
    totalPrice: Decimal;
    createdAt: Date;
}

export interface IOrderItemUseCases {
    deleteOrderItem(id: string): Promise<void>;
}
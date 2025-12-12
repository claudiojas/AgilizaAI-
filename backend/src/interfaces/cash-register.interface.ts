import { Decimal } from "@prisma/client/runtime/library";

export interface IOpenCashRegister {
    initialValue?: number;
}

export interface ISoldProduct {
    productId: string;
    name: string;
    quantity: number;
    totalValue: number;
}

export interface IPaymentBreakdown {
    method: string;
    total: number;
}

export interface IActiveCashRegisterDetails {
    id: string;
    openedAt: Date;
    initialValue: number; // Changed from Decimal | null
    totalPayments: number;
    finalValue: number; // Changed from expectedInCash
    paymentsBreakdown: IPaymentBreakdown[];
    soldProducts: ISoldProduct[];
}

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
    initialValue: Decimal | null;
    totalPayments: number;
    expectedInCash: number;
    paymentsBreakdown: IPaymentBreakdown[];
    soldProducts: ISoldProduct[];
}

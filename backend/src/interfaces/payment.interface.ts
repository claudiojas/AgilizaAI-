import { PaymentMethod } from "@prisma/client";

export interface ICloseBill {
    sessionId: string;
    paymentMethod: PaymentMethod;
}

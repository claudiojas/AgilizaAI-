import CashRegisterRepository from "../repositories/CashRegisterRepositorie";
import { IActiveCashRegisterDetails, IOpenCashRegister, IPaymentBreakdown, ISoldProduct } from "../interfaces/cash-register.interface";
import { CashRegister } from "@prisma/client";

class CashRegisterUseCases {

    private async _calculateRegisterSummary(openRegister: CashRegister): Promise<IActiveCashRegisterDetails> {
        const payments = await CashRegisterRepository.getPaymentsByRegisterId(openRegister.id);
        const orderItems = await CashRegisterRepository.getOrderItemsByRegisterId(openRegister.id);

        const totalPayments = payments.reduce((sum, payment) => sum + payment.amount.toNumber(), 0);

        const paymentsBreakdown = payments.reduce((acc, payment) => {
            const existing = acc.find(p => p.method === payment.method);
            if (existing) {
                existing.total += payment.amount.toNumber();
            } else {
                acc.push({ method: payment.method, total: payment.amount.toNumber() });
            }
            return acc;
        }, [] as IPaymentBreakdown[]);

        const soldProducts = orderItems.reduce((acc, item) => {
            const existing = acc.find(p => p.productId === item.productId);
            if (existing) {
                existing.quantity += item.quantity;
                existing.totalValue += item.totalPrice.toNumber();
            } else {
                acc.push({
                    productId: item.productId,
                    name: item.product.name,
                    quantity: item.quantity,
                    totalValue: item.totalPrice.toNumber()
                });
            }
            return acc;
        }, [] as ISoldProduct[]);
        
        const initialValue = openRegister.initialValue?.toNumber() ?? 0;
        const finalValue = initialValue + totalPayments;

        return {
            id: openRegister.id,
            openedAt: openRegister.openedAt,
            initialValue: initialValue,
            totalPayments,
            finalValue: finalValue,
            paymentsBreakdown,
            soldProducts
        };
    }

    async openCashRegister({ initialValue }: IOpenCashRegister) {
        const openRegister = await CashRegisterRepository.findOpenRegister();

        if (openRegister) {
            throw new Error("A cash register is already open.");
        }

        return await CashRegisterRepository.create(initialValue || 0);
    }

    async closeCashRegister() {
        const openRegister = await CashRegisterRepository.findOpenRegister();

        if (!openRegister) {
            throw new Error("No cash register is currently open.");
        }

        const summary = await this._calculateRegisterSummary(openRegister);

        await CashRegisterRepository.close(openRegister.id, {
            totalPayments: summary.totalPayments,
            finalValue: summary.finalValue,
            paymentsBreakdown: summary.paymentsBreakdown,
        });

        return summary;
    }

    async getActiveCashRegisterDetails(): Promise<IActiveCashRegisterDetails> {
        const openRegister = await CashRegisterRepository.findOpenRegister();

        if (!openRegister) {
            throw new Error("No cash register is currently open.");
        }

        return this._calculateRegisterSummary(openRegister);
    }
}

export default new CashRegisterUseCases();

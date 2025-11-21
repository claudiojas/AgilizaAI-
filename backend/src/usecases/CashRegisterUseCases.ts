import CashRegisterRepository from "../repositories/CashRegisterRepositorie";
import { IActiveCashRegisterDetails, IOpenCashRegister, IPaymentBreakdown, ISoldProduct } from "../interfaces/cash-register.interface";

class CashRegisterUseCases {
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

        // A lógica de cálculo de totais pode ser adicionada aqui antes de fechar.
        return await CashRegisterRepository.close(openRegister.id);
    }

    async getActiveCashRegisterDetails(): Promise<IActiveCashRegisterDetails> {
        const openRegister = await CashRegisterRepository.findOpenRegister();

        if (!openRegister) {
            throw new Error("No cash register is currently open.");
        }

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

        return {
            id: openRegister.id,
            openedAt: openRegister.openedAt,
            initialValue: openRegister.initialValue,
            totalPayments,
            expectedInCash: Number(openRegister.initialValue) + totalPayments,
            paymentsBreakdown,
            soldProducts
        };
    }
}

export default new CashRegisterUseCases();
import api from './api';
import type { PaymentMethod } from '@/types';

export interface ICloseBillPayload {
    sessionId: string;
    paymentMethod: PaymentMethod;
}

export const paymentsService = {
  closeBill: async (payload: ICloseBillPayload): Promise<any> => {
    const { data } = await api.post('/payments/close-bill', payload);
    return data;
  },
};

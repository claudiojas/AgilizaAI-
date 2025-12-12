import api from './api';
import { CashRegister } from '@/types';

export const cashRegisterService = {
  getActive: async (): Promise<CashRegister | null> => {
    try {
      const { data } = await api.get('/cash-register/active-details');
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  open: async (initialValue: number): Promise<CashRegister> => {
    const { data } = await api.post('/cash-register/open', { initialValue });
    return data;
  },

  close: async (): Promise<CashRegister> => {
    const { data } = await api.post('/cash-register/close');
    return data;
  },

  getHistory: async (filters?: { startDate?: string, endDate?: string }): Promise<CashRegister[]> => {
    const { data } = await api.get('/cash-registers/history', { params: filters });
    return data;
  },
};

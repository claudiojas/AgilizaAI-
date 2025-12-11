import api from './api';
import type { Session } from '@/types';

export const sessionsService = {
  getActiveByTable: async (tableNumber: string): Promise<Session | null> => {
    try {
      const { data } = await api.get(`/sessions/table/${tableNumber}/active`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  create: async (tableId: string): Promise<Session> => {
    const { data } = await api.post('/sessions', { tableId });
    return data;
  },

  getById: async (sessionId: string): Promise<Session> => {
    const { data } = await api.get(`/sessions/id/${sessionId}`);
    return data;
  },

  getByCode: async (code: string): Promise<Session> => {
    const { data } = await api.get(`/sessions/code/${code}`);
    return data;
  },

  close: async (sessionId: string): Promise<Session> => {
    const { data } = await api.patch(`/sessions/${sessionId}/close`);
    return data;
  },
};


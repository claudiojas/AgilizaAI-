import api from './api';

export interface Session {
  id: string;
  code: string;
  tableId: string;
  status: 'ACTIVE' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  table?: {
    id: string;
    number: number;
  };
  orders?: Array<{
    id: string;
    totalAmount: number;
  }>;
}

export const sessionsService = {
  getActiveByTable: async (tableId: string): Promise<Session | null> => {
    try {
      const { data } = await api.get(`/sessions/table/${tableId}/active`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  getAllActive: async (): Promise<Session[]> => {
    const { data } = await api.get('/overview/sessions');
    return data;
  },

  close: async (sessionId: string): Promise<Session> => {
    const { data } = await api.patch(`/sessions/${sessionId}/close`);
    return data;
  },
};


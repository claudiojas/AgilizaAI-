import api from './api';
import type { Table, TableSession } from '@/types';

export const tablesService = {
  getAll: async (): Promise<Table[]> => {
    const { data } = await api.get('/tables');
    return data;
  },

  getById: async (id: string): Promise<Table> => {
    const { data } = await api.get(`/tables/${id}`);
    return data;
  },

  create: async (tableData: { number: number }): Promise<Table> => {
    const { data } = await api.post('/tables', tableData);
    return data;
  },

  update: async (id: string, tableData: Partial<Table>): Promise<Table> => {
    const { data } = await api.patch(`/tables/${id}`, tableData);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tables/${id}`);
  },

  openSession: async (tableId: string): Promise<TableSession> => {
    const { data } = await api.post('/sessions', { tableId });
    return data;
  },

  closeSession: async (sessionId: string): Promise<void> => {
    await api.patch(`/sessions/${sessionId}/close`);
  },

  getQRCode: async (tableId: string): Promise<string> => {
    const { data } = await api.get(`/tables/${tableId}/qrcode`);
    return data.qrCodeUrl;
  },
};

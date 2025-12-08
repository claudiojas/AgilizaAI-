import api from './api';

export const authService = {
  login: async (credentials: any): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  logout: async (): Promise<any> => {
    // Para logout, o backend geralmente invalida o token ou o cookie.
    // Como estamos usando cookies HttpOnly, o frontend não pode simplesmente remover o cookie.
    // Uma chamada ao backend é necessária para limpar o cookie de sessão.
    const { data } = await api.post('/auth/logout'); // Precisaremos criar este endpoint no backend
    return data;
  },

  getProfile: async (): Promise<any> => {
    // Retorna o perfil do usuário logado. Precisaremos criar este endpoint no backend.
    const { data } = await api.get('/auth/me');
    return data;
  }
};

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; role: string } | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  
  // Use useQuery to fetch user profile and manage auth state
  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ['userProfile'],
    queryFn: authService.getProfile,
    retry: false, // Don't retry on error, as it means user is not logged in
    staleTime: Infinity, // Profile data is stable until logout
  });

  const isAuthenticated = !!user && !isError;

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      refetch(); // Refetch user profile after successful login
      toast({ title: 'Sucesso', description: 'Login bem-sucedido!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro de Login', description: error.message || 'Credenciais inválidas.', variant: 'destructive' });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear(); // Clear all query cache on logout
      toast({ title: 'Logout', description: 'Você foi desconectado.' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro de Logout', description: error.message || 'Não foi possível desconectar.', variant: 'destructive' });
    },
  });

  const login = useCallback(async (credentials: any) => {
    await loginMutation.mutateAsync(credentials);
  }, [loginMutation]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const value = {
    isAuthenticated,
    user: user || null,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Session } from '@/types';
import { sessionsService } from '@/services/sessions';

interface SessionContextType {
  session: Session | null;
  tableId: string | null;
  isLoading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const STORAGE_KEY = 'agilizai_session';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Get tableId (CUID) from URL
      const params = new URLSearchParams(window.location.search);
      const urlTableId = params.get('tableId');

      if (!urlTableId) {
        // Fallback for environments without a QR code, like local development.
        // This is not ideal for production. A proper landing page or scanner app would be better.
        setError("ID da mesa não fornecido. Escaneie o QR code da sua mesa.");
        setIsLoading(false);
        return;
      }

      setTableId(urlTableId);

      // 2. Check for existing session in localStorage
      const storedSessionId = localStorage.getItem(`${STORAGE_KEY}_id_${urlTableId}`);
      
      if (storedSessionId) {
        // 3. Validate session is still active
        try {
          const storedSession = await sessionsService.getById(storedSessionId);
          if (storedSession && storedSession.status === 'ACTIVE') {
            setSession(storedSession);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          // Session not found or invalid, proceed to create a new one.
        }
      }

      // 4. No valid session - check if there's an active one for this table
      let activeSession = await sessionsService.getActiveByTableId(urlTableId);
      
      if (!activeSession) {
        // 5. Create new session if no active one exists
        activeSession = await sessionsService.create(urlTableId);
      }

      // 6. Save session ID to localStorage
      localStorage.setItem(`${STORAGE_KEY}_id_${urlTableId}`, activeSession.id);
      setSession(activeSession);
    } catch (err) {
      setError('Erro ao conectar. Tente escanear o QR code novamente.');
      console.error('Session init error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (!tableId || !session) return;
    try {
      const updatedSession = await sessionsService.getById(session.id);
      if (updatedSession) {
        setSession(updatedSession);
      }
    } catch (err) {
      console.error('Error refreshing session:', err);
    }
  }, [tableId, session]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  return (
    <SessionContext.Provider value={{ session, tableId, isLoading, error, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

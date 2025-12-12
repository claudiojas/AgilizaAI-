import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { WSMessage } from '@/types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

export const useOrderSubscription = (sessionId: string | null) => {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!sessionId || wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_URL}/ws/kitchen`);

    ws.onopen = () => {
      console.log(`WebSocket connected for session ${sessionId}`);
    };

    ws.onmessage = (event) => {
      try {
        const wsEvent: WSMessage = JSON.parse(event.data);
        
        // Invalidate session orders on any relevant update
        if (wsEvent.type === 'NEW_ORDER' || wsEvent.type === 'ORDER_STATUS_UPDATED') {
            // The query key for orders in this app is ['orders', sessionId]
            queryClient.invalidateQueries({ queryKey: ['orders', sessionId] });
        }
        
      } catch (error) {
        console.error('Error parsing WebSocket message for session:', error);
      }
    };

    ws.onclose = () => {
      console.log('Session WebSocket disconnected, attempting to reconnect...');
      reconnectTimeoutRef.current = setTimeout(connect, 5000);
    };

    ws.onerror = (error) => {
      console.error('Session WebSocket error:', error);
      ws.close();
    };

    wsRef.current = ws;
  }, [queryClient, sessionId]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  useEffect(() => {
    if (sessionId) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [sessionId, connect, disconnect]);

  return { isConnected: wsRef.current?.readyState === WebSocket.OPEN };
};

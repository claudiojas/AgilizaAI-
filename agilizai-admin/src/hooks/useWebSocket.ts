import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { WSEvent, Order } from '@/types';
import { toast } from '@/hooks/use-toast';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

export const useKitchenWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_URL}/ws/kitchen`);

    ws.onopen = () => {
      console.log('WebSocket connected to kitchen');
    };

    ws.onmessage = (event) => {
      try {
        const wsEvent: WSEvent = JSON.parse(event.data);

        switch (wsEvent.type) {
          case 'NEW_ORDER':
            // Add new order to cache and show notification
            queryClient.invalidateQueries({ queryKey: ['orders', 'kitchen'] });

            toast({
              title: '🔔 Novo Pedido!',
              description: `Mesa ${wsEvent.payload.session?.table?.number} - ${wsEvent.payload.orderItems?.length} item(s)`,
            });

            // Play notification sound
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => {});
            break;

          case 'ORDER_STATUS_UPDATED':
            // Invalidate orders to refetch
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, attempting to reconnect...');
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.close();
    };

    wsRef.current = ws;
  }, [queryClient]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return { isConnected: wsRef.current?.readyState === WebSocket.OPEN };
};

export const useSessionWebSocket = (sessionId: string) => {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_URL}/ws/kitchen`); // Connect to the same kitchen endpoint

    ws.onopen = () => {
      console.log(`WebSocket connected for session ${sessionId}`);
    };

    ws.onmessage = (event) => {
      try {
        const wsEvent: WSEvent = JSON.parse(event.data);
        
        // Invalidate session orders on any relevant update
        if (wsEvent.type === 'NEW_ORDER' || wsEvent.type === 'ORDER_STATUS_UPDATED') {
          queryClient.invalidateQueries({ queryKey: ['orders', 'session', sessionId] });
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
    return disconnect;
  }, [sessionId, connect, disconnect]);

  return { isConnected: wsRef.current?.readyState === WebSocket.OPEN };
};

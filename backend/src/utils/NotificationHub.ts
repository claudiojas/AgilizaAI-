import WebSocket from 'ws';
import { IOrder } from '../interfaces/order.interface';

class NotificationHub {
  private kitchenClients: Set<WebSocket> = new Set();
  private sessionClients: Map<string, Set<WebSocket>> = new Map();

  addClient(ws: WebSocket, type: 'kitchen' | 'session', sessionId?: string) {
    if (type === 'kitchen') {
      this.kitchenClients.add(ws);
      ws.on('close', () => {
        this.kitchenClients.delete(ws);
      });
    } else if (type === 'session' && sessionId) {
      if (!this.sessionClients.has(sessionId)) {
        this.sessionClients.set(sessionId, new Set());
      }
      this.sessionClients.get(sessionId)?.add(ws);
      ws.on('close', () => {
        const session = this.sessionClients.get(sessionId);
        if (session) {
          session.delete(ws);
          if (session.size === 0) {
            this.sessionClients.delete(sessionId);
          }
        }
      });
    }
  }

  broadcastToKitchen(message: { type: string; payload: IOrder }) {
    const stringifiedMessage = JSON.stringify(message);
    this.kitchenClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(stringifiedMessage);
      }
    });
  }

  broadcastToSession(sessionId: string, message: { type: string; payload: unknown }) {
    const clients = this.sessionClients.get(sessionId);
    if (clients) {
      const stringifiedMessage = JSON.stringify(message);
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(stringifiedMessage);
        }
      });
    }
  }
}

export const notificationHub = new NotificationHub();
import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { notificationHub } from '../utils/NotificationHub';

export function handleWebSocketConnections(wss: WebSocketServer) {
  wss.on('connection', (socket: WebSocket, request: IncomingMessage) => {
    const url = request.url || '';

    if (url.startsWith('/ws/kitchen')) {
      notificationHub.addClient(socket, 'kitchen');

    } else if (url.startsWith('/ws/session/')) {
      const sessionId = url.split('/')[3];
      if (sessionId) {
        notificationHub.addClient(socket, 'session', sessionId);
      } else {
        console.log('[Backend-Router] Session connection received without sessionId. Closing.');
        socket.close();
      }
    } else {
      console.log(`[Backend-Router] Unknown WebSocket connection to "${url}". Closing.`);
      socket.close();
    }

    // Ping-pong to keep all connections alive
    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.ping();
      } else {
        clearInterval(pingInterval);
      }
    }, 30000);

    socket.on('close', () => {
      clearInterval(pingInterval);
    });
  });
}
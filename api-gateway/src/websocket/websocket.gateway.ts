import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, Socket>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove user from connected users map
    for (const [userId, socket] of this.connectedUsers.entries()) {
      if (socket.id === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: { userId: string }) {
    this.connectedUsers.set(payload.userId, client);
    void client.join(`user_${payload.userId}`);
    console.log(`User ${payload.userId} joined`);
  }

  // Method to emit event_created to friends
  emitEventCreated(userIds: string[], eventData: any) {
    userIds.forEach((userId) => {
      this.server.to(`user_${userId}`).emit('event_created', eventData);
    });
  }

  // Method to emit leaderboard_updated to event creator
  emitLeaderboardUpdated(userId: string, eventData: any) {
    this.server.to(`user_${userId}`).emit('leaderboard_updated', eventData);
  }
}

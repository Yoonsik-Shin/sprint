import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { NotificationStudyPayload } from './socket.types';

@WebSocketGateway({
  // transports: ['websocket'],
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly socketService: SocketService) {}

  handleConnection(client: Socket) {
    return this.socketService.onConnect(client);
  }

  handleDisconnect(client: Socket) {
    return this.socketService.onDisconnect(client);
  }

  @SubscribeMessage('studyAttendRequest')
  studyAttendRequest(client: Socket, payload: NotificationStudyPayload) {
    return this.socketService.studyAttendRequest(client, payload, this.server);
  }

  @SubscribeMessage('studyRequestAccept')
  studyRequestAccept(client: Socket, payload: NotificationStudyPayload) {
    return this.socketService.studyRequestAccept(client, payload, this.server);
  }

  @SubscribeMessage('studyRequestReject')
  studyRequestReject(client: Socket, payload: NotificationStudyPayload) {
    return this.socketService.studyRequestReject(client, payload, this.server);
  }
}

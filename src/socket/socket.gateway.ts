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
  transports: ['websocket'],
  cors: {
    origin: ['http://localhost:5173', process.env.BASE_URL],
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

  // 스터디룸 채팅방 생성
  @SubscribeMessage('createChatRoom')
  createChatRoom(client: Socket, payload: ChatMsgPayload) {
    return this.socketService.createChatRoom(client, payload, this.server);
  }

  // 스터디방 입장시
  @SubscribeMessage('enterStudyRoom')
  async enterStudyRoom(client: Socket, payload: EnterStudyRoomPayload) {
    return this.socketService.enterStudyRoom(client, payload, this.server);
  }

  // 스터디방 퇴장시
  @SubscribeMessage('leaveStudyRoom')
  leaveStudyRoom(client: Socket, payload) {
    return this.socketService.leaveStudyRoom(client, payload, this.server);
  }

  // 스터디 채팅 입력시
  @SubscribeMessage('sendChatMsg')
  sendChatMsg(client: Socket, payload: ChatMsgPayload) {}
}

export type EnterStudyRoomPayload = {
  userEmail: string;
  userId: string;
  studyId: number;
  studyName: string;
};

export type ChatMsgPayload = {
  userId: string;
  studyId: number;
  chatRoomName: string;
};

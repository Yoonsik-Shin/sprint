import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', process.env.BASE_URL],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  // 새 채팅 작성
  @SubscribeMessage('newChatSend')
  newChatSend(client: Socket, payload: any) {
    return this.chatService.newChatSend(client, payload, this.server);
  }

  @SubscribeMessage('sameChatUser')
  sameChatUser(client: Socket, payload: any) {
    return this.chatService.sameChatUser(client, payload, this.server);
  }
}

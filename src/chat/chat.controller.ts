import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatRoomId')
  fetchChatRoomMessage(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.fetchChatRoomMessage(chatRoomId);
  }
}

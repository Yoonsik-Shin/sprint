import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatRoomId')
  fetchChatRoomMessage(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.fetchChatRoomMessage(chatRoomId);
  }
}

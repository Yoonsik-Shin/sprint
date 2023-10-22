import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import {
  ChatMessage,
  ChatMessageSchema,
} from '../mongo/schemas/chat-message.schema';
import { StudyMember, StudyMemberSchema } from '../mongo/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: StudyMember.name, schema: StudyMemberSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}

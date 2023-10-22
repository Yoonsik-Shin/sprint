import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import {
  ChatRoom,
  ChatRoomSchema,
  StudyMember,
  StudyMemberSchema,
  Notification,
  NotificationSchema,
} from '../mongo/schemas';
import {
  StudyRequestStatus,
  StudyRequestStatusSchema,
} from '../mongo/schemas/study-request-status';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: StudyMember.name, schema: StudyMemberSchema },
      { name: StudyRequestStatus.name, schema: StudyRequestStatusSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    UsersModule,
  ],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}

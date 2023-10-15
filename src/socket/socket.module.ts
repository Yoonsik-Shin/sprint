import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import {
  Notification,
  NotificationSchema,
} from '../mongo/schemas/notification.schema';
import { SocketService } from './socket.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    UsersModule,
  ],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}

import { UsersService } from './../users/users.service';
import { USER_RELATIONS } from './../users/enum/users.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { Notification } from '../mongo/schemas/notification.schema';
import { Socket, Server } from 'socket.io';
import { BadRequestException } from '@nestjs/common';
import { NotificationStudyPayload } from './socket.types';

@Injectable()
export class SocketService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectRedis()
    private readonly redis: Redis,
    private readonly usersService: UsersService,
  ) {}

  async onConnect(client: Socket) {
    // --- 소켓 연결시
    const userId = client.handshake.auth.userId;
    // MongoDB에서 userId로 알림 내용(NotificationSchema) 불러옴
    const notifications = await this.notificationModel.find({
      toUserId: userId,
    });
    client.emit('fetch-notifications', notifications);

    // UserId와 socketId를 MongoDB(or Redis)에 저장 (ConnectedUserSchema)
    const isStored = await this.redis.set(userId, client.id);
    if (isStored === 'OK') console.log('success Store');
  }

  async onDisconnect(client: Socket) {
    // --- 소켓 연결 해제시
    // MongoDB에 저장된 UserId와 socketId 정보 삭제 (ConnectedUserSchema)
    const userId = client.handshake.auth.userId;
    const isDeleted = await this.redis.del(userId);
    if (isDeleted === 1) console.log('success Delete');
  }

  async studyAttendRequest(
    client: Socket,
    payload: NotificationStudyPayload,
    server: Server,
  ) {
    const { action, toUserId, fromUserId } = payload;

    // 이미 신청한 스터디인지 확인하는 로직
    const isExist = await this.notificationModel
      .findOne()
      .where({ toUserId, action })
      .exec();
    if (isExist) throw new BadRequestException('이미 신청중인 스터디입니다.');

    // MongoDB에 알림 내용(NotificationSchema) 저장
    const fromUser = await this.usersService.findUserWithRelations(
      fromUserId,
      USER_RELATIONS.Profile,
      USER_RELATIONS.DevCareer,
      USER_RELATIONS.TechStacks,
    );
    delete fromUser.password;
    const newNotification = await this.notificationModel.create({
      ...payload,
      fromUser,
    });

    // 만약 redis에서 toUserId로 조회하여 sid값이 있다면, 소켓으로 알림내용 보내줌
    const toUserSid = await this.redis.get(toUserId);
    if (toUserSid)
      server.to(toUserSid).emit('new-notification', newNotification);
  }

  async studyRequestAccept(
    client: Socket,
    payload: NotificationStudyPayload,
    server: Server,
  ) {
    const { fromUserId, toUserId } = payload;
    const fromUser = await this.usersService.findUserWithRelations(
      fromUserId,
      USER_RELATIONS.Profile,
    );
    delete fromUser.password;
    const newNotification = await this.notificationModel.create({
      ...payload,
      fromUser,
    });

    // 만약 redis에서 toUserId로 조회하여 sid값이 있다면, 소켓으로 알림내용 보내줌
    const toUserSid = await this.redis.get(toUserId);
    if (toUserSid)
      server.to(toUserSid).emit('new-notification', newNotification);
  }

  async studyRequestReject(
    client: Socket,
    payload: NotificationStudyPayload,
    server: Server,
  ) {
    const { fromUserId, toUserId } = payload;
    const fromUser = await this.usersService.findUserWithRelations(
      fromUserId,
      USER_RELATIONS.Profile,
    );
    delete fromUser.password;
    const newNotification = await this.notificationModel.create({
      ...payload,
      fromUser,
    });

    // 만약 redis에서 toUserId로 조회하여 sid값이 있다면, 소켓으로 알림내용 보내줌
    const toUserSid = await this.redis.get(toUserId);
    if (toUserSid)
      server.to(toUserSid).emit('new-notification', newNotification);
  }
}

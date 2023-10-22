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
import { ChatMsgPayload, EnterStudyRoomPayload } from './socket.gateway';
import { ChatRoom, StudyMember } from '../mongo/schemas';
import { StudyRequestStatus } from '../mongo/schemas/study-request-status';

@Injectable()
export class SocketService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
    @InjectModel(StudyMember.name)
    private readonly studyMemberModel: Model<StudyMember>,
    @InjectModel(StudyRequestStatus.name)
    private readonly StudyRequestStatusModel: Model<StudyRequestStatus>,
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
    // fromUser : 신청자 // toUser : 스터디장
    const { action, toUserId, fromUserId, studyId } = payload;

    // 이미 신청한 스터디인지 확인하는 로직
    const isExist = await this.notificationModel
      .findOne()
      .where({ toUserId, studyId, action })
      .exec();
    if (isExist) throw new BadRequestException('이미 신청중인 스터디입니다.');

    //mongoDB에 스터디 신청 요청 여부 저장
    await this.StudyRequestStatusModel.create({
      studyId,
      userId: fromUserId,
    });

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
    // fromUser : 스터디장 // toUser : 신청자
    const { fromUserId, toUserId, studyId } = payload;
    const fromUser = await this.usersService.findUserWithRelations(
      fromUserId,
      USER_RELATIONS.Profile,
    );
    delete fromUser.password;
    const newNotification = await this.notificationModel.create({
      ...payload,
      fromUser,
    });

    // MongoDB StudyMember에 추가
    this.studyMemberModel.create({
      userId: toUserId,
      studyId,
      status: 'false',
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

  async createChatRoom(
    client: Socket,
    payload: ChatMsgPayload,
    server: Server,
  ) {
    const { userId, studyId, chatRoomName } = payload;
    // 이름이 같은 채팅방이 존재하는지 확인
    const isExist = await this.chatRoomModel
      .findOne()
      .where({ chatRoomName })
      .exec();
    if (isExist)
      throw new BadRequestException('이미 존재하는 채팅룸 이름입니다.');

    // mongoDB에 새 chatRoom 정보 저장
    const newChatRoom = await this.chatRoomModel.create(payload);

    // 접속중인 스터디원 확인
    const studyMembers = await this.studyMemberModel
      .find()
      .where({ studyId })
      .exec();
    const isConnectedMembers = await Promise.all(
      studyMembers.map((studyMember) => this.redis.get(studyMember.userId)),
    );

    // 접속중인 스터디원에게 새 채팅룸 정보 제공
    server.to(isConnectedMembers).emit('new-chat-room', newChatRoom);
  }

  async enterStudyRoom(
    client: Socket,
    payload: EnterStudyRoomPayload,
    server: Server,
  ) {
    const { userId, studyId, studyName, userEmail } = payload;
    console.log('✔️  enter -------------------------');
    console.log('✔️  studyId:', typeof studyId);
    console.log('✔️  studyId:', studyId);
    console.log('✔️  userId:', userId);
    // mongoDB에서 스터디원 상태정보 찾기
    const studyMembers = await this.studyMemberModel
      .find()
      .where({ studyId })
      .exec();
    // console.log('✔️  studyMembers:', studyMembers);

    // 스터디원 상태정보 갱신 후, 접속중인 스터디원에게 상태정보 뿌리기
    const currentMemberStatus = await Promise.all(
      studyMembers.map((studyMember) => {
        if (studyMember.userId === userId) {
          return this.studyMemberModel.findOneAndUpdate(
            { userId, studyId },
            { $set: { status: true } },
            { new: true },
          );
        }
        return studyMember;
      }),
    );
    // console.log('✔️  currentMemberStatus:', currentMemberStatus);

    // client.emit('fetch-member-status', currentMemberStatus);

    // 접속중인 스터디원 확인
    // const isConnectedMembers = await Promise.all(
    //   studyMembers.map((studyMember) => this.redis.get(studyMember.userId)),
    // );

    const onlineMembers = currentMemberStatus.filter(
      (studyMember) => studyMember.status === true,
      // && studyMember.userId !== userId,
    );
    // console.log('✔️  onlineMembers:', onlineMembers);

    const onlineMemberSIds = await Promise.all(
      onlineMembers.map((studyMember) => this.redis.get(studyMember.userId)),
    );
    console.log('✔️  onlineMemberSIds:', onlineMemberSIds);
    // console.log('✔️  onlineMemberSIds:', onlineMemberSIds);

    // 접속중인 스터디원에게 새 멤버 정보 제공
    server.to(onlineMemberSIds).emit('new-member-status', currentMemberStatus);

    // 모든 채팅방에 접속한 유저 JOIN
    const chatRooms = await this.chatRoomModel.find().where({ studyId }).exec();
    console.log('✔️  chatRooms:', chatRooms);
    chatRooms.forEach((chatRoom) => client.join(String(chatRoom._id)));

    // 채팅방 정보 뿌리기
    server.to(onlineMemberSIds).emit('fetch-chat-room', chatRooms);
  }

  async leaveStudyRoom(client: Socket, payload, server: Server) {
    // 떠난 스터디 mongoDB (StudyMember) false로 상태 갱신
    const { studyId, userId } = payload;
    console.log('✔️  leave -------------------------');
    console.log('✔️  userId:', userId);
    console.log('✔️  studyId:', studyId);

    const leavedStudyMembers = await this.studyMemberModel
      .find()
      .where({ studyId })
      .exec();

    const currentMemberStatus = await Promise.all(
      leavedStudyMembers.map((member) => {
        if (member.userId === userId) {
          return this.studyMemberModel.findOneAndUpdate(
            { userId, studyId },
            { $set: { status: false } },
            { new: true },
          );
          // member.status = false;
          // member.save();
        }
        return member;
      }),
    );
    // console.log('✔️ leave --- currentMemberStatus:', currentMemberStatus);

    // 스터디원 상태정보 갱신 후, 접속중인 스터디원에게 상태정보 뿌리기
    // const currentMemberStatus = await Promise.all(
    //   studyMembers.map((studyMember) => {
    //     if (studyMember.userId === userId) {
    //       studyMember.status = false;
    //       return studyMember.save();
    //     }
    //     return studyMember;
    //   }),
    // );
    // console.log('✔️  currentMemberStatus:', currentMemberStatus);

    // 떠난 스터디에 계속 접속중이던 스터디원
    const onlineMembers = currentMemberStatus.filter(
      (studyMember) => studyMember.status === true,
    );
    // console.log('✔️  leave --- onlineMembers:', onlineMembers);

    const onlineMemberSIds = await Promise.all(
      onlineMembers.map((studyMember) => this.redis.get(studyMember.userId)),
    );
    // console.log('✔️ leave --- onlineMemberSIds:', onlineMemberSIds);

    // 접속중인 스터디원에게 새 멤버 정보 제공
    server.to(onlineMemberSIds).emit('new-member-status', currentMemberStatus);
    // const stillRemainedMemberSIds = await Promise.all(
    //   stillRemainedMembers.map((studyMember) =>
    //     this.redis.get(studyMember.userId),
    //   ),
    // );
    // console.log('✔️  stillRemainedMemberSIds:', stillRemainedMemberSIds);

    // console.log('✔️  isConnectedMembers:', isConnectedMembers);
    // isConnectedMembers.filter((member) => member.userId === userId);

    // 접속중인 스터디원에게 새 멤버 정보 제공
    // server
    //   .to(stillRemainedMemberSIds)
    //   .emit('new-member-status', currentMemberStatus);
    // stillRemainedMembers.forEach((member) => {
    //   if (member.userId !== userId) {
    //     server
    //       .to(stillRemainedMemberSIds)
    //       .emit('new-member-status', currentMemberStatus);
    //   }
    // });
  }
}

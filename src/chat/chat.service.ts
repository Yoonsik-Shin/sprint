import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Server, Socket } from 'socket.io';
import { Model } from 'mongoose';
import { ChatMessage } from '../mongo/schemas/chat-message.schema';
import { StudyMember } from '../mongo/schemas';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Injectable()
export class ChatService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
    @InjectModel(StudyMember.name)
    private readonly studyMemberModel: Model<StudyMember>,
  ) {}

  async fetchChatRoomMessage(chatRoomId: string) {
    const chatMessages = await this.chatMessageModel
      .find()
      .where({ chatRoomId })
      .sort({ createdAt: -1 })
      .exec();
    return chatMessages.reverse();
  }

  async newChatSend(client: Socket, payload: ChatMessageType, server: Server) {
    const { studyId, chatRoomId, userId, contents } = payload;
    // 마지막에 보낸 사람인지 검증
    // const [lastMessage] = await this.chatMessageModel
    //   .find()
    //   .where({ chatRoomId })
    //   .sort({ createdAt: -1 })
    //   .limit(1)
    //   .exec();
    // console.log('✔️  lastMessage:', lastMessage);

    // let chatMessage;

    // const [receivedContent] = contents;
    // const condition = lastMessage && lastMessage.userId === userId;
    // console.log('✔️  condition:', condition);
    // console.log('✔️  userId:', userId);
    // if (condition) {
    //   lastMessage.contents.push(receivedContent);
    //   chatMessage = await this.chatMessageModel.findOneAndUpdate(
    //     { chatRoomId, userId },
    //     { $set: { contents: lastMessage.contents } },
    //     { new: true },
    //   );
    //   console.log('✔️  chatMessage:', chatMessage);
    // } else {
    // 새 채팅 mongoDB에 저장
    const chatMessage = await this.chatMessageModel.create({
      ...payload,
      contents,
      createdAt: new Date(),
    });
    console.log('✔️  chatMessage:', chatMessage);

    // 채팅룸에 있는 스터디원에게 새 채팅내역 전송
    const studyMembers = await this.studyMemberModel
      .find()
      .where({ studyId, status: true })
      .exec();
    const isConnectedMembers = await Promise.all(
      studyMembers.map((studyMember) =>
        this.redis.get(`sid:${studyMember.userId}`),
      ),
    );
    console.log('✔️  isConnectedMembers:', isConnectedMembers);

    server.to(isConnectedMembers).emit('new-chat-message', chatMessage);
    // TODO: 어플에 접속중인 스터디원에게 알림
  }

  async sameChatUser(client: Socket, payload: any, server: Server) {
    const { chatRoomId, messageId, contents, oldDataId } = payload;
    console.log('✔️  contents:', contents);
    console.log('✔️  messageId:', messageId);
    console.log('✔️  oldDataId:', oldDataId);
    const targetMessage = await this.chatMessageModel
      .findOneAndUpdate(
        { _id: messageId },
        { $set: { contents } },
        { new: true },
      )
      .exec();
    console.log('✔️  targetMessage:', targetMessage);

    const deletedMessage = await this.chatMessageModel
      .findOneAndRemove({
        _id: oldDataId,
      })
      .exec();
    console.log('✔️  deletedMessage:', deletedMessage);

    // let chatMessage;

    // const [receivedContent] = contents;
    // const condition = lastMessage && lastMessage.userId === userId;
    // console.log('✔️  condition:', condition);
    // console.log('✔️  userId:', userId);
    // if (condition) {
    //   lastMessage.contents.push(receivedContent);
    //   chatMessage = await this.chatMessageModel.findOneAndUpdate(
    //     { chatRoomId, userId },
    //     { $set: { contents: lastMessage.contents } },
    //     { new: true },
    //   );
    //   console.log('✔️  chatMessage:', chatMessage);
  }
}

export type ChatMessageType = {
  chatRoomId: string;
  contents: string[];
  createdAt: Date;
  studyId: number;
  userId: string;
  userNickname: string;
  userProfileImgUrl: string;
  __v?: number;
  _id?: string;
};

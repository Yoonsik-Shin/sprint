import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatMessageDocument = HydratedDocument<ChatMessage>;

@Schema()
export class ChatMessage {
  @Prop()
  chatRoomId: string;

  @Prop()
  userId: string;

  @Prop()
  studyId: number;

  @Prop()
  userProfileImgUrl: string;

  @Prop()
  userNickname: string;

  @Prop()
  createdAt: Date;

  @Prop([String])
  contents: string[];
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
// 유저프로필이미지;
// 유저닉네임;
// 채팅생성시간;
// 채팅내용;
// 채팅방ID

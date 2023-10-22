import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema()
export class ChatRoom {
  @Prop()
  userId: string;

  @Prop()
  studyId: number;

  @Prop()
  chatRoomName: string;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);

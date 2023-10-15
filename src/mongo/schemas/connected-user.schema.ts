import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConnectedUserDocument = HydratedDocument<ConnectedUser>;

@Schema()
export class ConnectedUser {
  @Prop()
  userId: string;

  @Prop()
  socketId: string;
}

export const ConnectedUserSchema = SchemaFactory.createForClass(ConnectedUser);

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop()
  type: string;

  @Prop()
  action: string;

  @Prop({ type: Object })
  contents: object;

  @Prop()
  comment: string;

  @Prop()
  toUserId: string;

  @Prop({ type: Object })
  fromUser: object;

  @Prop()
  studyName: string;

  @Prop()
  studyId: string

  @Prop()
  time: Date;

  @Prop()
  status: boolean;

  @Prop()
  color: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

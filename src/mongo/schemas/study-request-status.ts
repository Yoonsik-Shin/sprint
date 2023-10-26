import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudyRequestStatusDocument = HydratedDocument<StudyRequestStatus>;

@Schema()
export class StudyRequestStatus {
  @Prop()
  studyId: number;

  @Prop()
  userId: string;

  @Prop()
  status: boolean;
}

export const StudyRequestStatusSchema =
  SchemaFactory.createForClass(StudyRequestStatus);

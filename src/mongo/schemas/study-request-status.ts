import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudyRequestStatusDocument = HydratedDocument<StudyRequestStatus>;

@Schema()
export class StudyRequestStatus {
  @Prop()
  studyId: string;

  @Prop()
  userId: string;
}

export const StudyRequestStatusSchema =
  SchemaFactory.createForClass(StudyRequestStatus);

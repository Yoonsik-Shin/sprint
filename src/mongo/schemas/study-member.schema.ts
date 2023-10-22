import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudyMemberDocument = HydratedDocument<StudyMember>;

@Schema()
export class StudyMember {
  @Prop()
  userId: string;

  @Prop()
  studyId: number;

  @Prop()
  status: boolean;
}

export const StudyMemberSchema = SchemaFactory.createForClass(StudyMember);

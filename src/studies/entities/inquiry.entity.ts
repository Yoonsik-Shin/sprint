import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';
import { User } from '../../users/entities/user.entity';
import { Study } from './study.entity';
import { InquiryResponse } from './inquiry-response.entity';

@Entity()
export class Inquiry extends SuperEntity<Inquiry> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  contents: string;

  @OneToOne(() => InquiryResponse, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn()
  inquiryResponse: InquiryResponse;

  @ManyToOne(() => User, (user) => user.inquiries)
  user: User;

  @ManyToOne(() => Study, (study) => study.inquiries)
  study: Study;
}

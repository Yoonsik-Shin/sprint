import { PickType } from '@nestjs/mapped-types';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';

@Entity()
export class Profile extends SuperEntity<Profile> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  nickname: string;

  @Column({ nullable: true })
  profileImg: string;

  @Column({ default: true })
  gender: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}

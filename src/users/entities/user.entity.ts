import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';
import { Profile } from './profile.entity';
import { Job } from './job.entity';
import { DevCareer } from './dev-career.entity';

@Entity()
export class User extends SuperEntity<User> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 128, unique: true })
  email: string;

  @Column({ length: 128, select: false })
  password: string;

  @Column({ default: 'NOT_YET' })
  emailVerified: string;

  @OneToOne(() => Profile, {
    cascade: true,
    onDelete: 'SET NULL',
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn()
  profile: Profile;

  @OneToOne(() => Job)
  @JoinColumn()
  job: Job;

  @OneToOne(() => DevCareer)
  @JoinColumn()
  devCareer: DevCareer;
}
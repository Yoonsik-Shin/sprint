import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';
import { Profile } from './profile.entity';
import { Job } from '../../categories/entities/job.entity';
import { DevCareer } from '../../categories/entities/dev-career.entity';
import { Study } from '../../studies/entities/study.entity';
import { TechStack } from '../../tech-stacks/entities/tech-stack.entity';
import { Inquiry } from '../../studies/entities/inquiry.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends SuperEntity<User> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 128 })
  email: string;

  @Exclude()
  @Column({ length: 128 })
  password: string;

  @Exclude()
  @Column({ default: 'NOT_YET' })
  emailVerified: string;

  @OneToOne(() => Profile, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
    orphanedRowAction: 'soft-delete',
  })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Study, (study) => study.owner, { nullable: true })
  ownedStudies: Study[];

  @OneToMany(() => Inquiry, (inquiry) => inquiry.user)
  inquiries: Inquiry[];

  @ManyToOne(() => Job, (job) => job.users, { nullable: true })
  job: Job;

  @ManyToOne(() => DevCareer, (devCareer) => devCareer.users, {
    nullable: true,
  })
  devCareer: DevCareer;

  @ManyToMany(() => TechStack)
  @JoinTable({ name: 'user_tech_stacks' })
  techStacks: TechStack[];

  @ManyToMany(() => Study, (study) => study.participants)
  @JoinTable({ name: 'participating_studies' })
  participatingStudies: Study[];

  @ManyToMany(() => Study, (study) => study.bookmarkedUsers)
  @JoinTable({ name: 'bookmarked_studies' })
  bookmarkedStudies: Study[];
}

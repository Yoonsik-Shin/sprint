import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';
import { Recruit } from './recruit.entity';
import { User } from '../../users/entities/user.entity';
import { TechStack } from '../../tech-stacks/entities/tech-stack.entity';
import { Inquiry } from './Inquiry.entity';

@Entity()
export class Study extends SuperEntity<Study> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column()
  attendantsLimit: number;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @OneToOne(() => Recruit, { cascade: true })
  @JoinColumn()
  recruit: Recruit;

  @OneToMany(() => Inquiry, (inquiry) => inquiry.study)
  inquiries?: Inquiry[];

  @ManyToOne(() => User, (user) => user.ownedStudies)
  owner?: User;

  @ManyToMany(() => TechStack, { eager: true })
  @JoinTable({ name: 'study_tech_stacks' })
  techStacks?: TechStack[];

  @ManyToMany(() => User, (user) => user.participatingStudies)
  participants?: User[];

  @ManyToMany(() => User, (user) => user.bookmarkedStudies)
  bookmarkedUsers?: User[];
}

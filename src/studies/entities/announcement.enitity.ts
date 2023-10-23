import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';
import { Study } from './study.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Announcement extends SuperEntity<Announcement> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contents: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Study, (study) => study.announcements)
  study: Study;
}

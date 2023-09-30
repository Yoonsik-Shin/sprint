import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';
import { User } from '../../users/entities/user.entity';
import { Study } from './study.entity';

@Entity()
export class Inquiry extends SuperEntity<Inquiry> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  contents: string;

  @ManyToOne(() => User, (user) => user.inquiries)
  user: User;

  @ManyToOne(() => Study, (study) => study.inquiries)
  study: Study;
}

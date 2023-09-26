import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';
import { User } from './user.entity';

@Entity()
export class Job extends SuperEntity<Job> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  job: string;

  @OneToMany(() => User, (user) => user.job)
  users: User[];
}

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';
import { User } from './user.entity';

@Entity()
export class DevCareer extends SuperEntity<DevCareer> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  devCareer: string;

  @OneToMany(() => User, (user) => user.job)
  users: User[];
}

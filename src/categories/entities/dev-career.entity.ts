import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';
import { User } from '../../users/entities/user.entity';
import { Category } from './category.interface';

@Entity()
export class DevCareer extends SuperEntity<DevCareer> implements Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @OneToMany(() => User, (user) => user.job)
  users: User[];
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';

@Entity()
export class Job extends SuperEntity<Job> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  job: string;
}

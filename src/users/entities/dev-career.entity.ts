import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';

@Entity()
export class DevCareer extends SuperEntity<DevCareer> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  devCareer: string;
}

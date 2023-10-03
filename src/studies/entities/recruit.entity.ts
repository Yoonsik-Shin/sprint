import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';
import { Study } from './study.entity';

@Entity()
export class Recruit extends SuperEntity<Recruit> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column({ default: true })
  isRecruit: boolean;

  @Column({ nullable: true })
  recruitPlaceholder: string;
}

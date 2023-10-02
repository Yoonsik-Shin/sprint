import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';

@Entity()
export class TechStack extends SuperEntity<TechStack> {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  stackName: string;
}

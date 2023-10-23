import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SuperEntity } from '../../commons/entities/super.entity';

@Entity()
export class InquiryResponse extends SuperEntity<InquiryResponse> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contents: string;
}

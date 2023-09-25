import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class SuperEntity<T> {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}

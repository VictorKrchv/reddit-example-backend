import { Column, Entity, UpdateDateColumn } from 'typeorm';
import { AbstractEntity } from '@shared/abstract.entity';

@Entity({ name: 'confirm-user-codes' })
export class ConfirmUserCodeEntity extends AbstractEntity {
  @Column()
  userId: number;

  @Column()
  code: number;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'expired_at',
  })
  expiredAt: Date;
}

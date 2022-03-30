import { Column, Entity, UpdateDateColumn } from 'typeorm';
import { AbstractEntity } from '@shared/abstract.entity';

@Entity({ name: 'reset-password-codes' })
export class ResetPasswordEntity extends AbstractEntity {
  @Column()
  userId: number;

  @Column()
  code: string;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'expired_at',
  })
  expiredAt: Date;
}

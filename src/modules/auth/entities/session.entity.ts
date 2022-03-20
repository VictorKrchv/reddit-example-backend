import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@common/abstract.entity';

@Entity({ name: 'sessions' })
export class SessionEntity extends AbstractEntity {
  @Column()
  userId: number;

  @Column()
  refreshToken: string;
}

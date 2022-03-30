import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@shared/abstract.entity';
import { UserEntity } from '@modules/user/entities';

@Entity({ name: 'sessions' })
export class SessionEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user: UserEntity;

  @Column()
  refreshToken: string;
}

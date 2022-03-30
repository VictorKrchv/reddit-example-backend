import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { UserEntity } from '@modules/user/entities';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {}

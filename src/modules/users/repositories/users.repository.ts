import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { UserEntity } from '@modules/users/entities';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {}

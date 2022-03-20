import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { ResetPasswordEntity } from '@modules/users/entities';

@EntityRepository(ResetPasswordEntity)
export class ResetPasswordCodesRepository extends Repository<ResetPasswordEntity> {}

import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { ResetPasswordEntity } from '@modules/user/entities';

@EntityRepository(ResetPasswordEntity)
export class ResetPasswordCodesRepository extends Repository<ResetPasswordEntity> {}

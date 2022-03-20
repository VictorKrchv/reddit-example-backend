import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { ConfirmUserCodeEntity } from '@modules/users/entities/confirm-user-code.entity';

@EntityRepository(ConfirmUserCodeEntity)
export class ConfirmUserCodesRepository extends Repository<ConfirmUserCodeEntity> {}

import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { ConfirmUserCodeEntity } from '@modules/user/entities';

@EntityRepository(ConfirmUserCodeEntity)
export class ConfirmUserCodesRepository extends Repository<ConfirmUserCodeEntity> {}

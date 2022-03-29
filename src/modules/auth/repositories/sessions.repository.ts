import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { SessionEntity } from '@modules/auth/entities';

@EntityRepository(SessionEntity)
export class SessionsRepository extends Repository<SessionEntity> {}

import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { SessionEntity } from '../entities/session.entity';

@EntityRepository(SessionEntity)
export class SessionsRepository extends Repository<SessionEntity> {}

import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { PostEntity } from '@modules/post/entities';

@EntityRepository(PostEntity)
export class PostsRepository extends Repository<PostEntity> {}

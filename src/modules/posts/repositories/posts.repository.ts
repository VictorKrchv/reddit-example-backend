import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { PostEntity } from '@modules/posts/entities';

@EntityRepository(PostEntity)
export class PostsRepository extends Repository<PostEntity> {}

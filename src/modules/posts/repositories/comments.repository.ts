import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { PostCommentEntity } from '@modules/posts/entities/comment.entity';

@EntityRepository(PostCommentEntity)
export class PostCommentRepository extends Repository<PostCommentEntity> {}

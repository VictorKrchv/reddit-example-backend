import { Injectable, NotFoundException } from '@nestjs/common';
import { PostCommentEntity, PostEntity } from '@modules/posts/entities';
import {
  PostCommentRepository,
  PostsRepository,
} from '@modules/posts/repositories';
import { CreatePostDto } from '@modules/posts/dto/create-post.dto';
import { PageDto, PageOptionsDto } from '@common/dto';
import { CreatePostCommentDto } from '@modules/posts/dto';
import { FindConditions } from 'typeorm';
import { UserEntity } from '@modules/users/entities';
import { Order } from '@common/constants';
import { UsersService } from '@modules/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private postCommentRepository: PostCommentRepository,
    private usersService: UsersService,
  ) {}

  async getPosts(options: PageOptionsDto): Promise<PageDto<PostEntity>> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author');

    const [data, meta] = await queryBuilder.paginate(options);
    return { data, meta };
  }

  async getPostById(id: number): Promise<PostEntity> {
    const post = await this.postsRepository.findOne(
      { id },
      { relations: ['author'] },
    );

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async createPost(dto: CreatePostDto, userId: number): Promise<PostEntity> {
    const entity = this.postsRepository.create({
      ...dto,
      author: { id: userId },
    });

    await this.postsRepository.save(entity);

    return entity;
  }

  getPostComments(
    conditions: FindConditions<PostCommentEntity>,
  ): Promise<PostCommentEntity[]> {
    return this.postCommentRepository.find({
      where: {
        ...conditions,
        parent: null,
      },
      relations: ['children', 'author', 'children.author', 'post'],
      order: {
        createdAt: Order.DESC,
      },
    });
  }

  async createComment(
    postId: number,
    authorId: number,
    dto: CreatePostCommentDto,
  ) {
    const { id } = await this.postCommentRepository.save({
      post: { id: postId },
      author: { id: authorId },
      ...dto,
    });

    return this.postCommentRepository.findOne({
      where: { id },
      relations: ['comments', 'author'],
    });
  }

  async replyComment(
    postId: number,
    parentId: number,
    authorId: number,
    dto: CreatePostCommentDto,
  ): Promise<PostCommentEntity> {
    const { id } = await this.postCommentRepository.save({
      parent: { id: parentId },
      post: { id: postId },
      author: { id: authorId },
      ...dto,
    });

    return this.postCommentRepository.findOne({
      where: { id },
      relations: ['comments', 'author', 'parent'],
    });
  }
}

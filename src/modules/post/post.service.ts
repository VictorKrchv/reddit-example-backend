import { Injectable, NotFoundException } from '@nestjs/common';
import { PostCommentEntity, PostEntity } from '@modules/post/entities';
import {
  PostCommentRepository,
  PostsRepository,
} from '@modules/post/repositories';
import { PageDto, PageOptionsDto } from '@shared/dto';
import { CreatePostCommentDto, CreatePostDto } from '@modules/post/dto';
import { FindConditions } from 'typeorm';
import { Order } from '@shared/constants';
import { UsersRepository } from '@modules/user/repositories';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class PostService {
  constructor(
    private postsRepository: PostsRepository,
    private postCommentRepository: PostCommentRepository,
    private userService: UserService,
    private userRepository: UsersRepository,
  ) {}

  async getPosts(options: PageOptionsDto): Promise<PageDto<PostEntity>> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .orderBy('posts.createdAt', Order.DESC);

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

  async findUserFavoritesPosts(userId: number): Promise<PostEntity[]> {
    const user = await this.userRepository.findOne(userId, {
      relations: ['favorites'],
    });

    return user.favorites;
  }

  async addPostToFavorites(
    userId: number,
    postId: number,
  ): Promise<PostEntity> {
    const post = await this.getPostById(postId);
    const user = await this.userRepository.findOne(userId, {
      relations: ['favorites'],
    });

    const isNotFavorite =
      user.favorites.findIndex((post) => post.id === postId) === -1;

    if (isNotFavorite) {
      user.favorites.push(post);
      post.favoritesCount++;
      await this.postsRepository.save(post);
      await this.userRepository.save(user);
    }

    return post;
  }

  async deletePostFromFavorites(
    userId: number,
    postId: number,
  ): Promise<PostEntity> {
    const post = await this.getPostById(postId);
    const user = await this.userRepository.findOne(userId, {
      relations: ['favorites'],
    });

    const postIndex = user.favorites.findIndex((post) => post.id === postId);

    if (postIndex >= 0) {
      user.favorites.splice(postIndex, 1);
      post.favoritesCount--;
      await this.postsRepository.save(post);
      await this.userRepository.save(user);
    }

    return post;
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
      relations: ['children', 'author'],
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
      relations: ['children', 'author', 'parent'],
    });
  }
}

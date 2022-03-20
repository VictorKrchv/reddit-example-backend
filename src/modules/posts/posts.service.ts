import { Injectable } from '@nestjs/common';
import { PostEntity } from '@modules/posts/entities';
import { PostsRepository } from '@modules/posts/repositories';
import { CreatePostDto } from '@modules/posts/dto/create-post.dto';
import { PageDto, PageOptionsDto } from '@common/dto';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async getPosts(options: PageOptionsDto): Promise<PageDto<PostEntity>> {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author');

    const [data, meta] = await queryBuilder.paginate(options);
    return { data, meta };
  }

  async createPost(dto: CreatePostDto, userId: number): Promise<PostEntity> {
    const entity = this.postsRepository.create({
      ...dto,
      author: { id: userId },
    });

    await this.postsRepository.save(entity);

    return entity;
  }
}

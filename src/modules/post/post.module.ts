import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PostCommentRepository,
  PostsRepository,
} from '@modules/post/repositories';
import { UserModule } from '@modules/user/user.module';
import { UsersRepository } from '@modules/user/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsRepository,
      PostCommentRepository,
      UsersRepository,
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}

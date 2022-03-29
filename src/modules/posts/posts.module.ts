import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PostCommentRepository,
  PostsRepository,
} from '@modules/posts/repositories';
import { UsersModule } from '@modules/users/users.module';
import { UsersRepository } from '@modules/users/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsRepository,
      PostCommentRepository,
      UsersRepository,
    ]),
    forwardRef(() => UsersModule),
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}

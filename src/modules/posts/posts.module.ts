import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsRepository } from '@modules/posts/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([PostsRepository])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}

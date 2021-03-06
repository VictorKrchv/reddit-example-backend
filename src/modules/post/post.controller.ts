import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from '@modules/post/dto/create-post.dto';
import { User } from '@modules/auth/decorators';
import { JwtPayload } from '@modules/auth/types';
import { PostService } from '@modules/post/post.service';
import { LocalAuthGuard } from '@modules/auth/guards';
import { PostCommentEntity, PostEntity } from '@modules/post/entities';
import { CreatePostCommentDto } from '@modules/post/dto';
import { PageDto, PageOptionsDto } from '@shared/dto';

@ApiTags('Посты')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('favorites')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Получить избранные посты',
  })
  findFavoritesPosts(@User() user: JwtPayload): Promise<PostEntity[]> {
    return this.postService.findUserFavoritesPosts(user.id);
  }

  @Get('')
  @ApiOkResponse({ type: PostEntity })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getPosts(
    @Query() options: PageOptionsDto,
  ): Promise<PageDto<PostEntity>> {
    return this.postService.getPosts(options);
  }

  @Get(':id')
  @ApiOkResponse({ type: PostEntity })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.getPostById(Number(id));
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Создать пост',
  })
  @ApiCreatedResponse({ type: PostEntity })
  async createPost(@Body() dto: CreatePostDto, @User() user: JwtPayload) {
    return this.postService.createPost(dto, user.id);
  }

  @Post(':id/favorite')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Добавить пост в избранные',
  })
  addPostToFavorites(
    @User() user: JwtPayload,
    @Param('id') postId: number,
  ): Promise<PostEntity> {
    return this.postService.addPostToFavorites(user.id, postId);
  }

  @Delete(':id/favorite')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Убрать пост из избранных',
  })
  deletePostFromFavorites(
    @User() user: JwtPayload,
    @Param('id') postId: number,
  ): Promise<PostEntity> {
    return this.postService.deletePostFromFavorites(user.id, postId);
  }

  @Get(':id/comments')
  @ApiOkResponse({ type: PostCommentEntity })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getPostCommentsById(
    @Param('id') id: string,
  ): Promise<PostCommentEntity[]> {
    return this.postService.getPostComments({ post: { id: Number(id) } });
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostCommentEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  async createPostComment(
    @Param('id') postId: string,
    @Body() dto: CreatePostCommentDto,
    @User() jwtPayload: JwtPayload,
  ): Promise<PostCommentEntity> {
    const comment = await this.postService.createComment(
      Number(postId),
      jwtPayload.id,
      dto,
    );
    return comment;
  }

  @Post(':postId/comments/reply/:commentId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostCommentEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  async replyPostComment(
    @Param('postId') postId: number,
    @Param('commentId') commentId: number,
    @Body() dto: CreatePostCommentDto,
    @User() jwtPayload: JwtPayload,
  ): Promise<PostCommentEntity> {
    return this.postService.replyComment(postId, commentId, jwtPayload.id, dto);
  }
}

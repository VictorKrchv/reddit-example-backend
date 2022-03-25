import {
  Body,
  ClassSerializerInterceptor,
  Controller,
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
import { CreatePostDto } from '@modules/posts/dto/create-post.dto';
import { User } from '@modules/auth/decorators';
import { JwtPayload } from '@modules/auth/types';
import { PostsService } from '@modules/posts/posts.service';
import { LocalAuthGuard } from '@modules/auth/guards';
import { PageDto, PageOptionsDto } from '@common/dto';
import { PostCommentEntity, PostEntity } from '@modules/posts/entities';
import { CreatePostCommentDto } from '@modules/posts/dto';
import { UsersService } from '@modules/users/users.service';

@ApiTags('Посты')
@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private usersService: UsersService,
  ) {}

  @Get('')
  @ApiOkResponse({ type: PostEntity })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getPosts(
    @Query() options: PageOptionsDto,
  ): Promise<PageDto<PostEntity>> {
    return this.postsService.getPosts(options);
  }

  @Get(':id')
  @ApiOkResponse({ type: PostEntity })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.getPostById(Number(id));
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
    return this.postsService.createPost(dto, user.id);
  }

  @Get(':id/comments')
  @ApiOkResponse({ type: PostCommentEntity })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getPostCommentsById(
    @Param('id') id: string,
  ): Promise<PostCommentEntity[]> {
    return this.postsService.getPostComments({ post: { id: Number(id) } });
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
    const comment = await this.postsService.createComment(
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
    return this.postsService.replyComment(
      postId,
      commentId,
      jwtPayload.id,
      dto,
    );
  }
}

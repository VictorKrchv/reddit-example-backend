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
import { PostEntity } from '@modules/posts/entities';

@ApiTags('Посты')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('')
  @ApiOkResponse({ type: PostEntity })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getPosts(
    @Query() options: PageOptionsDto,
  ): Promise<PageDto<PostEntity>> {
    return this.postsService.getPosts(options);
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
    return this.postsService.createPost(dto, user.sub);
  }
}

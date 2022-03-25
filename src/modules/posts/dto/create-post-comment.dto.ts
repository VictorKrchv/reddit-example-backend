import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostCommentDto {
  @ApiProperty()
  @IsString()
  message: string;
}

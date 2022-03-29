import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@shared/abstract.entity';
import { UserEntity } from '@modules/users/entities';
import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity({ name: 'posts' })
export class PostEntity extends AbstractEntity {
  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  description: string;

  @Column({ default: 0 })
  @ApiProperty()
  visits: number;

  @Column({ default: 0 })
  @ApiProperty()
  favoritesCount: number;

  @ManyToOne(() => UserEntity, (user) => user.posts, { eager: true })
  @ApiModelProperty({ type: () => UserEntity })
  author: UserEntity;
}

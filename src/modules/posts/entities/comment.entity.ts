import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '@common/abstract.entity';
import { UserEntity } from '@modules/users/entities';
import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { PostEntity } from '@modules/posts/entities/post.entity';

@Entity({ name: 'post_comments' })
export class PostCommentEntity extends AbstractEntity {
  @ManyToOne(() => PostEntity)
  post: PostEntity;

  @ManyToOne(() => PostCommentEntity)
  @ApiModelProperty({ type: () => PostCommentEntity })
  parent: PostCommentEntity;

  @Column({ nullable: true })
  @ApiProperty()
  message: string;

  @OneToMany(() => PostCommentEntity, (comment) => comment.parent)
  @ApiModelProperty({ type: () => PostCommentEntity })
  children: PostCommentEntity[];

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @ApiModelProperty({ type: () => UserEntity })
  author: UserEntity;

  @AfterLoad()
  sortChildrenComments() {
    this.children =
      this.children?.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ) || [];
  }
}

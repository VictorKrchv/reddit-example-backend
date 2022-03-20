import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@common/abstract.entity';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { PostEntity } from '@modules/posts/entities';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({ nullable: true })
  @ApiProperty()
  firstName: string;

  @Column({ default: false })
  @ApiProperty()
  isConfirmed: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => PostEntity, (order) => order.author)
  posts: PostEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}

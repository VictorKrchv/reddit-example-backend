import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth/auth.module';
import {
  ConfirmUserCodesRepository,
  ResetPasswordCodesRepository,
  UsersRepository,
} from '@modules/users/repositories';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      UsersRepository,
      ConfirmUserCodesRepository,
      ResetPasswordCodesRepository,
    ]),
  ],
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
